# Hybrid Agent Auth + Runtime Work Items

## Document Control

- Program: Hybrid Agent Auth + Runtime
- Last updated: 2026-02-22
- Source roadmap: `work-items/hybrid-agent-auth-runtime-plan/roadmap.md`
- Source implementation plan: `work-items/hybrid-agent-auth-runtime-plan/implementation-plan.md`
- Planning window: 2026-02-23 to 2026-05-03

## Usage Rules

- Status values: `TODO`, `IN_PROGRESS`, `BLOCKED`, `DONE`.
- No task is `DONE` without test evidence and DoD proof.
- Critical path tasks cannot be parallelized before dependencies clear.
- Any scope change requires updates in roadmap + implementation plan.

## Critical Path

1. `HRT-001` -> `HRT-007` -> `HRT-100` -> `HRT-102` -> `HRT-200` -> `HRT-203`.
2. `HRT-104` -> `HRT-110` -> `HRT-111` -> `HRT-113` -> `HRT-204` -> `HRT-210`.
3. `HRT-220` -> `HRT-300` -> `HRT-400`.

## Milestone Calendar

| Milestone | Date Range | Required Completion |
| --- | --- | --- |
| M0 Discovery | 2026-02-23 to 2026-03-01 | `HRT-001` to `HRT-009` |
| M1 Foundation | 2026-03-02 to 2026-03-15 | `HRT-100` to `HRT-125` |
| M2 Vertical Slice | 2026-03-16 to 2026-03-30 | `HRT-200` to `HRT-230` |
| M3 Hardening | 2026-03-31 to 2026-04-20 | `HRT-300` to `HRT-340` |
| M4 GA | 2026-04-21 to 2026-05-03 | `HRT-400` to `HRT-420` |

## Backlog

