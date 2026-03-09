# Integration Architecture

## Maqsad

Ushbu hujjat platformaning tashqi va ichki integratsiya arxitekturasini belgilaydi: tashqi tizimlar bilan aloqa, ichki contract'lar, event oqimlari va xato boshqarish.

Bu hujjat `system-context.md` (external actors), `bounded-contexts.md` (event communication), `ADR-004` (event bus) va `platform-integration-architecture.md` (adapter model) ga asoslanadi.

---

## Tashqi integratsiyalar

### GitHub Integration (SCM + Issue Tracker)

**Adapter turi:** REST API + Webhook

| Operatsiya | API | Yo'nalish |
|-----------|-----|-----------|
| Repository ma'lumotlari olish | `GET /repos/:owner/:repo` | Platform ← GitHub |
| Branch yaratish | `POST /repos/:owner/:repo/git/refs` | Platform → GitHub |
| PR yaratish | `POST /repos/:owner/:repo/pulls` | Platform → GitHub |
| PR holati olish | `GET /repos/:owner/:repo/pulls/:number` | Platform ← GitHub |
| CI status olish | `GET /repos/:owner/:repo/commits/:sha/status` | Platform ← GitHub |
| Issue sync | `GET /repos/:owner/:repo/issues` | Platform ← GitHub |
| Webhook: PR event | Incoming webhook | GitHub → Platform |
| Webhook: CI status | Incoming webhook | GitHub → Platform |
| Webhook: Issue event | Incoming webhook | GitHub → Platform |

**Authentication:**
- GitHub App (tavsiya) yoki OAuth App token
- Per-organization installation
- Scopes: `repo`, `read:org`, `write:discussion`

**Webhook qoidalari:**
- Webhook secret bilan HMAC validation (`security-architecture.md` L257)
- Retry policy: GitHub 3 marta urinadi
- Failed webhook → log + manual retry imkoniyati

### GitHub Integration Architecture

```
┌──────────────┐        ┌─────────────────┐        ┌──────────────┐
│   GitHub     │───────→│  Webhook        │───────→│  SCM Adapter │
│   (webhook)  │  HMAC  │  Handler        │  Parse │  Service     │
└──────────────┘  valid │  /api/webhooks/ │        └──────┬───────┘
                        │  github         │               │
┌──────────────┐        └─────────────────┘               │ Event
│   GitHub     │                                          ▼
│   REST API   │←────── SCM Adapter ←───── Orchestration Service
└──────────────┘  API calls (create PR,                   │
                  get status, etc.)              Session lifecycle
```

### OAuth Providers

| Provider | Maqsad | Phase |
|----------|--------|-------|
| GitHub | Primary login + SCM access | Phase 1 |
| Google | Login (optional) | Phase 2+ |
| Microsoft | Enterprise SSO | Phase 5 |

### Notification Channels (Phase 2+)

| Channel | Aloqa turi | Tavsif |
|---------|-----------|--------|
| Slack | Outgoing webhook | Session status, PR actions |
| Email | SMTP / SendGrid | Invite, security alerts |
| Desktop | Native push (Tauri) | Attention zone alerts |

---

## Ichki contract'lar

### Module-to-module API

Context'lar o'rtasida **to'g'ridan dependency taqiqlangan** (`bounded-contexts.md` L211-214). Faqat 2 yo'l bor:

#### 1. Event-based (asynchronous)

```go
// Producer (Orchestration context)
s.eventBus.Publish(ctx, Event{
    Type:    "session.status_changed",
    Payload: SessionStatusPayload{
        SessionID: session.ID,
        OldStatus: "working",
        NewStatus: "needs_response",
        ProjectID: session.ProjectID,
    },
    Source: "orchestration",
})

// Consumer (Notification context — event handler)
eventBus.Subscribe("session.status_changed", func(e Event) {
    payload := e.Payload.(SessionStatusPayload)
    if payload.NewStatus == "needs_response" || payload.NewStatus == "critical" {
        notifService.SendAttentionAlert(payload.SessionID, payload.NewStatus)
    }
})
```

#### 2. Query interface (synchronous, read-only)

