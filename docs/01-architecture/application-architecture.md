# Application Architecture

## Maqsad

Ushbu hujjat platformaning application qatlamini belgilaydi: qanday app'lar mavjud, ular qanday tuzilgan, va ular orasidagi chegaralar qayerda o'tadi.

Bu hujjat `ADR-003` (modular monolith), `bounded-contexts.md`, va `final-technology-stack.md` ga asoslanadi.

---

## App Types

| App | Path | Language | Framework | Role |
|-----|------|----------|-----------|------|
| API Server | `/apps/api` | Go | Chi | Core platform backend — modular monolith |
| Web | `/apps/web` | TypeScript | Next.js | Operator dashboard, product UI |
| Desktop | `/apps/desktop` | Rust + React | Tauri | Local runtime shell (Phase 4) |

### Supporting packages

| Package | Path | Language | Role |
|---------|------|----------|------|
| Shared types | `/packages/types` | TypeScript | Auto-generated types from OpenAPI |
| UI library | `/packages/ui` | TypeScript/React | Shared React component library |

---

## Runtime Model

### API Server

- **Deploy unit:** Single Go binary
- **Process model:** One process, multiple modules (goroutines)
- **Background workers:** Goroutines within same process (v1)
- **Database connections:** Connection pool per schema (via pgx)
- **Redis connections:** Shared connection pool
- **WebSocket:** Embedded in same process (v1)

### V1 runtime topology

```
┌─────────────────────────────────────────────┐
│               Go Binary (API Server)         │
│                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│  │ Identity  │ │   Org    │ │ Project  │    │
│  │ Module    │ │  Module  │ │  Module  │    │
│  └──────────┘ └──────────┘ └──────────┘    │
│                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│  │Orchestr. │ │ Realtime │ │  Audit   │    │
│  │ Module   │ │  Module  │ │  Module  │    │
│  └──────────┘ └──────────┘ └──────────┘    │
│                                              │
│  ┌─────────────────────────────────────┐    │
│  │     Internal Event Bus (channels)    │    │
│  └─────────────────────────────────────┘    │
│                                              │
│  ┌──────────┐ ┌──────────┐                  │
│  │PostgreSQL│ │  Redis   │                  │
│  │  Pool    │ │  Pool    │                  │
│  └──────────┘ └──────────┘                  │
└─────────────────────────────────────────────┘
```

### Future extraction criteria

Modul alohida service sifatida ajratiladi agar:

