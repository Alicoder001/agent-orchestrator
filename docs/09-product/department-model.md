# Department Model

## Maqsad

Ushbu hujjat Department entity'sining maqsadi, turlari va tashkiliy qoidalarini belgilaydi.

Bu hujjat `domain-model.md` (Department entity) va `organization-model.md` ga asoslanadi.

---

## Department nima

Department — Organization ichidagi funksional yoki loyiha-asosli gruppa. Team'lar department ichida joylashadi. Real-world kompaniyadagi "bo'lim" ga teng.

```
Organization
└── Department (Engineering, Product, Design)
    └── Team (Backend Team, AI Team, Frontend Team)
        └── AgentSlot
```

---

## Department turlari

| Tur | Tavsif | Misol |
|----|--------|-------|
| `engineering` | Texnik — backend, frontend, infra | "Engineering", "Platform" |
| `product` | Product management, UX, research | "Product", "Design" |
| `operations` | DevOps, QA, support | "Operations", "QA" |
| `custom` | Foydalanuvchi belgilagan | "Growth", "AI Research" |

---

## Department Entity

```
Department {
  id:          UUID v7
  org_id:      → Organization
  name:        string (2-100)
  slug:        string (3-50, unique per org)
  type:        "engineering" | "product" | "operations" | "custom"
  description: string? (optional)
  head_id:     → User? (department boshlig'i, optional)
  is_active:   boolean (default: true)
  created_at:  timestamp
  updated_at:  timestamp
  deleted_at:  timestamp? (soft delete)
}
```

---

## Qoidalar

| Qoida | Tavsif |
|-------|--------|
| Department slug org ichida unique | DB unique (org_id, slug) |
| Department o'chirilsa — ichidagi team'lar ham soft-delete | Cascade soft-delete |
| Department faqat admin+ yarata oladi | Authorization check |
| Bitta org'da max 50 department (V1) | Service limit |
| Personal org'da department yo'q | Type check |

---

## Versiya

- v1.0
- Status: **APPROVED**
