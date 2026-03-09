# Platform Services

## Maqsad

Ushbu hujjat platformadagi yordamchi service'lar — notification, file management, search va analytics'ni belgilaydi.

Bu hujjat `bounded-contexts.md` (Notification, Analytics contexts), `application-architecture.md` va `integration-architecture.md` ga asoslanadi.

---

## Service Catalog

### V1 Services

| Service | Bounded Context | Maqsad | Priority |
|---------|----------------|--------|----------|
| **Auth Service** | Identity | JWT, OAuth, API token | Sprint 2 |
| **Org Service** | Organization | Org, Team, Member CRUD | Sprint 2-3 |
| **Project Service** | Project | Project, Task CRUD | Sprint 3 |
| **Session Service** | Orchestration | Session lifecycle, spawn/kill | Sprint 3-4 |
| **Event Service** | Shared | Event bus management | Sprint 1 |
| **Health Service** | Shared | Health check, metrics | Sprint 1 |

### V2+ Services

| Service | Maqsad | Phase |
|---------|--------|-------|
| **Notification Service** | Slack, email, push notifications | Phase 2 |
| **Search Service** | Full-text search across entities | Phase 2 |
| **Analytics Service** | Session metrics, cost tracking | Phase 2-3 |
| **File Service** | Agent output, attachment management | Phase 2 |
| **Audit Service** | Immutable audit log | Phase 2 |
| **Billing Service** | Usage tracking, subscription | Phase 3 |

---

## Service Communication

```
┌─────────────────────────────────────────────┐
│              HTTP Router (Chi)              │
├──────┬──────┬──────┬──────┬──────┬─────────┤
│ Auth │ Org  │ Proj │ Orch │Health│ Stream  │
│  Svc │ Svc  │ Svc  │  Svc │ Svc  │  Svc   │
├──────┴──────┴──────┴──────┴──────┴─────────┤
│              Event Bus                      │
├─────────────────────────────────────────────┤
│         Database (schema-per-context)       │
│              Redis Cache                    │
└─────────────────────────────────────────────┘
```

### Inter-service qoidalar

- Service'lar **to'g'ridan import qilmaydi** — event bus yoki interface orqali
- Database schema'lari izolyatsiya qilingan
- Shared infra: config, logger, middleware — `internal/shared/` da

---

## Notification Service (V2+ detail)

### Channels

| Channel | Trigger | Template |
|---------|---------|----------|
| Slack webhook | Session needs_response, PR created | `{agent}: {project} — attention required` |
| Email (SendGrid) | Member invite, security alert | HTML template |
| Desktop push (Tauri) | Real-time attention change | Native notification |
| In-app | Barcha event'lar | Bell icon + notification panel |

### Notification preferences

```json
{
  "user_id": "...",
  "channels": {
    "slack": { "enabled": true, "webhook_url": "..." },
    "email": { "enabled": true, "digest": "instant" },
    "desktop": { "enabled": true },
    "in_app": { "enabled": true }
  },
  "filters": {
    "mute_quiet_sessions": true,
    "only_my_projects": false
  }
}
```

---

## Versiya

- v1.0
- Status: **APPROVED**
