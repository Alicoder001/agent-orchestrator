# Engineering Principles

## Maqsad

Ushbu hujjat platformani qurishda qo'llaniladigan muhandislik tamoyillarini belgilaydi. Bu tamoyillar barcha qarorlar — arxitektura, kod, test, deploy — uchun asosiy filtr hisoblanadi.

Bu hujjat `vision.md` (keng strategik yo'nalish) va `scope.md` (v1 chegaralari) ga asoslanadi.

---

## Core Principles

### 1. Docs before code

Hujjat koddan oldin keladi. Agar implement qilinayotgan narsa hujjatda yo'q bo'lsa — avval hujjat yoziladi.

**Amalda:**
- Yangi modul → bounded context hujjatida mavjud bo'lishi kerak
- Yangi API → `api-conventions.md` ga mos bo'lishi kerak
- Yangi entity → `domain-model.md` da belgilangan bo'lishi kerak

**Istisno:** Tezkor experiment yoki spike — lekin natija hujjatlashtirilishi shart.

### 2. Boundaries first

Chegaralarni oldin belgilash — keyin implement qilish. Modul chegaralari, context chegaralari va API chegaralari loyiha boshidanoq aniq bo'lishi kerak.

**Amalda:**
- Context'lar o'rtasida to'g'ridan import **taqiqlangan** (`bounded-contexts.md` L211-214)
- Module → Module faqat interface orqali (`application-architecture.md` L234)
- Cross-schema SQL JOIN **taqiqlangan** (`data-architecture.md` L107)

### 3. Explicit over implicit

Yashirin xatti-harakatlardan ko'ra aniq deklaratsiya. Configuration, dependency injection, va error handling barchasi explicit bo'lishi kerak.

**Amalda:**
- Config faylda barcha sozlamalar ochiq ko'rinadi
- Dependency injection interface orqali amalga oshiriladi
- Error'lar typed va categorized (`AppError` struct)
- Event type'lar string constant sifatida aniqlangan

### 4. Test at the boundary

Har bir modul o'z chegarasida test qilinadi. Internal implementation detail emas — public API va behavior test qilinadi.

**Amalda:**
- Handler test: HTTP request/response darajasida
- Service test: business logic behavior
- Repository test: real database bilan (integration)
- Contract test: API schema mos kelishini tekshirish
- Minimum 70% coverage har bir modul uchun (`implementation-sequencing.md` L56)

### 5. Fail loud, recover gracefully

Xato yashirilmaydi — tez va aniq ko'rsatiladi. Lekin tizim bitta xatoda butunlay to'xtamaydi.

**Amalda:**
- Panic faqat dastur boshlanishida (config yuklanmasa, database ulanmasa)
- Runtime'da panic o'rniga error return
- Recovery middleware (`application-architecture.md` L128)
- Session xato qilsa — session `failed` statusga o'tadi, platforma ishlab turadi

### 6. Composition over inheritance

Go'da inheritance yo'q — bu yaxshi. Barcha tuzilmalar composition va interface orqali quriladi.

**Amalda:**
- Module'lar mustaqil — shared package orqali umumiy utility ishlatadi
- Event bus interface orqali inject qilinadi — implementation almashtirilishi mumkin (`ADR-004`)
- Runtime adapter interface orqali ulanadi — tmux, process, Docker bir xil contract
- Provider adapter interface orqali ulanadi (`runtime-and-provider-adapter-model.md`)

### 7. Extraction-ready from day one

V1 monolith — lekin extraction uchun tayyor. Har bir modul alohida service bo'lishi mumkin darajada yoziladi.

**Amalda:**
- Har bir module o'z schema'siga ega (`data-architecture.md` L93-103)
- Module'lar faqat event bus va interface orqali gaplashadi
- Database pool per-schema (`ADR-003`)
- Extraction trigger aniqlangan (`application-architecture.md` L68-73)

---

## Non-Negotiables

Quyidagilar hech qachon buzilmaydi:

| Qoida | Sabab |
|-------|-------|
| Secret kodda bo'lmaydi | Security — `repo-governance.md` #7 |
| Agent output to'g'ridan execute qilinmaydi | Trust model — `system-context.md` L165 |
| Cross-context direct SQL taqiqlangan | Boundary — `bounded-contexts.md` L212 |
| Test'siz kod merge qilinmaydi | Quality — `repo-governance.md` #5 |
| Hujjatsiz behavior qabul qilinmaydi | Clarity — `repo-governance.md` #1 |
| `any` type (TypeScript) taqiqlangan | Type safety |
| Legacy repo'ga yozish taqiqlangan | Archive policy — `scope.md` L84 |

---

## Tradeoff Rules

Qarorlar orasida tanlov kerak bo'lganda:

| Tanlash | ... o'rniga | Sabab |
|---------|-------------|-------|
| Clarity | Cleverness | Kodni 6 oy keyin ham tushunish kerak |
| Safety | Speed | Xato tez yoyiladi, tuzatish qimmat |
| Simplicity | Feature richness | V1 uchun kam lekin sifatli |
| Interface | Tight coupling | Extraction imkoniyati saqlanadi |
| Explicit config | Magic defaults | Debug qilish osonlashadi |
| Boring technology | Trendy library | Production stability ustunroq |
| Small PR | Giant PR | Review va rollback osonlashadi |

---

## Qanday qo'llaniladi

1. **PR review:** har bir PR ushbu tamoyillarga tekshiriladi
2. **Architecture qaror:** yangi component qo'shishda ushbu filtrdan o'tkaziladi
3. **Agent onboarding:** agent'lar ushbu hujjatni context sifatida oladi
4. **Dispute resolution:** qaror bo'yicha kelishmovchilik bo'lsa — tamoyillarga qaytiladi

---

## Versiya

- v1.0
- Status: **APPROVED**
- Keyingi ko'rib chiqish: Phase 1 Sprint 2 tugagandan keyin
