# API Conventions

## Maqsad

Ushbu hujjat platformaning REST API dizayn konvensiyalarini belgilaydi: URL tuzilishi, method ishlatish, xato modeli, versioning, va contract ownership.

Bu hujjat `application-architecture.md` (API contract, error model), `security-architecture.md` (auth header, RBAC) va `naming-conventions.md` ga asoslanadi.

---

## API Style

### Umumiy tamoyillar

- **REST** — resource-oriented dizayn
- **JSON** — request va response body uchun yagona format
- **OpenAPI 3.1** — contract specification
- **Versioned** — URL prefix orqali (`/api/v1/`)

### URL tuzilishi

```
{base}/api/v1/{resource}
{base}/api/v1/{resource}/{id}
{base}/api/v1/{resource}/{id}/{sub-resource}
```

**Misollar:**

```
GET    /api/v1/orgs                           # Barcha org'lar
POST   /api/v1/orgs                           # Yangi org yaratish
GET    /api/v1/orgs/:id                       # Bitta org olish
PUT    /api/v1/orgs/:id                       # Org yangilash
DELETE /api/v1/orgs/:id                       # Org o'chirish (soft)

GET    /api/v1/orgs/:id/teams                 # Org'ning team'lari
POST   /api/v1/orgs/:id/teams                 # Yangi team yaratish
GET    /api/v1/orgs/:id/teams/:teamId         # Bitta team

POST   /api/v1/sessions/:id/send              # Action — non-CRUD
DELETE /api/v1/sessions/:id                    # Session kill
```

### HTTP Method ishlatish

| Method | Maqsad | Idempotent | Body |
|--------|--------|------------|------|
| `GET` | Resource olish | Ha | Yo'q |
| `POST` | Yangi resource yaratish yoki action | Yo'q | Ha |
| `PUT` | Resource to'liq yangilash | Ha | Ha |
| `PATCH` | Resource qisman yangilash | Yo'q | Ha |
| `DELETE` | Resource o'chirish (soft delete) | Ha | Yo'q |

### Naming qoidalari

- Resource nomi **plural** va **kebab-case**: `/orgs`, `/api-tokens`, `/session-events`
- URL'da verb yo'q (faqat action uchun POST emas): ~~`/get-sessions`~~ → `/sessions`
- Nested resource — 2 darajadan chuqur bo'lmasligi kerak
- Query parameter — **snake_case**: `?page_size=20&sort_by=created_at`

---

## Request Format

### Pagination

**Cursor-based pagination** ishlatiladi (offset emas):

```json
GET /api/v1/sessions?page_size=20&cursor=eyJ0IjoiMjAyNi0wMy0wOVQxNDowMCJ9

Response:
{
  "data": [...],
  "meta": {
    "cursor": "eyJ0IjoiMjAyNi0wMy0wOVQxNTowMCJ9",
    "has_more": true,
    "total": 142
  }
}
```

**Sabab:** Cursor-based pagination real-time data uchun barqarorroq — yangi element qo'shilganda sahifalar siljimaydi.

### Filtering

```
GET /api/v1/sessions?status=working&project_id=xxx&attention=critical
GET /api/v1/tasks?priority=high&sort_by=created_at&sort_order=desc
```

### Request body

```json
POST /api/v1/orgs
Content-Type: application/json

{
  "name": "Acme Corp",
  "slug": "acme",
  "type": "company"
}
```

**Qoidalar:**
- Barcha field'lar `snake_case`
- Qat'iy tip — string, number, boolean, null (mixed emas)
- Ixtiyoriy field'lar `null` yoki chiqarib tashlanadi (empty string emas)

---

## Response Format

### Success response

```json
// Bitta resource
{
  "data": {
    "id": "01904c...",
    "name": "Acme Corp",
    "slug": "acme",
    "type": "company",
    "created_at": "2026-03-09T14:00:00Z",
    "updated_at": "2026-03-09T14:00:00Z"
  }
}

// Resource ro'yxati
{
  "data": [
    { "id": "...", "name": "..." },
    { "id": "...", "name": "..." }
  ],
  "meta": {
    "cursor": "...",
    "has_more": true,
    "total": 42
  }
}

// Action natijasi (side-effect)
{
  "data": {
    "session_id": "...",
    "status": "spawning"
  }
}
```

### Timestamps

- Barcha timestamp'lar **ISO 8601 UTC** formatida: `2026-03-09T14:00:00Z`
- Client local vaqtga o'zi convert qiladi

