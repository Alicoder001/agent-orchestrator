#!/usr/bin/env node

import { existsSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const GATE_FILE = resolve(process.cwd(), ".internal-edit-unlock");
const GATE_TOKEN = "ALLOW_INTERNAL_CODE_CHANGES=1";

function printUsage() {
  console.log("Usage: node scripts/internal-edit-gate.mjs <unlock|lock|status>");
}

function unlock() {
  writeFileSync(GATE_FILE, `${GATE_TOKEN}\n`, { encoding: "utf-8", mode: 0o600 });
  console.log("Internal code edit lock: UNLOCKED for next commit.");
  console.log("Reminder: post-commit hook will re-lock automatically.");
}

function lock() {
  if (existsSync(GATE_FILE)) {
    unlinkSync(GATE_FILE);
  }
  console.log("Internal code edit lock: LOCKED.");
}

function status() {
  if (!existsSync(GATE_FILE)) {
    console.log("Internal code edit lock: LOCKED.");
    return;
  }

  const content = readFileSync(GATE_FILE, "utf-8").trim();
  if (content === GATE_TOKEN) {
    console.log("Internal code edit lock: UNLOCKED.");
  } else {
    console.log("Internal code edit lock: LOCKED (invalid token).");
  }
}

const command = process.argv[2];

switch (command) {
  case "unlock":
    unlock();
    break;
  case "lock":
    lock();
    break;
  case "status":
    status();
    break;
  default:
    printUsage();
    process.exitCode = 1;
}