```go
// Identity context provides
type UserQuerier interface {
    GetUserByID(ctx context.Context, id uuid.UUID) (*UserInfo, error)
    GetUsersByIDs(ctx context.Context, ids []uuid.UUID) ([]*UserInfo, error)
}

// Organization context uses
func (s *OrgService) InviteMember(ctx context.Context, input InviteInput) error {
    user, err := s.userQuerier.GetUserByID(ctx, input.UserID)
    if err != nil {
        return fmt.Errorf("check user: %w", err)
    }
    // ...
}
```

### Event catalog

| Event Type | Source | Consumers | Tavsif |
|-----------|--------|-----------|--------|
| `user.registered` | Identity | Organization | Personal org yaratish |
| `session.spawned` | Orchestration | Notification, Analytics | Session boshlandi |
| `session.status_changed` | Orchestration | Notification, Dashboard | Status o'zgardi |
| `session.pr_created` | Orchestration | Notification | PR yaratildi |
| `session.ci_updated` | Orchestration | Dashboard, Lifecycle | CI natijasi yangilandi |
| `session.killed` | Orchestration | Notification, Cleanup | Session to'xtatildi |
| `team.deleted` | Organization | Orchestration | Session cleanup kerak |
| `project.archived` | Project | Orchestration | Active session kill |
| `member.invited` | Organization | Notification | Invite email |
| `member.role_changed` | Organization | Audit | Audit log |

### Event contract qoidalari

- Har bir event **typed struct** bilan define qilinadi
- Event versioning: `session.status_changed.v1`
- Breaking change = yangi event version (eski version deprecated)
- Event'lar **immutable** — emit qilingandan keyin o'zgartirilmaydi

---

## Event oqimlari

### Session spawn flow

```
1. Operator → POST /sessions/spawn
2. Handler → Service.SpawnSession()
3. Service validates (auth, max parallel, project active)
4. Service creates Session (status: spawning)
5. Service → EventBus: "session.spawned"
6. RuntimeAdapter.Start(session) → tmux session create
7. Runtime signals ready
8. Service updates Session (status: working)
9. Service → EventBus: "session.status_changed"
10. SSE/WebSocket → connected clients
```

### PR lifecycle flow

```
1. Agent creates branch + pushes commits
2. Agent opens PR via GitHub API
3. GitHub webhook → Platform: "pull_request.opened"
4. WebhookHandler → SCMAdapter.HandlePREvent()
5. SCMAdapter → EventBus: "session.pr_created"
6. Session status → review_requested
7. GitHub webhook → CI status update
8. WebhookHandler → SCMAdapter.HandleCIStatus()
9. SCMAdapter → EventBus: "session.ci_updated"
10. Operator approves + clicks merge
11. Platform → GitHub API: merge PR
12. Session status → merging → done
```

---

## Xato boshqarish (Failure Handling)

### Tashqi integration xatolar

| Xato turi | Harakat | Retry |
|-----------|---------|-------|
| GitHub API 401 | Token yangilash, foydalanuvchiga xabar | Yo'q |
| GitHub API 403 | Permission xatosi — log + alert | Yo'q |
| GitHub API 404 | Repo/PR topilmadi — log | Yo'q |
| GitHub API 429 | Rate limit — wait + retry | 3 marta, exponential backoff |
| GitHub API 500 | Server xatosi — retry | 3 marta, 1s/5s/30s |
| Webhook delivery fail | GitHub o'zi retry qiladi (3 marta) | Auto |
| Network timeout | Connection error — retry | 3 marta |

### Ichki event xatolari

| Xato turi | Harakat |
|-----------|---------|
| Subscriber panic | Recovery middleware + log, boshqa subscriber'lar davom etadi |
| Event processing fail | Log + metric, retry yo'q (V1 — at-most-once, `ADR-004`) |
| EventBus capacity full | Back-pressure — publisher bloklaydi yoki xato qaytaradi |

### Circuit breaker pattern (keyinroq)

V1 da sodda retry + timeout. Phase 3+ da circuit breaker:

```
CLOSED → (xatolar ko'paydi) → OPEN → (timeout o'tdi) → HALF_OPEN → (bir urinish)
                                                           │          │
                                                           ▼          ▼
                                                         success → CLOSED
                                                         fail → OPEN
```

---

## Versiya

- v1.0
- Status: **APPROVED**
- Keyingi ko'rib chiqish: Phase 1 Sprint 3-4 (GitHub integration) boshlanganda
