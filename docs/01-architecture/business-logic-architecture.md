# Business Logic Architecture

## Maqsad

Ushbu hujjat platformadagi biznes qoidalarini, use case'larni, domain service'larni va validatsiya strategiyasini belgilaydi. Kod shu hujjatga asoslanadi — hujjatga zid kod noto'g'ri.

Bu hujjat `domain-model.md` (entity'lar), `bounded-contexts.md` (context chegaralari), `application-architecture.md` (package layout) va `security-architecture.md` (RBAC) ga asoslanadi.

---

## Business Rules Model

### Qoida turlari

| Tur | Tavsif | Misol | Qayerda enforce |
|----|--------|-------|----------------|
| **Invariant** | Hech qachon buzilmasligi kerak | "Organization'da kamida bitta owner bo'lishi kerak" | Service layer |
| **Validation** | Input to'g'riligi | "Slug 3-50 belgi, alphanumeric va hyphen" | Handler + Service |
| **Authorization** | Kim nima qila oladi | "Faqat admin member invite qila oladi" | Middleware + Service |
| **Lifecycle** | Entity holat o'tishlari | "Session faqat `working` → `needs_response` o'tishi mumkin" | Service layer |
| **Cross-entity** | Entity'lar orasidagi qoidalar | "AgentSlot o'chirilsa, unga bog'liq session'lar arxivlanadi" | Service layer |

### Context bo'yicha asosiy qoidalar

#### Identity Context

| Qoida | Turi | Enforce |
|-------|------|---------|
| Email unique bo'lishi kerak | Invariant | DB unique + Service check |
| Password minimum 8 belgi, mixed case + digit | Validation | Service |
| Refresh token faqat 1 marta ishlatiladi (rotation) | Invariant | Service |
| API token hash sifatida saqlanadi | Invariant | Service |
| Failed login 5 martadan keyin account 15 daqiqaga lock | Lifecycle | Service |

#### Organization Context

| Qoida | Turi | Enforce |
|-------|------|---------|
| Organization'da kamida bitta owner — oxirgi owner o'chirilmaydi | Invariant | Service |
| Personal org signup'da avtomatik yaratiladi | Lifecycle | Service (event handler) |
| Slug globally unique | Invariant | DB unique + Service |
| Department o'chirilsa, uning team'lari ham soft-delete | Cross-entity | Service |
| Member bir org'da faqat bitta rolga ega | Invariant | Service |

#### Project Context

| Qoida | Turi | Enforce |
|-------|------|---------|
| Project o'chirilmaydi — faqat arxivlanadi | Lifecycle | Service |
| Arxivlangan project'da yangi session spawn qilinmaydi | Authorization | Service |
| Bitta task uchun bir vaqtda faqat bitta aktiv session | Invariant | Service + DB |
| Workflow stage'lari tartibli — o'tkazib yuborish qoidasi project-level config | Lifecycle | Service |

#### Orchestration Context

| Qoida | Turi | Enforce |
|-------|------|---------|
| Session status o'tishlari faqat ruxsat etilgan yo'nalishda | Lifecycle | Service (state machine) |
| Session kill only by operator+ role | Authorization | Middleware |
| Bitta AgentSlot uchun max parallel session soni cheklangan | Invariant | Service |
| SessionEvent immutable — o'zgartirilmaydi, o'chirilmaydi | Invariant | Service (insert-only) |

---

## Use Cases

### Identity Context

| Use Case | Actor | Input | Output | Qoidalar |
|----------|-------|-------|--------|---------|
| Register | Anonymous | email, password, name | User + personal org + JWT | Email unique, password policy |
| Login | Anonymous | email, password | JWT (access + refresh) | Rate limit, account lock |
| Refresh Token | Authenticated | refresh_token | New JWT pair | Token rotation, revoke old |
| OAuth Login | Anonymous | GitHub authorization | User (new/existing) + JWT | Account linking if email match |
| Create API Token | Authenticated | name, scope | token string (faqat 1 marta) | Hash sifatida saqlanadi |
| Revoke API Token | Authenticated | token_id | — | Faqat o'z token'larini |

### Organization Context

| Use Case | Actor | Input | Output | Qoidalar |
|----------|-------|-------|--------|---------|
| Create Org | Authenticated | name, slug, type | Organization | Slug unique, creator = owner |
| Invite Member | Admin+ | email, role | Membership (pending) | Role assignment by admin+ |
| Accept Invite | Invited user | invite_token | Membership (active) | Token one-time use |
| Create Department | Admin+ | name, type | Department | Type from allowed list |
| Create Team | Admin+ | name, department_id | Team | Department must exist |
| Configure AgentSlot | Admin+ | team_id, agent_def_id, config | AgentSlot | AgentDef must be accessible |

### Project Context

| Use Case | Actor | Input | Output | Qoidalar |
|----------|-------|-------|--------|---------|
| Create Project | Operator+ | name, slug, repo_url | Project | Slug unique per org |
| Assign Team | Admin+ | project_id, team_id | TeamAssignment | Team must be in same org |
| Create Task | Operator+ | title, description, priority | Task | Project must be active |
| Sync GitHub Issues | System | project_id | Updated tasks | Pull-only, platform master |

### Orchestration Context

| Use Case | Actor | Input | Output | Qoidalar |
|----------|-------|-------|--------|---------|
| Spawn Session | Operator+ | agent_slot_id, project_id, task_id? | Session (spawning) | Max parallel check, project active |
| Send Message | Operator+ | session_id, message | SessionEvent | Session must be active |
| Kill Session | Operator+ | session_id | Session (killed) | Audit logged, workspace cleanup |
| Merge PR | Operator+ | session_id | Session (merging → done) | Human approval gate (V1) |

---

## Domain Services

Har bir context o'z service'lariga ega. Service — business logic'ning markaziy joyi.

### Service tuzilishi

```go
// Har bir service quyidagi pattern'da
type Service struct {
    repo      Repository     // database access
    eventBus  EventPublisher // event yoborish
    // boshqa dependency'lar (interface orqali)
}

func NewService(repo Repository, eventBus EventPublisher) *Service {
    return &Service{repo: repo, eventBus: eventBus}
}

// Public method'lar — Use Case'lar
func (s *Service) Create(ctx context.Context, input CreateInput) (*Entity, error) {
    // 1. Validation
    if err := input.Validate(); err != nil {
        return nil, err
    }

    // 2. Business rule check
    existing, err := s.repo.FindBySlug(ctx, input.Slug)
    if err != nil {
        return nil, fmt.Errorf("check slug: %w", err)
    }
    if existing != nil {
        return nil, &AppError{Code: "SLUG_EXISTS", Status: 409}
    }

    // 3. Entity creation
    entity := &Entity{
        ID:        uuid.Must(uuid.NewV7()),
        Name:      input.Name,
        Slug:      input.Slug,
        CreatedAt: time.Now(),
    }

    // 4. Persistence
    if err := s.repo.Create(ctx, entity); err != nil {
        return nil, fmt.Errorf("create entity: %w", err)
    }

    // 5. Event emission
    s.eventBus.Publish(ctx, Event{
        Type:    "entity.created",
        Payload: entity,
        Source:  "context-name",
    })

    return entity, nil
}
```

### Cross-context communication

`bounded-contexts.md` L208-209 asosida — context'lar faqat **event** orqali gaplashadi:

```
Identity ---[user.registered]--→ Organization (personal org yaratish)
Organization ---[team.deleted]--→ Orchestration (session cleanup)
Orchestration ---[session.status_changed]--→ Notification (alert)
Project ---[project.archived]--→ Orchestration (active session kill)
```

**Qat'iy qoida:** Context A, Context B'ning database'iga to'g'ridan **kira olmaydi**.

### Cross-context querier

Faqat read uchun — `bounded-contexts.md` L99-100:

```go
// Identity context'da — boshqa context'lar user ma'lumotini bilib olishi uchun
type UserQuerier interface {
    GetUserByID(ctx context.Context, id uuid.UUID) (*UserInfo, error)
}

// Organization context'da
type OrgQuerier interface {
    GetOrgByID(ctx context.Context, id uuid.UUID) (*OrgInfo, error)
    IsUserMember(ctx context.Context, orgID, userID uuid.UUID) (bool, error)
}
```

---

## Validatsiya strategiyasi

### 3 qatlamli validatsiya

```
Layer 1: Transport (Handler)
  - JSON parse
  - Required field'lar
  - Format (email, UUID)

Layer 2: Business (Service)
  - Uniqueness check (slug, email)
  - State transition validation
  - Permission check
  - Business invariant'lar

Layer 3: Data (Database)
  - UNIQUE constraint (last resort)
  - FK constraint
  - NOT NULL
  - CHECK constraint
```

### Input validation pattern

```go
type CreateOrgInput struct {
    Name string `json:"name" validate:"required,min=2,max=100"`
    Slug string `json:"slug" validate:"required,min=3,max=50,slug"`
    Type string `json:"type" validate:"required,oneof=company personal"`
}

func (i *CreateOrgInput) Validate() error {
    if i.Name == "" {
        return &ValidationError{Field: "name", Message: "Name is required"}
    }
    if !slugRegex.MatchString(i.Slug) {
        return &ValidationError{Field: "slug", Message: "Slug must be alphanumeric and hyphens"}
    }
    return nil
}
```

### Session state machine

`domain-model.md` L206-218 dan:

```
                    ┌─────────────────────────────────┐
                    │                                 │
spawning ──→ working ──→ waiting_for_input ──→ working
                │              │
                ▼              ▼
         needs_response ──→ working
                │
                ▼
         review_requested ──→ ready_to_merge ──→ merging ──→ done
                │                                    │
                ▼                                    ▼
             working                              failed

     [har qanday aktiv status] ──→ killed (operator override)
```

**Ruxsat etilgan o'tishlar:**

| From | To | Trigger |
|------|----|---------|
| `spawning` | `working` | Runtime ready signal |
| `working` | `waiting_for_input` | Agent input so'radi |
| `working` | `needs_response` | CI failed / comment keldi |
| `working` | `review_requested` | Agent PR yaratdi |
| `waiting_for_input` | `working` | Operator javob berdi |
| `needs_response` | `working` | Operator muammoni hal qildi |
| `review_requested` | `ready_to_merge` | Review tasdiqlandi |
| `review_requested` | `working` | Review rad etildi |
| `ready_to_merge` | `merging` | Operator merge bosdi |
| `merging` | `done` | Merge muvaffaqiyatli |
| `merging` | `failed` | Merge conflict |
| `*` (any active) | `killed` | Operator kill qildi |
| `spawning` | `failed` | Runtime start xatosi |

**Ruxsat etilMAgan o'tishlar sababli xato:**
```go
func (s *Session) TransitionTo(newStatus SessionStatus) error {
    if !s.isValidTransition(newStatus) {
        return &AppError{
            Code:    "INVALID_STATUS_TRANSITION",
            Status:  422,
            Message: fmt.Sprintf("Cannot transition from %s to %s", s.Status, newStatus),
        }
    }
    s.Status = newStatus
    return nil
}
```

---

## Versiya

- v1.0
- Status: **APPROVED**
- Keyingi ko'rib chiqish: Phase 1 Sprint 2 (Identity Context) boshlanganda
