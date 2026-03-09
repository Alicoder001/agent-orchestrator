# Data Architecture

## Maqsad

Ushbu hujjat platformaning ma'lumotlar qatlamini belgilaydi: qayerda nima saqlanadi, qanday tuzilmada yashaydi, va qanday oqimda harakatlanadi.

Bu hujjat `domain-model.md` va `bounded-contexts.md` ga asoslanadi. Agar entity qo'shilsa yoki context chegarasi o'zgarsa, bu hujjat ham qayta ko'rib chiqiladi.

---

## Data Domains

Platformadagi ma'lumotlar 5 ta domain bo'yicha taqsimlanadi. Har bir domain o'z bounded context'iga mos keladi.

### Identity Data

| Entity | Tavsif |
|--------|--------|
| user | Platformaga ro'yxatdan o'tgan inson foydalanuvchi |
| session_token | JWT access va refresh token metadata |
| oauth_connection | GitHub, Google OAuth bog'lanishi |
| api_token | Scoped, long-lived, revocable API token |

Owner: **Identity Context**

### Organization Data

| Entity | Tavsif |
|--------|--------|
| organization | Eng yuqori darajadagi identifikatsiya birligi |
| department | Organization ichidagi funksional bo'lim |
| team | Birgalikda ish bajaradigan agent va member guruhi |
| membership | User ↔ Organization bog'lanishi va roli |
| agent_definition | Platform yoki org darajasidagi agent blueprint |
| agent_slot | Team ichidagi agent o'rni |

Owner: **Organization Context**

### Project Data

| Entity | Tavsif |
|--------|--------|
| project | Aniq maqsadga yo'naltirilgan ish maydoni |
| workflow | Bir nechta stage va task'larni tartibga soluvchi model |
| workflow_stage | Workflow ichidagi bosqich |
| task | Bajariladigan ish birligi |
| team_assignment | Qaysi team qaysi projectda ishlaydi |

Owner: **Project Context**

### Orchestration Data

| Entity | Tavsif |
|--------|--------|
| session | Agent'ning bitta task ustida ishlashining to'liq hayot tsikli |
| session_event | Session davomidagi muhim voqealar (immutable) |
| session_metadata | Runtime holat (tmux session name, workspace path) |

Owner: **Orchestration Context**

### Operational Data

| Entity | Tavsif |
|--------|--------|
| notification_preference | Foydalanuvchi notification sozlamalari |
| notification_log | Yuborilgan notification tarixi |
| audit_log | Barcha muhim harakatlarning o'zgarmas qaydlari |

Owner: **Notification Context** va **Audit Context**

---

## Source of Truth

| Storage | Role | Qachon ishlatiladi |
|---------|------|-------------------|
| **PostgreSQL** | Primary durable storage | Barcha entity'lar, munosabatlar, tarix |
| **Redis** | Ephemeral coordination | Session coordination, realtime fanout, distributed locks, presence, queue buffer |
| **Disk (local)** | Runtime state faqat | tmux session name, workspace path, terminal buffer |

### Qoidalar

- PostgreSQL yagona source of truth — Redis'dan ma'lumot yo'qolsa, tizim ishlashda davom etadi
- Redis cache invalidation TTL-based — stale data qabul qilinadi (eventual consistency)
- Disk'dagi runtime state PostgreSQL metadata bilan sinxronlashadi (session spawn va restore vaqtida)

---

## Persistence Strategy

### Schema strategy

Bitta PostgreSQL database, har bir bounded context uchun alohida schema:

```
database: agent_orchestrator
├── identity      → users, session_tokens, oauth_connections, api_tokens
├── organization  → organizations, departments, teams, memberships, agent_definitions, agent_slots
├── project       → projects, workflows, workflow_stages, tasks, team_assignments
├── orchestration → sessions, session_events
├── notification  → notification_preferences, notification_logs
└── audit         → audit_logs
```

### Schema isolation qoidalari

- Cross-schema direct JOIN **taqiqlangan** (bounded context qoidasi)
- Context A context B ning jadvaliga to'g'ridan SELECT yozmaydi
- Aggregation faqat application-level da API layer orqali amalga oshiriladi
- Har bir context o'z schema'sida mustaqil migrate qiladi

### Migration tool

**golang-migrate** tanlanadi:

- SQL-based — framework-agnostic
- Up/down migration support
- Har bir schema o'z migration papkasiga ega:

```
/migrations/
├── identity/
│   ├── 000001_create_users.up.sql
│   ├── 000001_create_users.down.sql
│   └── ...
├── organization/
├── project/
├── orchestration/
├── notification/
└── audit/
```

### Naming conventions

| Element | Convention | Misol |
|---------|-----------|-------|
| Table | snake_case, plural | `users`, `agent_slots`, `session_events` |
| Column | snake_case | `created_at`, `org_id`, `is_active` |
| Primary key | `id` (UUID v7 — sortable) | `id UUID PRIMARY KEY DEFAULT gen_random_uuid()` |
| Foreign key | `{ref_table_singular}_id` | `team_id`, `project_id` |
| Index | `idx_{table}_{column}` | `idx_sessions_status` |
| FK constraint | `fk_{table}_{ref_table}` | `fk_teams_department` |
| Unique constraint | `uq_{table}_{column}` | `uq_users_email` |
| Timestamp columns | `created_at`, `updated_at`, `deleted_at` | Har bir jadvalda majburiy |

### Soft delete

- Barcha core entity'lar soft delete ishlatadi: `deleted_at TIMESTAMP NULL`
- Audit log va session_event'lar **hech qachon o'chirilmaydi** (immutable)
- Soft delete qilingan entity'lar default query'larda ko'rinmaydi

### UUID strategy

- UUID v7 (time-sortable) ishlatiladi
- B-tree index uchun samarali — insert ordering tabiiy
- Go'da `google/uuid` paketi bilan generatsiya

---

## Data Flow

### Write path

```
Client Request
  → API Handler (transport)
    → Service (business logic, validation)
      → Repository (SQL query)
        → PostgreSQL
          → Event emit (event bus orqali)
```

### Read path

```
Client Request
  → API Handler
    → Service
      → Repository → PostgreSQL
    → Cache check → Redis (agar applicable)
  → Response
```

### Event path

```
Service (domain action)
  → Event Bus (Go internal channel)
    → Subscriber A (Notification Context)
    → Subscriber B (Audit Context)
    → Subscriber C (Realtime Context → WebSocket)
```

### Cache strategy

- **Session holati** — Redis'da cache (TTL: 30 sec, invalidate on event)
- **Organization config** — Redis'da cache (TTL: 5 min)
- **User profile** — Redis'da cache (TTL: 10 min)
- Boshqa entity'lar v1 da cache'siz ishlaydi — kerak bo'lganda qo'shiladi

### Redis usage scope

| Use case | Redis structure | TTL |
|----------|----------------|-----|
| Session status cache | `session:{id}:status` (string) | 30s |
| Active sessions list | `org:{id}:active_sessions` (set) | 60s |
| Distributed lock | `lock:{resource}` (string + SETNX) | 30s |
| Realtime fanout | Pub/Sub channel per org | N/A |
| Presence | `presence:{org_id}:{user_id}` (string) | 90s |
| Rate limiting | `ratelimit:{ip}:{endpoint}` (counter) | 60s |

---

## Versiya

- v1.0
- Status: **APPROVED**
- Keyingi ko'rib chiqish: Phase 1 implementation boshlangandan keyin
