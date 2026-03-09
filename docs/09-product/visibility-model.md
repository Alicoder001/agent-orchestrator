# Visibility Model

## Maqsad

Ushbu hujjat platformadagi ko'rinish darajalari va ma'lumotga kirish qoidalarini belgilaydi — kim nimani ko'rishi mumkin.

Bu hujjat `security-architecture.md` (RBAC), `organization-model.md` (role hierarchy) va `surface-and-access-model.md` ga asoslanadi.

---

## Visibility Levels

| Level | Tavsif | Qo'llaniladi |
|-------|--------|-------------|
| `private` | Faqat yaratuvchi va org owner | Draft project, shaxsiy task |
| `internal` | Org ichidagi barcha member'lar | Default project visibility |
| `public` | Platformadagi barcha foydalanuvchilar | Open-source project (Phase 3+) |

---

## Entity bo'yicha visibility

| Entity | V1 Default | O'zgartirish mumkin | Kim o'zgartiradi |
|--------|-----------|-------------------|-----------------|
| Organization | `internal` (org ichida) | Yo'q | — |
| Department | `internal` | Yo'q | — |
| Team | `internal` | Yo'q | — |
| Project | `private` | Ha → `internal` | admin+ |
| Task | Project'dan meros | Yo'q | — |
| Session | Project'dan meros | Yo'q | — |
| SessionEvent | Session'dan meros | Yo'q | — |
| Agent output | Session'dan meros | Yo'q | — |

### Meros (inheritance) qoidasi

```
Organization visibility
  └── Department → Organization'dan meros
      └── Team → Department'dan meros
          └── AgentSlot → Team'dan meros

Project visibility (mustaqil o'rnatiladi)
  └── Task → Project'dan meros
      └── Session → Task/Project'dan meros
          └── SessionEvent → Session'dan meros
```

---

## Access Matrix

| Resurs | Owner | Admin | Operator | Viewer |
|--------|-------|-------|----------|--------|
| Org settings | ✅ R/W | ✅ R | ❌ | ❌ |
| Org member list | ✅ R/W | ✅ R/W | ✅ R | ✅ R |
| Department | ✅ CRUD | ✅ CRUD | ✅ R | ✅ R |
| Team | ✅ CRUD | ✅ CRUD | ✅ R (assigned) | ✅ R |
| Project (internal) | ✅ CRUD | ✅ CRUD | ✅ R/W (assigned) | ✅ R |
| Project (private) | ✅ R/W | ✅ R/W | ❌ | ❌ |
| Task | ✅ CRUD | ✅ CRUD | ✅ CRUD (assigned project) | ✅ R |
| Session | ✅ All | ✅ All | ✅ spawn/kill (assigned) | ✅ R |
| Session output | ✅ R | ✅ R | ✅ R (assigned) | ✅ R |
| Audit log | ✅ R | ✅ R | ❌ | ❌ |

---

## Data isolation

| Level | Mexanizm |
|-------|----------|
| Org-to-org | Schema-per-context + org_id filter |
| User-to-user | RBAC + row-level filter |
| Agent-to-agent | Session isolation (alohida workspace) |
| Project-to-project | Project visibility + membership check |

**Qat'iy qoida:** Bitta org'ning data'si boshqa org'ga **hech qachon** ko'rinmaydi. Bu database darajasida (org_id filter) va application darajasida (middleware) enforce qilinadi.

---

## Versiya

- v1.0
- Status: **APPROVED**
