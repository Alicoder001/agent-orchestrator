# Naming Conventions

## Maqsad

Ushbu hujjat loyihadagi barcha nomlash qoidalarini birlashtiradi: repo, papka, fayl, paket, modul, database, API va hujjat darajasida.

Bu hujjat `coding-standards.md`, `data-architecture.md` va `repo-governance.md` ga asoslanadi.

---

## Repo va papka nomlash

| Element | Convention | Misol |
|---------|-----------|-------|
| Repo nomi | kebab-case | `agent-orchestrator` |
| Top-level papka | kebab-case | `apps/`, `packages/`, `docs/`, `scripts/` |
| App papka | kebab-case | `apps/api`, `apps/web`, `apps/desktop` |
| Package papka | kebab-case | `packages/types`, `packages/ui` |
| Docs papka | número-prefixed kebab-case | `00-foundation/`, `01-architecture/` |

---

## Go naming

| Element | Convention | Misol |
|---------|-----------|-------|
| Package nomi | lowercase, singular, qisqa | `identity`, `organization`, `orchestration` |
| Fayl nomi | snake_case | `handler.go`, `service.go`, `session_event.go` |
| Exported type | PascalCase | `Organization`, `SessionEvent`, `AppError` |
| Unexported type | camelCase | `sessionCache`, `configLoader` |
| Exported func | PascalCase | `NewService`, `GetOrganization` |
| Unexported func | camelCase | `validateSlug`, `buildQuery` |
| Exported const | PascalCase | `MaxRetries`, `DefaultTimeout` |
| Unexported const | camelCase | `defaultPageSize`, `sessionPrefix` |
| Interface | Behavior-nomi | `Publisher`, `Subscriber`, `OrgQuerier` |
| Receiver | 1-2 harf | `s *Service`, `r *Repository`, `h *Handler` |
| Context key | Unexported type | `type contextKey string` |
| Config field | PascalCase (struct) | `DatabaseURL`, `JWTPrivateKeyPath` |
| Env variable ref | UPPER_SNAKE | `DATABASE_URL`, `JWT_ACCESS_TTL` |

### Go module path

```
module github.com/[org]/agent-orchestrator
```

### Go internal package paths

```
internal/modules/identity
internal/modules/organization
internal/modules/project
internal/modules/orchestration
internal/shared/errors
internal/shared/middleware
internal/platform/database
```

---

## TypeScript naming

| Element | Convention | Misol |
|---------|-----------|-------|
| Fayl nomi (component) | kebab-case + `.tsx` | `session-card.tsx`, `org-switcher.tsx` |
| Fayl nomi (hook) | kebab-case + `.ts` | `use-session-list.ts` |
| Fayl nomi (type) | kebab-case + `.types.ts` | `session.types.ts` |
| Fayl nomi (util) | kebab-case + `.ts` | `format-duration.ts` |
| Component | PascalCase | `SessionCard`, `OrgSwitcher` |
| Hook | camelCase, `use` prefix | `useSessionList`, `useOrgStore` |
| Type / Interface | PascalCase | `Session`, `SessionCardProps` |
| Enum | PascalCase (TypeScript union) | `type Status = 'active' \| 'archived'` |
| Constant | UPPER_SNAKE_CASE | `MAX_SESSIONS`, `API_BASE_URL` |
| Function / util | camelCase | `formatDuration`, `parseSessionId` |
| CSS class | kebab-case (Tailwind) | `session-card`, `attention-badge` |
| Store (Zustand) | camelCase, `use` prefix | `useUIStore`, `useWorkspaceStore` |
| Query key | camelCase array | `['sessions', projectId]` |

### Frontend papka tuzilmasi nomi

```
apps/web/src/
├── app/             # Next.js route files — route nomi
├── components/
│   ├── ui/          # Umumiy — button.tsx, input.tsx
│   └── features/    # Feature — session-card.tsx
├── hooks/           # use-session-list.ts
├── lib/             # api-client.ts, format-utils.ts
├── types/           # session.types.ts
└── styles/          # globals.css
```

---

## Database naming

`data-architecture.md` L135-143 dan olingan:

| Element | Convention | Misol |
|---------|-----------|-------|
| Schema | snake_case, singular | `identity`, `organization`, `project` |
| Table | snake_case, **plural** | `users`, `teams`, `session_events` |
| Column | snake_case | `created_at`, `org_id`, `is_active` |
| Primary key | `id` (UUID v7) | `id UUID PRIMARY KEY` |
| Foreign key | `{ref_singular}_id` | `team_id`, `project_id`, `user_id` |
| Index | `idx_{table}_{column}` | `idx_sessions_status`, `idx_users_email` |
| FK constraint | `fk_{table}_{ref_table}` | `fk_teams_department` |
| Unique constraint | `uq_{table}_{column}` | `uq_users_email`, `uq_orgs_slug` |
| Timestamp | `created_at`, `updated_at`, `deleted_at` | Har bir jadvalda majburiy |
| Boolean | `is_` prefix | `is_active`, `is_verified`, `is_default` |
| Enum (PG) | snake_case | `session_status`, `member_role` |

### Migration fayl nomi

```
{number}_{action}_{entity}.{up|down}.sql

Misol:
000001_create_users.up.sql
000001_create_users.down.sql
000002_add_oauth_connections.up.sql
```

---

## API naming

| Element | Convention | Misol |
|---------|-----------|-------|
| Base path | `/api/v1/` | `https://api.example.com/api/v1/` |
| Resource | kebab-case, plural | `/orgs`, `/sessions`, `/api-tokens` |
| Nested resource | parent/id/child | `/orgs/:id/teams`, `/projects/:id/tasks` |
| Action (non-CRUD) | POST + verb | `POST /sessions/:id/send` |
| Query param | snake_case | `?status=working&page_size=20` |
| Request body field | snake_case (JSON) | `{ "org_name": "Acme", "team_id": "..." }` |
| Response field | snake_case (JSON) | `{ "created_at": "...", "is_active": true }` |
| Error code | UPPER_SNAKE | `ORG_NOT_FOUND`, `PERMISSION_DENIED` |
| Event type | dot.separated | `session.status_changed`, `user.registered` |
| Header (custom) | `X-` prefix yo'q, standard nomi | `Authorization`, `Content-Type` |

---

## Hujjat naming

| Element | Convention | Misol |
|---------|-----------|-------|
| Fayl nomi | kebab-case + `.md` | `api-conventions.md`, `domain-model.md` |
| ADR fayl | `ADR-{number}-{topic}.md` | `ADR-001-go-core-backend.md` |
| Worklog | `{agent-id}.md` | `eng-001.md` |
| Papka | número-kebab | `00-foundation/`, `06-adrs/` |

### Hujjat ichidagi sarlavha

```markdown
# Document Title     ← H1 — faqat bitta
## Major Section     ← H2 — asosiy bo'lim
### Sub-section      ← H3 — ichki bo'lim
```

---

## Branch naming

`repo-governance.md` L21-28 dan:

```
main          → production-ready
dev           → active development
feature/*     → feature/add-session-spawn
fix/*         → fix/jwt-refresh-expired
docs/*        → docs/update-domain-model
agent/*       → agent/eng-001/task-42-add-session-api
```

---

## Versiya

- v1.0
- Status: **APPROVED**
- Keyingi ko'rib chiqish: Phase 1 Sprint 1 tugagandan keyin
