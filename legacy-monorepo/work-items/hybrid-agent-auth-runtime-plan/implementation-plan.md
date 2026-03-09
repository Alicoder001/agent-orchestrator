# Hybrid Agent Auth + Runtime Implementation Plan

## Document Control

- Owner: Engineering
- Status: Draft for alignment
- Last updated: 2026-02-22
- Related roadmap: `work-items/hybrid-agent-auth-runtime-plan/roadmap.md`

## 1. Implementation Goals

1. Support both authentication paths per agent runtime:
- local CLI-auth session state,
- explicit API key env configuration.
2. Keep auth selection deterministic and observable.
3. Prevent unsafe fallback behavior through policy gates.

## 2. Architecture Decisions

## ADR-1: Explicit auth mode resolution

- Decision: resolve auth mode in this order:
1) session override,
2) project config,
3) global default,
4) `auto` resolution.
- Consequence: every spawn emits resolved mode in metadata and logs.

## ADR-2: Preflight before spawn

- Decision: no runtime/session creation before preflight passes.
- Consequence: avoid half-created sessions and noisy failures.

## ADR-3: Capability adapters per agent

- Decision: each agent plugin provides an auth capability adapter:
`detectBinary`, `detectCliAuth`, `detectApiKeyAuth`, `validateMode`.
- Consequence: consistent control flow, agent-specific probes.
- Constraint: keep `Agent` interface backward-compatible by using an optional adapter contract (no required method additions on existing `Agent`).

## ADR-4: Policy profile enforcement

- Decision: environment policy can allow/deny `cli` and/or `api-key`.
- Consequence: production can enforce key-only if required.

## ADR-5: Secret-safe observability

- Decision: store only auth source type and readiness, never token values.
- Consequence: redaction and structured audit become mandatory.

## 3. Config and Contract Changes

## Config additions

- `defaults.authMode`: `auto | cli | api-key`
- `projects.<id>.authMode`: optional override
- `projects.<id>.agentConfig.apiKeyEnv`: optional explicit env name
- `policies.auth`: allowlist by environment/profile

## Session metadata additions

- `authModeResolved`
- `authSourceType` (`cli`, `env`, `mixed`)
- `authPreflightVersion`
- `authPreflightAt`

## CLI contract additions

- `ao auth status [project]`
- `ao auth doctor [project] [--json]`
- `ao spawn ... --auth-mode <auto|cli|api-key>`

## API/dashboard additions

- Session DTO includes auth mode and readiness.
- Health panel includes agent auth diagnostics.
- Web service plugin registration must include `codex` for diagnostics parity with CLI/core.

## 4. Core Flow

1. Load config and resolve agent plugin.
2. Resolve target auth mode with precedence rules.
3. Run preflight:
- binary exists,
- required auth for mode is available,
- policy allows mode.
4. On success:
- continue spawn with selected mode,
- write metadata/audit fields.
5. On failure:
- return typed error with remediation hint,
- do not create workspace/runtime.

## 5. Workstreams

## WS0 Design and policy

- Lock schema and resolution rules.
- Define typed error taxonomy.

## WS1 Core schema and resolution

- Add config schema fields.
- Implement auth mode resolver and validators.

## WS2 Agent plugin capabilities

- Extend `claude-code`, `codex`, `zai` plugins with capability probes.
- Add compatibility tests for each mode.

## WS3 Spawn pipeline integration

- Add preflight gating in session creation.
- Apply preflight to both `spawn` and `spawnOrchestrator` code paths.
- Add safe fallback logic only in `auto` mode.

## WS4 CLI and dashboard UX

- Implement auth status/doctor commands.
- Add dashboard status badges and diagnostics.
- Ensure dashboard diagnostics cover `claude-code`, `codex`, and `zai`.

## WS5 Security and observability

- Redaction middleware for auth diagnostics.
- Structured audit events and alerting hooks.

## WS6 Migration and release

- Migration path for existing configs.
- Rollout and rollback procedures.

## 6. Validation Strategy

## Unit tests

- auth mode resolver precedence.
- policy enforcement decisions.
- typed error mapping and remediation text.

## Integration tests

- spawn success/failure matrix by auth mode.
- mixed parallel sessions with different modes.
- expired CLI auth and missing env key paths.

## E2E tests

- CLI flow: doctor -> spawn -> status.
- Dashboard flow: diagnostics -> spawn failure handling -> remediation.

## 7. Operational Controls

- Default mode remains `auto` for backward compatibility.
- Production profile can force `api-key` only.
- Audit logs must capture:
- who triggered spawn,
- resolved mode,
- policy decision,
- failure class if rejected.

## 8. Open Decisions

1. Should `auto` prefer `cli` or `api-key` when both are available?
2. Should mode be immutable after session start?
3. Should policy deny be hard fail or privileged override with reason?
