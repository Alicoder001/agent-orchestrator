# Coding Standards

## Maqsad

Ushbu hujjat platformadagi barcha kod uchun yagona sifat va uslub standartlarini belgilaydi. Go (backend) va TypeScript (frontend) uchun alohida qoidalar mavjud.

Bu hujjat `engineering-principles.md`, `application-architecture.md` va `repo-governance.md` ga asoslanadi.

---

## Go Backend Standards

### Stil va formatlash

| Qoida | Vosita |
|-------|--------|
| Formatlash | `gofmt` (standart — o'zgartirilmaydi) |
| Linting | `golangci-lint` (config: `.golangci.yml`) |
| Import tartibi | stdlib → external → internal (goimports bilan) |
| Line length | Qat'iy cheklov yo'q, lekin 120 belgi tavsiya |

### Naming

```go
// Exported types va funksiyalar — PascalCase
type Organization struct { ... }
func NewOrganizationService(...) *Service { ... }

// Unexported — camelCase
func (s *Service) validateSlug(slug string) error { ... }

// Constants — PascalCase (exported), camelCase (unexported)
const MaxSessionsPerTeam = 50
const defaultTimeout = 30 * time.Second

// Interface — behavior nomi + "er" yoki maqsadli nom
type Publisher interface { ... }
type OrgQuerier interface { ... }  // cross-module query uchun

// Receiver — bitta harf yoki qisqa abbreviatura
func (s *Service) Create(...) { ... }
func (r *Repository) FindBySlug(...) { ... }
```

### Error handling

```go
// ✅ TO'G'RI — AppError qaytarish
func (s *Service) GetOrganization(ctx context.Context, id uuid.UUID) (*Organization, error) {
    org, err := s.repo.FindByID(ctx, id)
    if err != nil {
        return nil, fmt.Errorf("get organization: %w", err)
    }
    if org == nil {
        return nil, &AppError{Code: "ORG_NOT_FOUND", Status: 404, Message: "Organization not found"}
    }
    return org, nil
}

// ❌ NOTO'G'RI — error'ni yutib yuborish
func (s *Service) GetOrganization(ctx context.Context, id uuid.UUID) *Organization {
    org, _ := s.repo.FindByID(ctx, id) // TAQIQLANGAN
    return org
}
```

**Qoidalar:**
- Error hech qachon ignore qilinmaydi (`_` faqat test setup'da)
- Error wrap qilinadi: `fmt.Errorf("context: %w", err)`
- Domain error uchun `AppError` struct ishlatiladi (`application-architecture.md` L299-303)
- Panic faqat `main.go` initialization da (database, config yuklanmasa)

### Package tuzilishi

Har bir module ichida qat'iy layer tartib (`application-architecture.md` L166-215):

```
modules/{context}/
├── handler.go       # HTTP — faqat transport logic
├── service.go       # Business logic — core domain
├── repository.go    # Database — faqat SQL
├── model.go         # Domain struct + DTO
├── events.go        # Event definitions
└── handler_test.go  # Test'lar
```

**Qat'iy qoidalar:**
- Handler → Service → Repository — faqat shu yo'nalishda
- Handler'da business logic **taqiqlangan**
- Repository'da domain logic **taqiqlangan**
- Model'da database tag'lar bo'lishi mumkin, lekin logic bo'lmaydi

### Context va cancellation

```go
// Har bir public function ctx qabul qiladi
func (s *Service) Create(ctx context.Context, input CreateOrgInput) (*Organization, error) {
    // ctx ni repository va tashqi chaqiqlarga uzatish
    return s.repo.Create(ctx, org)
}

// HTTP handler'da context request'dan olinadi
func (h *Handler) CreateOrg(w http.ResponseWriter, r *http.Request) {
    ctx := r.Context()
    // ...
}
```

---

## TypeScript Frontend Standards

### Stil va formatlash

| Qoida | Vosita |
|-------|--------|
| Formatlash | Prettier (config: `.prettierrc`) |
| Linting | ESLint + `@typescript-eslint` |
| Import tartibi | external → internal → relative (eslint-plugin-import) |
| Semicolons | Ha (Prettier default) |
| Quotes | Single quotes |

### Naming

```typescript
// Components — PascalCase
export function SessionCard({ session }: SessionCardProps) { ... }

// Hooks — camelCase, "use" prefix
export function useSessionList(projectId: string) { ... }

// Types/Interfaces — PascalCase
interface SessionCardProps { ... }
type SessionStatus = 'working' | 'needs_response' | 'done';

// Constants — UPPER_SNAKE_CASE
export const MAX_VISIBLE_SESSIONS = 50;
export const API_BASE_URL = '/api/v1';

// Utils va helpers — camelCase
export function formatSessionDuration(seconds: number): string { ... }

// Files — kebab-case
// session-card.tsx, use-session-list.ts, session.types.ts
```

### Type safety

```typescript
// ✅ TO'G'RI — strict types
interface Session {
  id: string;
  status: SessionStatus;
  projectId: string;
  createdAt: string;
}

// ❌ TAQIQLANGAN — `any` ishlatish
function processSession(data: any) { ... } // HECH QACHON

// ❌ TAQIQLANGAN — type assertion'siz cast
const session = data as Session; // faqat zarurat bo'lganda va validated bo'lsa
```

**Qoidalar:**
- `any` type **butunlay taqiqlangan** (`engineering-principles.md` non-negotiable)
- `unknown` ishlatib, keyin type guard bilan narrowing
- API response type'lar `packages/types` dan import qilinadi (auto-generated)
- Component props uchun interface yoziladi

### State management qoidalari

`ADR-005` ga asosan:

```typescript
// Server state → TanStack Query
const { data: sessions } = useQuery({
  queryKey: ['sessions', projectId],
  queryFn: () => api.getSessions(projectId),
});

// Local UI state → Zustand
const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}));

// ❌ NOTO'G'RI — server data Zustand'da
const useStore = create((set) => ({
  sessions: [],  // TAQIQLANGAN — bu server state
}));
```

### Component qoidalari

- Bitta component fayli **200 qatordan** oshmasligi kerak
- Component faqat bitta vazifaga ega bo'lishi kerak (Single Responsibility)
- Murakkab logic → custom hook'ga chiqariladi
- `useEffect` minimal — server state uchun TanStack Query ishlatiladi

---

## Umumiy qoidalar (Go + TypeScript)

### Code review expectations

Har bir PR review'da tekshiriladi:

1. **Domain model mos kelishi** — yangi entity/field `domain-model.md` ga mos
2. **Boundary intizomi** — context chegaralari buzilmaganmi
3. **Error handling** — xatolar to'g'ri qaytarilmoqdami
4. **Test mavjudligi** — yangi behavior uchun test bormi
5. **Naming convention** — ushbu hujjatga mos
6. **Security** — secret yo'qmi, input validation bormi

### Architecture guards

CI pipeline quyidagilarni tekshiradi:

```yaml
# Go
- golangci-lint run
- go test ./...
- go vet ./...

# TypeScript
- eslint .
- tsc --noEmit
- vitest run
```

**Merge blocker'lar:**
- Lint xatosi — merge **taqiqlangan**
- Type error — merge **taqiqlangan**
- Test fail — merge **taqiqlangan**
- Coverage < 70% (yangi modul uchun) — merge **taqiqlangan**

### Git commit qoidalari

Conventional Commits formati (`repo-governance.md` L40-51):

```
feat(orchestration): add session spawn endpoint
fix(identity): handle expired refresh token
docs(architecture): update bounded context diagram
test(organization): add team CRUD integration tests
```

---

## Versiya

- v1.0
- Status: **APPROVED**
- Keyingi ko'rib chiqish: Phase 1 Sprint 1 tugagandan keyin
