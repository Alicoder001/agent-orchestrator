# Decision Backlog

## Maqsad

Ushbu hujjat ADR darajasiga yetmaydigan, lekin qayd etib qo'yish kerak bo'lgan texnik va product qarorlarni tracking qiladi.

Bu hujjat `architecture-decision-process.md` (ADR trigger criteria), `open-questions.md` va `assumptions-register.md` ga asoslanadi.

---

## Backlog

### DB-001: Session Event Storage Format

| Field | Qiymat |
|-------|--------|
| **Savol** | SessionEvent payload'ni JSONB da saqlashmi yoki alohida typed column'larda? |
| **Kontekst** | SessionEvent 5+ type bor, har birining payload'i boshqa |
| **Qaror** | JSONB — flexible, schema evolution oson |
| **Sana** | 2026-03-09 |
| **Qaror beruvchi** | Architecture owner |

### DB-002: Frontend State Management Split

| Field | Qiymat |
|-------|--------|
| **Savol** | Zustand va TanStack Query o'rtasida qaysi data qayerda boshqariladi? |
| **Kontekst** | ADR-005 umumiy approach belgiladi, lekin aniq boundary yo'q |
| **Qaror** | TanStack Query: server data (fetch, mutate), Zustand: UI state (modals, filters, selection) |
| **Sana** | 2026-03-09 |
| **Qaror beruvchi** | Architecture owner |

### DB-003: Agent Output Parsing Strategy

| Field | Qiymat |
|-------|--------|
| **Savol** | Agent terminal output'ini qanday parse qilamiz (PR create, CI result, error)? |
| **Kontekst** | Har bir agent tool (Cursor, Aider) turlicha output beradi |
| **Qaror** | Pending — V1 da minimal regex-based, V2 da structured output adapter |
| **Sana** | — |
| **Status** | ⏳ Open |

### DB-004: Git Clone Strategy

| Field | Qiymat |
|-------|--------|
| **Savol** | Har session uchun full clone qilamizmi yoki shared bare repo + worktree? |
| **Kontekst** | Full clone sekin lekin izolyatsiya to'liq, shared bare - tez lekin complexity bor |
| **Qaror** | V1: Shallow clone (`--depth 1`), V2: bare repo + worktree |
| **Sana** | 2026-03-09 |
| **Qaror beruvchi** | Architecture owner |

### DB-005: Error Retry Policy (API)

| Field | Qiymat |
|-------|--------|
| **Savol** | API xatoliklarda retry qanday bo'ladi — client yoki server side? |
| **Kontekst** | GitHub API, LLM provider API — external dependency xatolari |
| **Qaror** | Server-side: exponential backoff (1s, 2s, 4s), max 3, idempotency key bilan |
| **Sana** | 2026-03-09 |
| **Qaror beruvchi** | Architecture owner |

### DB-006: Timezone Handling

| Field | Qiymat |
|-------|--------|
| **Savol** | Timestamp'lar qaysi timezone'da saqlanadi va ko'rsatiladi? |
| **Kontekst** | Multi-region foydalanuvchilar turli timezone'larda |
| **Qaror** | Storage: UTC always. Display: user profile timezone preference |
| **Sana** | 2026-03-09 |
| **Qaror beruvchi** | Architecture owner |

---

## Versiya

- v1.0
- Status: **APPROVED**