| ID | Status | Phase | Workstream | Task | Depends On | Est. | DoD |
| --- | --- | --- | --- | --- | --- | --- | --- |
| HRT-001 | TODO | M0 | Product | Freeze MVP scope and non-goals for hybrid auth | - | 0.5d | Scope approved by engineering lead |
| HRT-002 | TODO | M0 | Architecture | Define auth mode taxonomy (`auto`, `cli`, `api-key`) | HRT-001 | 0.5d | ADR draft approved |
| HRT-003 | TODO | M0 | Security | Define environment policy matrix for auth modes | HRT-001 | 0.5d | Policy matrix signed |
| HRT-004 | TODO | M0 | Platform | Define typed error taxonomy and remediation hints | HRT-002 | 0.5d | Error catalog approved |
| HRT-005 | TODO | M0 | QA | Define auth compatibility matrix for agents | HRT-002 | 0.5d | Matrix published |
| HRT-006 | TODO | M0 | Program | Discovery sign-off | HRT-003, HRT-004, HRT-005 | 0.5d | Go decision for M1 |
| HRT-007 | TODO | M0 | Architecture | Decide `auto` mode precedence when both CLI and API-key are ready | HRT-002 | 0.5d | ADR decision merged |
| HRT-008 | TODO | M0 | Architecture | Decide auth mode mutability after session start | HRT-002 | 0.5d | ADR decision merged |
| HRT-009 | TODO | M0 | Security | Decide policy deny behavior (hard fail vs privileged override) | HRT-003, HRT-004 | 0.5d | Policy decision merged |
| HRT-100 | TODO | M1 | Core | Extend config schema with auth mode fields | HRT-006, HRT-007, HRT-009 | 1d | Config parsing and defaults tested |
| HRT-101 | TODO | M1 | Core | Implement auth mode resolver precedence | HRT-100 | 1d | Resolver unit tests green |
| HRT-102 | TODO | M1 | Core | Implement spawn preflight gate | HRT-101 | 1.5d | Spawn blocked on invalid auth state |
| HRT-103 | TODO | M1 | Core | Add typed auth failure codes | HRT-102, HRT-004 | 0.5d | API/CLI returns typed errors |
| HRT-104 | TODO | M1 | Core | Add optional auth capability adapter contract without breaking existing `Agent` interface | HRT-006, HRT-100 | 1d | Existing plugins compile without mandatory interface changes |
| HRT-110 | TODO | M1 | Plugin | Add `claude-code` auth capability probe | HRT-104 | 1d | Probe reports cli/env readiness |
| HRT-111 | TODO | M1 | Plugin | Add `codex` auth capability probe | HRT-104 | 1d | Probe reports cli/env readiness |
| HRT-112 | TODO | M1 | Plugin | Add `zai` auth capability probe | HRT-104 | 1d | Probe reports env readiness |
| HRT-113 | TODO | M1 | Plugin | Add plugin contract tests for probes | HRT-110, HRT-111, HRT-112 | 1d | Compatibility suite passes |
| HRT-120 | TODO | M1 | CLI | Add `ao auth status` command | HRT-102, HRT-103 | 0.5d | Command output stable and tested |
| HRT-121 | TODO | M1 | CLI | Add `ao auth doctor --json` command | HRT-113, HRT-120 | 1d | Machine-readable report available |
| HRT-122 | TODO | M1 | CLI | Add `ao spawn --auth-mode` override | HRT-101, HRT-102 | 0.5d | Override path tested |
| HRT-123 | TODO | M1 | Audit | Add metadata fields for resolved auth mode | HRT-102 | 0.5d | Metadata written without secrets |
| HRT-124 | TODO | M1 | Security | Add auth redaction middleware for logs | HRT-102 | 0.5d | No secret value appears in logs |
| HRT-125 | TODO | M1 | QA | Foundation phase gate review | HRT-103, HRT-113, HRT-121, HRT-124 | 0.5d | M2 go decision recorded |
| HRT-200 | TODO | M2 | Integration | Wire preflight + resolver into main spawn flow | HRT-102, HRT-113 | 1d | End-to-end spawn path green |
| HRT-201 | TODO | M2 | Dashboard | Show auth mode + readiness badges in session cards | HRT-123 | 1d | UI reflects backend state |
| HRT-202 | TODO | M2 | Dashboard | Add diagnostics panel for auth failures | HRT-121, HRT-201 | 1d | Remediation hints visible |
| HRT-203 | TODO | M2 | Integration | Apply preflight + resolver to `spawnOrchestrator` / `ao start` flow | HRT-102 | 1d | Orchestrator session uses same auth gating |
| HRT-204 | TODO | M2 | Dashboard | Add `codex` plugin registration and diagnostics parity in web services | HRT-113, HRT-202 | 1d | Dashboard diagnostics support `codex` |
| HRT-210 | TODO | M2 | QA | Vertical slice E2E for `cli` mode | HRT-200, HRT-202 | 1d | E2E scenario passes |
| HRT-211 | TODO | M2 | QA | Vertical slice E2E for `api-key` mode | HRT-200, HRT-202 | 1d | E2E scenario passes |
| HRT-212 | TODO | M2 | QA | Vertical slice E2E for `auto` mode fallback | HRT-200, HRT-202 | 1d | Deterministic fallback validated |
| HRT-220 | TODO | M2 | Security | Enforce policy deny behavior in spawn path | HRT-103, HRT-200 | 1d | Denied mode blocked with audit event |
| HRT-221 | TODO | M2 | Audit | Emit structured auth decision events | HRT-123, HRT-220 | 0.5d | Events queryable by session ID |
| HRT-230 | TODO | M2 | Program | Vertical slice gate review | HRT-203, HRT-204, HRT-210, HRT-211, HRT-212, HRT-220 | 0.5d | M3 go decision recorded |
| HRT-300 | TODO | M3 | Reliability | Handle mid-session auth expiration and recovery hints | HRT-230 | 1d | Session status transitions validated |
| HRT-301 | TODO | M3 | Reliability | Add mixed-mode parallel stress tests | HRT-230 | 1d | Stress suite within error budget |
| HRT-302 | TODO | M3 | Security | Complete secret leakage regression suite | HRT-124, HRT-221 | 1d | Zero leak findings |
| HRT-303 | TODO | M3 | Observability | Add auth-related SLI dashboards | HRT-221 | 1d | SLI board published |
| HRT-304 | TODO | M3 | Ops | Add auth incident runbook and response templates | HRT-300, HRT-303 | 0.5d | Runbook reviewed by on-call |
| HRT-340 | TODO | M3 | Program | Hardening gate review | HRT-301, HRT-302, HRT-303, HRT-304 | 0.5d | M4 go decision recorded |
| HRT-400 | TODO | M4 | Docs | Publish migration guide for existing configs | HRT-340 | 0.5d | Migration doc approved |
| HRT-401 | TODO | M4 | Docs | Publish operator handbook for hybrid auth | HRT-340 | 0.5d | Handbook approved |
| HRT-410 | TODO | M4 | Release | Final compatibility and regression sweep | HRT-340 | 1d | All release tests green |
| HRT-411 | TODO | M4 | Security | Final security sign-off | HRT-302, HRT-410 | 0.5d | Security checklist signed |
| HRT-420 | TODO | M4 | Release | GA readiness sign-off | HRT-400, HRT-401, HRT-410, HRT-411 | 0.5d | Release decision recorded |

## MVP Acceptance Checklist

- Auth mode can be configured globally, per project, and per spawn override.
- Spawn never starts if mode requirements fail.
- `cli` and `api-key` modes both work for supported agents.
- `auto` mode fallback is deterministic and visible.
- Dashboard and CLI expose auth readiness and failure reasons.
- Audit logs capture decisions without leaking secrets.
