---
name: repo-governance
description: Repository safety policy for agent operations. Use when working in this repo to enforce push restrictions, permission-gated internal edits, and unlock-command workflow.
---

# Repo Governance Skill

Apply these rules for every task in this repository.

## Mandatory Rules

1. Push only to `origin`.
2. Never push to `upstream`.
3. Treat internal code as locked by default.
4. Edit internal code only when user provides: `@unlock-internal-edit`.

## Internal Code Scope

- `packages/**`
- `scripts/**`
- `tests/**`
- `.github/**`
- `.husky/**`
- Root files: `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `tsconfig.base.json`, `eslint.config.js`

## Unlock Workflow

1. User sends explicit command: `@unlock-internal-edit`.
2. Run `pnpm internal:unlock`.
3. Make internal code edits.
4. Commit once; post-commit hook re-locks automatically.

## If Command Is Missing

- Do analysis, review, planning, documentation only.
- Do not change internal code.
- Ask for explicit unlock command.
