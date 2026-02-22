# Agent Governance Rules

These rules are mandatory for all AI agents working in this repository.

## 1) Git Push Policy

- Never push to `upstream`.
- Push only to `origin`.
- If a workflow requests `upstream` push, stop and ask for explicit human override.

## 2) Code Change Permission Policy

- Default mode is read-only for internal code.
- Internal code includes: `packages/`, `scripts/`, `tests/`, `.github/`, `.husky/`, and root build/config files.
- Internal code may be changed only after explicit approval command from the user.

## 3) Approval Command

- Required command in user message: `@unlock-internal-edit`
- Without this exact command, do not perform internal code edits.
- If command is missing, continue with analysis/docs-only work and ask for unlock command.

## 4) Local Commit Guard (Technical Enforcement)

- Run `pnpm internal:unlock` before committing internal code changes.
- Internal code commits are blocked by `.husky/pre-commit` when lock is active.
- Lock is automatically restored after each successful commit via `.husky/post-commit`.
- Check lock status with `pnpm internal:status`.

## 5) Safe Defaults

- When uncertain, do not edit internal code.
- Never bypass hooks or disable guardrails unless explicitly requested by the project owner.