- Mustaqil scale talab qilsa (masalan: Realtime Context — ko'p WebSocket)
- Boshqa tech stack ga muhtoj bo'lsa
- Team yetarlicha kattalashsa (per-module ownership)
- Performance izolyatsiya talab qilsa

---

## Go Package Layout

```
/apps/api/
├── cmd/
│   └── server/
│       └── main.go              # Entry point — server bootstrap
│
├── internal/
│   ├── config/
│   │   └── config.go            # Typed config loader (env-based)
│   │
│   ├── server/
│   │   ├── server.go            # HTTP server setup
│   │   ├── router.go            # Chi router, route registration
│   │   └── middleware.go        # Global middleware chain
│   │
│   ├── modules/
│   │   ├── identity/
│   │   │   ├── handler.go       # HTTP handlers
│   │   │   ├── service.go       # Business logic
│   │   │   ├── repository.go    # PostgreSQL queries
│   │   │   ├── model.go         # Domain models + DTOs
│   │   │   ├── events.go        # Event definitions
│   │   │   └── handler_test.go  # Tests
│   │   │
│   │   ├── organization/
│   │   │   └── ... (same structure)
│   │   │
│   │   ├── project/
│   │   │   └── ...
│   │   │
│   │   ├── orchestration/
│   │   │   └── ...
│   │   │
│   │   ├── realtime/
│   │   │   └── ...
│   │   │
│   │   ├── notification/
│   │   │   └── ...
│   │   │
│   │   └── audit/
│   │       └── ...
│   │
│   ├── shared/
│   │   ├── errors/
│   │   │   └── errors.go        # Domain error types
│   │   ├── middleware/
│   │   │   ├── auth.go          # JWT validation
│   │   │   ├── rbac.go          # Permission check
│   │   │   ├── logging.go       # Structured request logging
│   │   │   └── recovery.go      # Panic recovery
│   │   ├── pagination/
│   │   │   └── cursor.go        # Cursor-based pagination
│   │   ├── response/
│   │   │   └── json.go          # Standard JSON response helpers
│   │   └── event/
│   │       ├── bus.go            # Event bus interface + implementation
│   │       └── types.go          # Event type definitions
│   │
│   └── platform/
│       ├── database/
│       │   ├── postgres.go       # Connection pool setup
│       │   └── migrate.go        # Migration runner
│       ├── cache/
│       │   └── redis.go          # Redis client setup
│       └── runtime/
│           ├── adapter.go        # Runtime adapter interface
│           ├── tmux.go           # tmux implementation
│           └── process.go        # OS process fallback
│
├── migrations/
│   ├── identity/
│   ├── organization/
│   ├── project/
│   ├── orchestration/
│   ├── notification/
│   └── audit/
│
├── go.mod
├── go.sum
├── Makefile
└── README.md
```

---

## Module Internal Structure

Har bir module quyidagi layerlarga bo'linadi:

### Handler (Transport Layer)

```go
// HTTP request qabul qilish, validation, va response qaytarish
// Business logic bu yerda bo'lmaydi
func (h *Handler) CreateOrganization(w http.ResponseWriter, r *http.Request) {
    // 1. Parse request
    // 2. Validate input
    // 3. Call service
    // 4. Return response
}
```

### Service (Domain Layer)

```go
// Business logic, domain qoidalari, va cross-cutting concerns
// Database'ga to'g'ridan murojaat qilmaydi — repository orqali
type Service struct {
    repo       Repository
    eventBus   event.Publisher
}
```

### Repository (Persistence Layer)

```go
// SQL queries va database interaction
// Domain logic bu yerda bo'lmaydi
type Repository struct {
    db *pgxpool.Pool
}
```

### Model (Domain Models)

```go
// Entity definitions va DTOs
// request/response structures
type Organization struct {
    ID        uuid.UUID
    Name      string
    Slug      string
    Type      OrgType
    CreatedAt time.Time
}
```

---

## Composition Rules

### Ruxsat berilgan dependency yo'nalishlari

```
handler → service → repository → database
handler → shared (middleware, errors, response)
service → shared (errors, event bus)
service → platform (database, cache, runtime) — faqat interface orqali
repository → platform (database)
```

### Module orasidagi qoidalar (ADR-003 dan)

| Source | Target | Ruxsat | Usul |
|--------|--------|--------|------|
| Module A → Module B | ❌ Direct import | Interface orqali | Service interface inject qilinadi |
| Module → shared | ✅ | Direct import | Utility va error types |
| Module → platform | ✅ | Interface orqali | Database, cache, runtime |
| shared → Module | ❌ TAQIQLANGAN | — | Circular dependency oldini oladi |
| platform → Module | ❌ TAQIQLANGAN | — | Infra domain'ga bog'lanmasligi kerak |

### Cross-module communication

```go
// YOMON — to'g'ridan import
import "internal/modules/organization"
orgService.GetTeam(teamID) // TAQIQLANGAN

// YAXSHI — interface orqali
type OrgQuerier interface {
    GetTeam(ctx context.Context, teamID uuid.UUID) (*TeamInfo, error)
}
// orchestration module OrgQuerier'ni inject qilib oladi
```

---

## Frontend and Backend Boundaries

### API contract

- **Format:** REST (JSON)
- **Specification:** OpenAPI 3.1
- **Type generation:** `openapi-typescript` → `/packages/types`
- **Versioning:** URL prefix (`/api/v1/`)

### Contract flow

```
Go Backend
  → OpenAPI spec (auto-generated yoki hand-written)
    → TypeScript types (generated)
      → Frontend (TanStack Query hooks)
```

### Realtime contract

- **Primary:** WebSocket (Go native → frontend)
- **Fallback:** SSE (read-heavy streams uchun)
- **Event format:** JSON messages with `type` field

```json
{
  "type": "session.status_changed",
  "payload": {
    "session_id": "...",
    "old_status": "working",
    "new_status": "needs_response"
  },
  "timestamp": "2026-03-09T14:00:00Z"
}
```

---

## Error Model

### Domain errors

```go
type AppError struct {
    Code    string // "ORG_NOT_FOUND", "PERMISSION_DENIED"
    Message string // Human-readable
    Status  int    // HTTP status code
}
```

### Error categories

| Category | HTTP Status | Misol |
|----------|-------------|-------|
| Not Found | 404 | Resource mavjud emas |
| Validation | 422 | Input noto'g'ri |
| Unauthorized | 401 | Token noto'g'ri yoki expired |
| Forbidden | 403 | Permission yetarli emas |
| Conflict | 409 | Resource allaqachon mavjud |
| Internal | 500 | Kutilmagan server xatosi |

### Standard response format

```json
// Success
{
  "data": { ... },
  "meta": { "cursor": "...", "total": 42 }
}

// Error
{
  "error": {
    "code": "ORG_NOT_FOUND",
    "message": "Organization with slug 'acme' not found"
  }
}
```

---

## Versiya

- v1.0
- Status: **APPROVED**
- Keyingi ko'rib chiqish: Phase 1a (Repo tuzilmasi) implementation boshlangandan keyin
