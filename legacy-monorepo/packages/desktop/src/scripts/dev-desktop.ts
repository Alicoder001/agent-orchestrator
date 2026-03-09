import { spawn, type ChildProcess } from "node:child_process";
import net from "node:net";

const host = process.env.AO_DESKTOP_SIDECAR_HOST ?? "127.0.0.1";
const port = Number(process.env.AO_DESKTOP_SIDECAR_PORT ?? "17071");

function runPnpm(script: string): ChildProcess {
  return spawn("pnpm", ["run", script], {
    stdio: "inherit",
    shell: true,
    env: process.env,
  });
}

function isSidecarReachable(timeoutMs = 700): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let done = false;

    const finish = (value: boolean) => {
      if (done) return;
      done = true;
      socket.destroy();
      resolve(value);
    };

    socket.setTimeout(timeoutMs);
    socket.once("connect", () => finish(true));
    socket.once("timeout", () => finish(false));
    socket.once("error", () => finish(false));
    socket.connect(port, host);
  });
}

async function main(): Promise<void> {
  const ui = runPnpm("dev:ui");
  const sidecarAlreadyRunning = await isSidecarReachable();
  const sidecar = sidecarAlreadyRunning ? null : runPnpm("dev:sidecar");

  if (sidecarAlreadyRunning) {
    console.log(`[desktop-dev] detected sidecar at http://${host}:${port}, reusing it`);
  }

  const shutdown = () => {
    if (sidecar && !sidecar.killed) sidecar.kill("SIGTERM");
    if (!ui.killed) ui.kill("SIGTERM");
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  ui.once("exit", (code) => {
    if (sidecar && !sidecar.killed) sidecar.kill("SIGTERM");
    process.exit(code ?? 0);
  });

  sidecar?.once("exit", (code) => {
    if (code && code !== 0) {
      console.error("[desktop-dev] sidecar exited unexpectedly");
    }
  });
}

main().catch((err) => {
  console.error("[desktop-dev] failed to start", err);
  process.exit(1);
});
