# Architecture Decision Process

## Maqsad

Ushbu hujjat katta texnik qarorlar qanday taklif qilinishi, ko'rib chiqilishi, tasdiqlanishi va qayd etilishini belgilaydi.

Bu hujjat `repo-governance.md` (hujjat qoidalari) va `engineering-principles.md` (docs before code) ga asoslanadi. ADR formati `03-templates/adr-template.md` da belgilangan.

---

## Decision Flow

```
1. Muammo aniq yoziladi (Context)
         ↓
2. Cheklovlar va variantlar ro'yxatga olinadi (Alternatives)
         ↓
3. Taklif qilingan qaror review qilinadi (Decision)
         ↓
4. Tasdiqlangan qaror ADR sifatida yoziladi (Record)
         ↓
5. Implementation ADR'ga mos amalga oshiriladi
```

---

## When an ADR Is Required

ADR **majburiy** bo'lgan holatlar:

| Toifa | Misol |
|-------|-------|
| **Texnologiya tanlash** | Yangi til, framework, database tanlash |
| **Arxitektura pattern** | Monolith vs microservice, event bus, caching strategy |
| **Data model o'zgarishi** | Yangi entity, entity munosabati o'zgarishi |
| **Security qaror** | Auth mexanizmi, encryption, trust boundary o'zgarishi |
| **Integration qaror** | Yangi tashqi tizim qo'shish, API contract o'zgarishi |
| **Breaking change** | API versioning, hujjat tuzilmasi o'zgarishi |
| **Trade-off** | Performance vs simplicity, flexibility vs consistency |

ADR **kerak emas** bo'lgan holatlar:
- Minor refactoring (behavior o'zgarmaydi)
- Dependency version update (breaking bo'lmasa)
- Bug fix
- Hujjat tuzatish
- Test qo'shish

---

## Approval Expectations

| ADR turi | Kim tasdiqlaydi | Review muddati |
|----------|----------------|----------------|
| Foundation (stack, architecture) | Owner | 48 soat |
| Module-level (paket dizayni) | Owner / Lead | 24 soat |
| Integration (tashqi tizim) | Owner | 24 soat |
| Process (workflow, governance) | Owner | 24 soat |

**Status flow:**
```
Proposed → In Review → Accepted / Rejected → [Superseded]
```

---

## Review Cadence

- **Yangi ADR:** PR orqali review — approved bo'lgunga qadar merge yo'q
- **Mavjud ADR:** Har sprint tugaganda — hali relevant mi tekshiriladi
- **Superseded ADR:** Yangi ADR yaratiladi, eski ADR'da `Supersedes` field yangilanadi

---

## ADR naming va joylash

```
docs/06-adrs/
├── ADR-000-template.md              ← Template
├── ADR-001-go-core-backend.md       ← Example
├── ADR-002-desktop-tauri.md
└── ADR-{NNN}-{kebab-topic}.md       ← Pattern
```

---

## Versiya

- v1.0
- Status: **APPROVED**
