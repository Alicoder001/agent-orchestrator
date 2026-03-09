# Definition of Ready

## Maqsad

Ushbu hujjat task yoki feature qachon ishga boshlash uchun "tayyor" deb hisoblanishini belgilaydi. Tayyor bo'lmagan task'da ish boshlanmaydi.

Bu hujjat `agent-operating-model.md` (escalation rules) va `engineering-principles.md` (docs before code) ga asoslanadi.

---

## A Task Is Ready When

### Majburiy mezonlar

| # | Mezon | Kim ta'minlaydi |
|---|-------|-----------------|
| 1 | **Problem statement aniq** — nima muammo yoki nima quriladi | Task yaratuvchi |
| 2 | **Scope chegaralangan** — nima qilinadi va nima qilinMAYdi | Task yaratuvchi |
| 3 | **Dependencies aniqlangan** — nimaga bog'liq (boshqa task, API, hujjat) | Task yaratuvchi + reviewer |
| 4 | **Expected output aniqlangan** — natija nima bo'lishi kerak (endpoint, UI, hujjat) | Task yaratuvchi |
| 5 | **Ownership belgilangan** — kim (yoki qaysi agent) bajaradi | Operator |
| 6 | **Tegishli hujjat mavjud** — domain model, bounded context, API spec | Architecture owner |

### Agent task uchun qo'shimcha mezonlar

| # | Mezon | Kim ta'minlaydi |
|---|-------|-----------------|
| 7 | **Branch nomi aniqlangan** | Operator yoki auto-generate |
| 8 | **Workspace tayyor** — repo clone, dependencies installed | Platform / CI |
| 9 | **Context yetarli** — task description'da agent ishlash uchun kerakli ma'lumot bor | Operator |
| 10 | **Parallel conflict yo'q** — boshqa agent yoki inson shu fayl'larda ishlamayapti | Platform check |

---

## Not Ready holatlar

Quyidagi hollarda task **tayyor emas** va ish **boshlanmaydi**:

| Holat | Nima qilish kerak |
|-------|-------------------|
| Problem noaniq — "bu narsani yaxshila" | Aniq problem statement yozish |
| Scope cheksiz — "barcha API'larni yoz" | Kichik task'larga bo'lish |
| Dependency hal qilinmagan — oldingi task tugamagan | Oldingi task'ni kutish |
| Hujjat yo'q — entity domain model'da yo'q | Avval hujjat yozish |
| Ikki agent bir xil fayl'da ishlashi kerak | Task'larni ajratish yoki ketma-ket rejalashtirish |

### Agent escalation qoidasi

`agent-operating-model.md` L63-77 asosida:

> Agar task Not Ready mezonlaridan biriga mos kelsa — agent ish boshlamaydi va operator'ga **escalate qiladi**.

---

## Ready checklist (amalda)

Task yaratishda quyidagi shablon ishlatiladi:

```markdown
## Task: [Sarlavha]

### Problem
[Nima muammo yoki nima quriladi]

### Scope
- ✅ Qilinadi: [...]
- ❌ Qilinmaydi: [...]

### Dependencies
- [ ] [Dependency 1]
- [ ] [Dependency 2]

### Expected Output
- [ ] [Natija 1 — masalan: POST /api/v1/orgs endpoint ishlaydi]
- [ ] [Natija 2 — masalan: Unit test'lar yozilgan]

### Owner
- Agent: [ID] yoki Inson: [Ism]
```

---

## Versiya

- v1.0
- Status: **APPROVED**
- Keyingi ko'rib chiqish: Phase 1 Sprint 1 boshlanishida
