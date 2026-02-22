import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

function hasCommand(command: string, args: string[]): boolean {
  const result = spawnSync(command, args, {
    stdio: "ignore",
    shell: false,
  });
  return result.status === 0;
}

function main(): void {
  const missing: string[] = [];

  if (!hasCommand("cargo", ["--version"])) {
    missing.push("Rust toolchain (cargo)");
  }

  if (process.platform === "win32") {
    const inPath = hasCommand("where", ["link.exe"]);
    const fallbackPath = join(
      process.env["ProgramFiles(x86)"] ?? "C:\\Program Files (x86)",
      "Microsoft Visual Studio",
      "2022",
      "BuildTools",
      "VC",
      "Tools",
      "MSVC",
    );
    const hasBuildToolsLayout = existsSync(fallbackPath);

    if (!inPath && !hasBuildToolsLayout) {
      missing.push("MSVC linker (link.exe from Visual Studio Build Tools)");
    }
  }

  if (missing.length > 0) {
    console.error("[desktop-preflight] missing requirements:");
    for (const item of missing) {
      console.error(` - ${item}`);
    }
    if (process.platform === "win32") {
      console.error(
        "[desktop-preflight] install: Visual Studio Build Tools 2022 + Desktop development with C++",
      );
    }
    process.exit(1);
  }

  console.log("[desktop-preflight] ok");
}

main();
