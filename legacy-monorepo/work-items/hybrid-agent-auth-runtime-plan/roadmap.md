# Hybrid Agent Auth + Runtime Roadmap

## Document Control

- Owner: Platform Engineering
- Status: Draft for alignment
- Last updated: 2026-02-22
- Planning horizon: 10 weeks (2026-02-23 to 2026-05-03)

## 1. Objective

Enable Agent Orchestrator to run workers and orchestrator sessions with either:

- CLI-auth mode (local authenticated state from agent CLI), or
- API-key mode (explicit env-based credentials),

while preserving security policy, predictable behavior, and operational visibility.

## 2. Scope Boundaries

### In scope (MVP)

- Per-project and per-session auth mode selection.
- Capability checks before spawn (binary + auth readiness).
- Unified preflight diagnostics for `claude-code`, `codex`, and `zai`.
- Policy controls for allowed auth modes per environment.
- Audit trail for auth mode and credential source type (never secret values).
- Dashboard and CLI visibility for auth/runtime state.

### Out of scope (MVP)

- Secret vault management service.
- Multi-tenant organization-level SSO orchestration.
- Full remote credential broker.

## 3. Milestone Timeline

| Milestone | Date Range | Outcome | Exit Gate |
| --- | --- | --- | --- |
| M0 Discovery Lock | 2026-02-23 to 2026-03-01 | Auth/runtime architecture and policy model locked | ADR + policy matrix signed |
| M1 Foundation | 2026-03-02 to 2026-03-15 | Config schema, preflight engine, and baseline diagnostics | Spawn blocked on invalid auth state |
| M2 Vertical Slice | 2026-03-16 to 2026-03-30 | End-to-end per-project auth mode in CLI + dashboard | Demo: same project can run key and cli modes |
| M3 Hardening | 2026-03-31 to 2026-04-20 | Security controls, observability, and failure recovery | P0/P1 auth regressions closed |
| M4 GA Readiness | 2026-04-21 to 2026-05-03 | Docs, migration, and release operations | GA checklist complete |

## 4. Deliverables by Milestone

## M0 Discovery Lock

- Auth mode taxonomy: `cli`, `api-key`, `auto`.
- Agent capability map and constraints.
- Environment policy matrix (dev/staging/prod).
- ADR set for auth mode resolution and fallback.

## M1 Foundation

- Config schema extension for auth mode and key env names.
- Preflight service (`ao auth doctor`) with machine-readable output.
- Spawn gate: fail-fast with actionable remediation.
- Metadata/audit schema for auth source tracking.

## M2 Vertical Slice

- CLI commands to set and inspect auth mode.
- Dashboard auth/runtime health indicators.
- Session creation path with explicit auth mode resolution for both `spawn` and `spawnOrchestrator` flows.
- Dashboard diagnostics parity for configured agents (`claude-code`, `codex`, `zai`).
- Structured error categories (missing binary, missing login, missing key, policy deny).

## M3 Hardening

- Policy enforcement for restricted environments.
- Secret-safe logging and redaction tests.
- Recovery path when auth expires during long-running sessions.
- Reliability tests for mixed-mode parallel workers.

## M4 GA Readiness

- Migration guide for existing configs.
- Operations runbook and incident playbook.
- Final compatibility matrix and sign-off.

## 5. Success Metrics

| Metric | Target by M3 | Target by GA |
| --- | --- | --- |
| Spawn success rate when prerequisites met | >= 97% | >= 99% |
| Preflight false positive rate | <= 5% | <= 2% |
| Auth-related P1 incidents per week | <= 2 | 0 |
| Time to diagnose auth failure | <= 10 min | <= 5 min |
| Credential leakage incidents | 0 | 0 |

## 6. Risks and Mitigation

| Risk | Probability | Impact | Mitigation |
| --- | --- | --- | --- |
| CLI auth format changes by vendors | Medium | High | Capability adapters + versioned probes |
| Mixed auth modes create operator confusion | High | Medium | Explicit mode in status/dashboard + runbook |
| Sensitive info leaks in logs | Medium | High | Redaction middleware + regression suite |
| Plugin behavior mismatch across agents | Medium | Medium | Contract tests per plugin + compatibility matrix |

## 7. Go/No-Go Gates

### Gate to enter hardening (2026-03-31)

- `claude-code`, `codex`, and `zai` pass preflight + spawn with at least one auth mode each.
- CLI and dashboard show auth mode and readiness consistently.
- Policy deny path tested and auditable.

### Gate to ship GA (2026-05-03)

- P0/P1 bugs closed.
- Secret redaction suite green.
- Migration and operational docs approved.