### Empty response

- `201 Created` — body bilan (yaratilgan resource)
- `204 No Content` — body'siz (delete success)
- `200 OK` — body bilan (update success)

---

## Error Model

`application-architecture.md` L296-333 asosida:

### Error response formati

```json
{
  "error": {
    "code": "ORG_NOT_FOUND",
    "message": "Organization with slug 'acme' not found",
    "details": {}
  }
}
```

### Validation error formati

```json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Request validation failed",
    "details": {
      "fields": [
        { "field": "name", "message": "Name is required" },
        { "field": "slug", "message": "Slug must be 3-50 characters, alphanumeric and hyphens only" }
      ]
    }
  }
}
```

### HTTP status va error code mapping

| HTTP Status | Error Category | Misol Error Code |
|-------------|---------------|------------------|
| `400` | Bad Request | `INVALID_REQUEST` |
| `401` | Unauthorized | `TOKEN_EXPIRED`, `TOKEN_INVALID` |
| `403` | Forbidden | `PERMISSION_DENIED` |
| `404` | Not Found | `ORG_NOT_FOUND`, `SESSION_NOT_FOUND` |
| `409` | Conflict | `SLUG_ALREADY_EXISTS`, `SESSION_ALREADY_ACTIVE` |
| `422` | Validation | `VALIDATION_FAILED` |
| `429` | Rate Limited | `RATE_LIMIT_EXCEEDED` |
| `500` | Internal Error | `INTERNAL_ERROR` |

**Qoidalar:**
- `500` error'da foydalanuvchiga ichki detail ko'rsatilmaydi
- Har bir error code global unique
- Error code naming: `UPPER_SNAKE_CASE`
- `message` foydalanuvchiga ko'rsatish uchun yaroqli bo'lishi kerak

---

## Versioning

- URL prefix: `/api/v1/`, `/api/v2/`
- Breaking change = yangi version
- Non-breaking (yangi field qo'shish) = eski version'da davom etadi
- Deprecated version kamida 6 oy qo'llab-quvvatlanadi

### Breaking change misollari

- Field o'chirish yoki nomi o'zgartirish
- Response tuzilmasini o'zgartirish
- Required field qo'shish (request)
- Status code o'zgartirish

---

## Authentication Headers

`security-architecture.md` asosida:

```
# JWT token
Authorization: Bearer eyJhbGciOiJSUzI1NiIs...

# API token
Authorization: Bearer ao_xxxxxxxxxxxx
```

### Org context

Multi-org foydalanuvchilar uchun:

```
X-Org-ID: 01904c-xxx-xxx          # JWT ichida ham, header orqali ham
```

JWT'dagi `org_id` asosiy — header faqat org switching uchun (keyinroq).

---

## Contract Ownership

### OpenAPI spec

```
/docs/api/
├── openapi.yaml           # Main spec file
├── paths/
│   ├── auth.yaml
│   ├── orgs.yaml
│   ├── teams.yaml
│   ├── projects.yaml
│   ├── sessions.yaml
│   └── tokens.yaml
└── components/
    ├── schemas.yaml
    ├── responses.yaml
    └── parameters.yaml
```

### Type generation flow

```
OpenAPI spec (YAML)
  → openapi-typescript (build step)
    → /packages/types/ (generated TypeScript types)
      → Frontend (TanStack Query hooks)
```

### Ownership qoidalari

- OpenAPI spec **source of truth** — kod mos kelishi kerak
- Spec o'zgarishi = PR (review talab qilinadi)
- Backend va frontend bitta spec'dan type generate qiladi
- Breaking change PR'da `[BREAKING]` label qo'yiladi

---

## Rate Limiting

| Endpoint turi | Limit | Window |
|--------------|-------|--------|
| Auth endpoints | 10 req | 1 daqiqa (IP bo'yicha) |
| CRUD endpoints | 100 req | 1 daqiqa (user bo'yicha) |
| Session spawn | 20 req | 1 daqiqa (org bo'yicha) |
| Webhook incoming | 500 req | 1 daqiqa (integration bo'yicha) |

Response:
```
HTTP/1.1 429 Too Many Requests
Retry-After: 30

{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Retry after 30 seconds."
  }
}
```

---

## Versiya

- v1.0
- Status: **APPROVED**
- Keyingi ko'rib chiqish: Phase 1 Sprint 2 (Identity Context) boshlanganda
