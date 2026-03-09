# Definition of Done

## Maqsad

Ushbu hujjat task, feature, yoki hujjat qachon "tugagan" deb hisoblanishini belgilaydi. Barcha aktorlar — inson va agent — shu mezonlarga rioya qiladi.

Bu hujjat `repo-governance.md`, `testing-strategy.md` va `engineering-principles.md` ga asoslanadi.

---

## A Task Is Done When

### Kod deliverable uchun

| # | Mezon | Tekshiruvchi |
|---|-------|-------------|
| 1 | Deliverable agreed scope'ga mos keladi | PR reviewer |
| 2 | Test'lar yozilgan va o'tadi (unit + integration) | CI pipeline |
| 3 | Coverage ≥ 70% (yangi modul uchun) | CI / codecov |
| 4 | Lint va typecheck xatosiz | CI pipeline |
| 5 | PR description to'liq (nima, nima uchun, qanday tekshirish) | PR reviewer |
| 6 | Tegishli hujjat yangilangan (agar behavior o'zgargan bo'lsa) | PR reviewer |
| 7 | `.env.example` yangilangan (agar yangi env qo'shilsa) | PR reviewer |
| 8 | OpenAPI spec yangilangan (agar API o'zgarsa) | PR reviewer |
| 9 | Secret kodda yo'q | CI / reviewer |
| 10 | Peer review tasdiqlangan (kamida 1 approval) | GitHub PR |

### Hujjat deliverable uchun

| # | Mezon | Tekshiruvchi |
|---|-------|-------------|
| 1 | Hech qanday TODO yoki placeholder qolmagan | Reviewer |
| 2 | Boshqa hujjatlarga cross-reference to'g'ri | Reviewer |
| 3 | Versiya bo'limi mavjud | Reviewer |
| 4 | Uslub mavjud A-darajali hujjatlarga mos | Reviewer |

### Agent session deliverable uchun

| # | Mezon | Tekshiruvchi |
|---|-------|-------------|
| 1 | Task scope to'liq bajarilgan | Operator |
| 2 | PR yaratilgan va CI yashil | CI → Operator |
| 3 | Worklog yangilangan (`docs/08-worklogs/agents/{id}.md`) | Agent |
| 4 | Blocker yoki follow-up qayd etilgan | Agent → Operator |

---

## Exceptions

Quyidagi hollarda "done" moslashtirilishi mumkin:

| Holat | Qoidasi |
|-------|---------|
| **Spike/Experiment** | Test kerak emas, lekin natija hujjatlashtirilishi shart |
| **Hotfix** | Test keyinroq qo'shilishi mumkin (24 soat ichida), lekin PR review majburiy |
| **Docs-only PR** | Kod test kerak emas, faqat hujjat review |
| **Refactoring** | Mavjud test'lar o'tishi va yangi behavior qo'shilmagani tasdiqlanishi kerak |
| **Dependency update** | Mavjud test'lar o'tishi yetarli, lekin breaking change bo'lsa review kuchaytiriladi |

**Qat'iy qoida:** Hech qanday exception `repo-governance.md` dagi non-negotiable'larni bekor qilmaydi.

---

## Done emas holatlar

Quyidagilar "done" **hisoblanmaydi**:

- Kod yozildi, lekin test yo'q
- Test yozildi, lekin CI'da ishlamaydi
- PR yaratildi, lekin review so'ralmadi
- Feature ishlaydi, lekin hujjatlashtirilmadi
- Agent ishladi, lekin worklog yangilanmadi

---

## Versiya

- v1.0
- Status: **APPROVED**
- Keyingi ko'rib chiqish: Phase 1 Sprint 2 tugaganda
