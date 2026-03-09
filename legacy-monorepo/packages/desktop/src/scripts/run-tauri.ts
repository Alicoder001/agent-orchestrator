import { spawn, spawnSync } from "node:child_process";
import { existsSync, unlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

type Mode = "dev" | "build";

function resolveWindowsDevEnvScript(): string | null {
  const root = join(
    process.env["ProgramFiles(x86)"] ?? "C:\\Program Files (x86)",
    "Microsoft Visual Studio",
    "2022",
    "BuildTools",
  );
  const vcVarsPath = join(root, "VC", "Auxiliary", "Build", "vcvars64.bat");
  if (existsSync(vcVarsPath)) return vcVarsPath;

  const launchDevCmdPath = join(
    root,
    "Common7",
    "Tools",
    "LaunchDevCmd.bat",
  );
  if (existsSync(launchDevCmdPath)) return launchDevCmdPath;
  return null;
}

function runWindowsWithDevCmd(mode: Mode): number {
  const devEnvScript = resolveWindowsDevEnvScript();
  if (!devEnvScript) {
    console.error("[desktop-tauri] Visual Studio developer env script not found");
    return 1;
  }

  const args =
    mode === "dev"
      ? "pnpm dlx @tauri-apps/cli dev --config src-tauri/tauri.conf.json"
      : "pnpm dlx @tauri-apps/cli build --config src-tauri/tauri.conf.json";

  const scriptPath = join(tmpdir(), `ao-tauri-${Date.now()}.cmd`);
  writeFileSync(
    scriptPath,
    `@echo off\r\ncall "${devEnvScript}"\r\nif errorlevel 1 exit /b %errorlevel%\r\n${args}\r\n`,
    "utf8",
  );

  const result = spawnSync("cmd.exe", ["/d", "/c", scriptPath], {
    stdio: "inherit",
    env: process.env,
  });
  unlinkSync(scriptPath);

  return result.status ?? 1;
}

async function main(): Promise<void> {
  const mode = (process.argv[2] === "build" ? "build" : "dev") as Mode;
  let code = 0;

  if (process.platform === "win32") {
    code = runWindowsWithDevCmd(mode);
  } else {
    const args =
      mode === "dev"
        ? ["dlx", "@tauri-apps/cli", "dev", "--config", "src-tauri/tauri.conf.json"]
        : ["dlx", "@tauri-apps/cli", "build", "--config", "src-tauri/tauri.conf.json"];
    code = await new Promise<number>((resolve) => {
      const child = spawn("pnpm", args, {
        stdio: "inherit",
        shell: false,
        env: process.env,
      });
      child.on("exit", (exitCode) => resolve(exitCode ?? 1));
    });
  }

  process.exit(code);
}

main().catch((err) => {
  console.error("[desktop-tauri] failed", err);
  process.exit(1);
});
