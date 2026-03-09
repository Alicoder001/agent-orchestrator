# Workflow Engine

## Maqsad

Ushbu hujjat platformadagi avtomatlashtirilgan workflow'lar — task lifecycle automation, trigger'lar va custom pipeline'larni belgilaydi.

Bu hujjat `project-space-model.md` (task lifecycle), `mode-system.md` (avtonomiylik darajalari) va `event-bus-architecture.md` ga asoslanadi.

---

## V1: Built-in Workflows

V1 da workflow engine alohida modul emas — task lifecycle va session management ichida built-in:

### Session Lifecycle Workflow

```
Trigger: session.spawn requested
  ├── 1. Validate (auth, quotas, project active)
  ├── 2. Create Session record (status: spawning)
  ├── 3. Create workspace (git clone, config)
  ├── 4. Start runtime (tmux session)
  ├── 5. Update status (working)
  └── 6. Emit event (session.spawned)

Trigger: session output → CI fail detected
  ├── 1. Update session status (needs_response)
  ├── 2. Update project attention (critical)
  └── 3. Emit event → notification

Trigger: operator clicks "merge"
  ├── 1. Validate (PR approved, CI pass)
  ├── 2. Call GitHub API (merge PR)
  ├── 3. Update session status (merging → done)
  ├── 4. Cleanup workspace
  └── 5. Update task status (done)
```

### Auto-Trigger Rules (V1)

| Trigger | Action | Condition |
|---------|--------|-----------|
| GitHub webhook: CI pass | Session attention → quiet | Session in review_requested |
| GitHub webhook: CI fail | Session attention → critical | Session in working/review |
| GitHub webhook: PR approved | Session status → ready_to_merge | review_requested |
| Session done + PR merged | Task status → done | Auto |
| Session failed | Task status → in_progress (reopen) | Auto |

---

## V3+: Custom Workflow Engine

Phase 3 da to'liq workflow engine quriladi:

### Workflow Definition (YAML)

```yaml
name: "pr-review-workflow"
trigger:
  event: "session.pr_created"
  condition: "project.mode == 'collaborative'"

steps:
  - name: "auto-review"
    action: "run_code_review"
    config:
      reviewer: "ai-reviewer-agent"
      checks: ["lint", "test", "security"]

  - name: "notify-team"
    action: "send_notification"
    config:
      channel: "slack"
      message: "New PR from {agent_name}: {pr_title}"

  - name: "wait-for-approval"
    action: "wait"
    condition: "pr.approvals >= 1"
    timeout: "24h"

  - name: "auto-merge"
    action: "merge_pr"
    condition: "pr.ci_status == 'pass'"
```

### Workflow Components (V3+)

| Component | Tavsif |
|-----------|--------|
| **Trigger** | Event-based yoki schedule-based |
| **Condition** | Boolean expression — qachon ishlashi kerak |
| **Step** | Bitta action — API call, notification, wait |
| **Action** | Built-in yoki custom (plugin) |
| **Error handling** | Retry, fallback, skip |
| **State** | Workflow instance holati (running, paused, completed, failed) |

---

## Versiya

- v1.0
- Status: **APPROVED**
