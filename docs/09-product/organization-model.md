# Organization Model

## Maqsad

Ushbu hujjat Organization entity'sining tuzilishi, turlari, lifecycle va biznes qoidalarini belgilaydi.

Bu hujjat `domain-model.md` (Organization entity), `bounded-contexts.md` (Organization context) va `business-logic-architecture.md` (use cases) ga asoslanadi.

---

## Organization nima

Organization — platformadagi eng yuqori hierarchical unit. Barcha resurslar (team'lar, project'lar, agent'lar) bitta organization ichida mavjud.

```
Organization
├── Department'lar
│   └── Team'lar
│       └── AgentSlot'lar
├── Member'lar (Role bilan)
├── Project'lar
│   └── Task'lar
└── Sozlamalar
```

---

## Organization turlari

| Tur | Tavsif | Yaratilishi | Misol |
|----|--------|-------------|-------|
| `personal` | Shaxsiy organization | Avtomatik (register vaqtida) | "john-workspace" |
| `company` | Kompaniya yoki jamoa | Manual (foydalanuvchi yaratadi) | "acme-corp" |

### Personal vs Company farqlari

| Xususiyat | Personal | Company |
|-----------|----------|---------|
| Yaratilishi | Avtomatik | Manual |
| Owner | Faqat 1 (creator) | 1+ (ko'p owner mumkin) |
| Member invite | Yo'q (faqat o'zi) | Ha |
| Department | Yo'q | Ha |
| Billing (keyinroq) | Individual plan | Team/Enterprise plan |
| O'chirish | Account bilan birga | Owner qaror beradi |

---

## Organization Entity

```
Organization {
  id:          UUID v7 (primary key)
  name:        string (2-100 belgi)
  slug:        string (3-50, unique, alphanumeric + hyphen)
  type:        "personal" | "company"
  avatar_url:  string? (optional)
  settings:    JSONB (org-level sozlamalar)
  is_active:   boolean (default: true)
  created_at:  timestamp
  updated_at:  timestamp
  deleted_at:  timestamp? (soft delete)
}
```

### Slug qoidalari

- 3-50 belgi
- Faqat lowercase alphanumeric va hyphen (`a-z`, `0-9`, `-`)
- Boshi va oxiri hyphen emas
- Globally unique (barcha org'lar orasida)
- Yaratilgandan keyin **o'zgartirilmaydi** (V1)

---

## Membership Model

```
Membership {
  id:          UUID v7
  org_id:      → Organization
  user_id:     → User
  role:        "owner" | "admin" | "operator" | "viewer"
  status:      "active" | "pending" | "deactivated"
  invited_by:  → User?
  joined_at:   timestamp?
  created_at:  timestamp
}
```

### Role hierarchiyasi

```
owner > admin > operator > viewer
```

| Role | Org CRUD | Member manage | Project manage | Session manage | Sozlamalar |
|------|----------|---------------|---------------|---------------|------------|
| `owner` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `admin` | ❌ (read) | ✅ | ✅ | ✅ | ✅ |
| `operator` | ❌ | ❌ | ✅ (assigned) | ✅ | ❌ |
| `viewer` | ❌ | ❌ | ❌ (read) | ❌ (read) | ❌ |

---

## Lifecycle

```
CREATED ──→ ACTIVE ──→ ARCHIVED ──→ DELETED (hard, 30 kun keyin)
                          ↑
                          └── REACTIVATED (admin qaror)
```

### Invariantlar

| Qoida | Enforce |
|-------|---------|
| Kamida bitta owner bo'lishi kerak | Service (owner remove bloklaydi) |
| Oxirgi owner role o'zgartira olmaydi | Service check |
| Slug globally unique | DB unique constraint + Service |
| Personal org nomi o'zgartirilmaydi | Service check |
| Arxivlangan org'da yangi project yaratilmaydi | Service check |
| Soft-deleted org 30 kun keyin hard-delete | Background job (keyinroq) |

---

## Settings

Organization-level sozlamalar JSONB'da:

```json
{
  "max_parallel_sessions": 20,
  "default_agent_timeout_minutes": 120,
  "require_pr_approval": true,
  "allowed_llm_providers": ["openai", "anthropic"],
  "notification_preferences": {
    "slack_webhook": null,
    "email_alerts": true
  }
}
```

---

## Versiya

- v1.0
- Status: **APPROVED**
