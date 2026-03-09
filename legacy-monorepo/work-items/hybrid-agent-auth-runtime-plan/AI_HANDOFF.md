# AI Handoff: Hybrid Agent Auth + Runtime

## Current Repository State

- Branch: `feat/desktop-tauri-foundation`
- Last commit: `7804924` (`feat(desktop): update desktop foundation and planning bundles`)
- Remote push: completed to `origin/feat/desktop-tauri-foundation`
- Working tree: clean (no uncommitted changes)

## Planning Artifacts (Source of Truth)

- `work-items/hybrid-agent-auth-runtime-plan/roadmap.md`
- `work-items/hybrid-agent-auth-runtime-plan/implementation-plan.md`
- `work-items/hybrid-agent-auth-runtime-plan/tasks.md`
- Index entry updated in root `tasks.md`

## Plan Quality Status

- Cross-doc consistency issues were fixed (command naming, missing task IDs, `spawnOrchestrator` scope, `codex` dashboard parity, optional adapter compatibility).
- Remaining intentional open items are tracked as M0 decisions:
  - `HRT-007` (`auto` precedence)
  - `HRT-008` (auth mode mutability)
  - `HRT-009` (policy deny behavior)

## Required Execution Order (Start Here)

1. Complete M0 decision tasks:
- `HRT-007`
- `HRT-008`
- `HRT-009`

2. Start M1 foundation in this order:
- `HRT-100` config schema extension
- `HRT-101` resolver precedence
- `HRT-102` spawn preflight gate
- `HRT-103` typed auth failure codes
- `HRT-104` optional auth capability adapter contract

3. Agent/plugin implementation:
- `HRT-110` (`claude-code`)  
- `HRT-111` (`codex`)  
- `HRT-112` (`zai`)  
- `HRT-113` contract tests

4. CLI and UX surfaces:
- `HRT-120` `ao auth status`
- `HRT-121` `ao auth doctor --json`
- `HRT-122` `ao spawn --auth-mode`

5. M2 must include:
- `HRT-203` (`spawnOrchestrator` / `ao start` auth preflight)
- `HRT-204` web diagnostics parity with `codex`

## Technical Constraints for Next AI

- Repository governance rule applies:
  - Internal code edits (`packages/*`, `scripts/*`, `tests/*`, etc.) require explicit user command:
    `@unlock-internal-edit`
  - Run `pnpm internal:unlock` before commits touching internal code.
- Push policy:
  - Push only to `origin`
  - Never push to `upstream`

## Suggested First Commands

```bash
git checkout feat/desktop-tauri-foundation
pnpm install
pnpm test
```

If internal code edits are needed:

```bash
pnpm internal:unlock
```

## Notes

- `.env` may contain local secrets; do not commit `.env`.
- `.env.example` was sanitized before commit and passed pre-commit leak scan.
