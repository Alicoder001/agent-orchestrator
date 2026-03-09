# User Personas

## Maqsad

Ushbu hujjat platformaning asosiy foydalanuvchi tiplarini, ularning ehtiyojlari, og'riq nuqtalari va platformadan boshqa kutishlarini belgilaydi.

Bu hujjat `vision.md` (target audience), `scope.md` (V1 scope) va `surface-and-access-model.md` (access model) ga asoslanadi.

---

## Persona 1: Solo Developer — "Sardor"

**Profil:**
- Mustaqil fullstack developer, freelancer
- 1-3 ta loyihani parallel olib boradi
- AI coding tools (Cursor, Copilot) dan faol foydalanadi

**Ehtiyoj:**
- Bir nechta AI agent'ni bir vaqtda turli task'larga yuborish
- Agent natijalarini bitta dashboard'dan kuzatish
- PR review va merge jarayonini tezlashtirish

**Og'riq nuqtasi:**
- Har bir agent uchun alohida terminal ochib, kuzatib o'tirish
- Agent qachon to'xtab qolganini bilmaslik (attention problem)
- Kontekst switching — boshqa task'ga o'tganda oldingi task holatini unutish

**Platformadan kutish:**
- "Bitta joy" — barcha agent'lar bir joyda
- Attention zone — qachon diqqat kerak bo'lsa signal bersin
- Oddiy setup — 5 daqiqada ishga tushsin

**V1 engagement:** Personal org, 2-5 agent slot, 1-3 project

---

## Persona 2: Tech Lead — "Nilufar"

**Profil:**
- 5+ yillik tajriba, 3-8 kishilik jamoa boshlig'i
- Sprint planning va code review bilan band
- AI agent'larni jamoa ishi sifatida boshqarmoqchi

**Ehtiyoj:**
- Jamoaning barcha agent'larini kuzatish
- Agent'larga task assign qilish va natijani review qilish
- Kod sifatini nazorat qilish (test, lint, PR standard)
- Sprint progress — agent va inson ishi birgalikda

**Og'riq nuqtasi:**
- Agent'lar yaratgan PR'larni review qilish qanchalik vaqt oladi — bilmaydi
- Agent qaysi task'da ishlayotganini kuzatish qiyin
- Agent'lar o'zaro conflict yaratishi (bir xil fayl edit)

**Platformadan kutish:**
- Dashboard — jamoa va agent status bir ko'rishda
- PR quality gate — merge qilishdan oldin avto-check
- Conflict detection — parallel ish qoidalari

**V1 engagement:** Company org, 1-2 department, 3-5 team, 10-20 agent slot

---

## Persona 3: AI-First Startup CTO — "Ravshan"

**Profil:**
- Startup CTO, 10-20 kishilik dev jamoa
- AI agent'larni "virtual developer" sifatida ko'radi
- Agent'lar bilan inson ratio 3:1 ga yetkazmoqchi

**Ehtiyoj:**
- 50+ agent'ni parallel boshqarish
- Department va team tuzilmasida agent'larni tashkil qilish
- Cost tracking — qaysi agent qancha LLM token sarflayapti
- Compliance — agent'lar nima qilyotganini audit qilish

**Og'riq nuqtasi:**
- Scale — 50 agent'ni tmux terminal'da kuzatib bo'lmaydi
- Visibility — kim nima qilyapti hozir?
- Budget control — agent'lar cheksiz token ishlata olmasligi kerak

**Platformadan kutish:**
- Organization tuzilmasi — department → team → agent slot
- Analytics — session duration, PR merge rate, cost per task
- Budget limits — agent yoki team darajasida

**V1 engagement:** Company org, 3+ department, 10+ team, 50+ agent slot

---

## Persona 4: Enterprise Engineering Manager — "Kamola" (Phase 3+)

**Profil:**
- Katta kompaniyada 50+ developer jamoani boshqaradi
- SSO, compliance, audit muhim
- Multi-team, multi-project boshqarish

**Ehtiyoj:**
- Enterprise SSO (SAML, OIDC)
- RBAC — nozik darajadagi permission
- Audit log — kim, qachon, nima qildi
- Multi-org yoki multi-workspace

**V1 relevance:** Hozircha to'g'ridan-to'g'ri emas, lekin RBAC va audit log infra V1 da qo'yiladi.

---

## Persona Mapping

| Persona | Org type | Phase | Asosiy surface |
|---------|----------|-------|---------------|
| Solo Developer | personal | V1 | Web dashboard |
| Tech Lead | company (small) | V1 | Web + Desktop |
| Startup CTO | company (medium) | V1-V2 | Web + CLI |
| Enterprise Manager | company (large) | V3+ | Web + Desktop + API |

---

## Versiya

- v1.0
- Status: **APPROVED**
