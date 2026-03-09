# Domain Model

## Maqsad

Ushbu hujjat platformaning asosiy entity'larini, ularning ta'riflarini, munosabatlarini va lifecycle'larini belgilaydi.

Bu hujjat barcha arxitektura, bounded context, va implementation qarorlarining asosi hisoblanadi. Koddan oldin keladi. Agar kod bu hujjatga zid bo'lsa — kod noto'g'ri.

---

## Asosiy prinsip

Platforma uchta asosiy tushunchaga qurilgan:

- **Tashkilot** — kimlar ishlaydi
- **Ish maydoni** — qayerda ishlaydi
- **Ijro** — qanday ishlaydi

Har bir entity shu uchta kategoriyadan biriga tegishli.

---

## Entity'lar

### 1. Organization

**Ta'rif:** Platformadagi eng yuqori darajadagi identifikatsiya birligi. Kompaniya, startup, yoki mustaqil foydalanuvchi workspace'i bo'lishi mumkin.

**Xususiyatlar:**
- Unikal identifikator va slug (masalan: `acme`, `personal-john`)
- Turi: `company` | `personal`
- Plan darajasi: `free` | `pro` | `enterprise`
- Yaratilgan sana, owner, billing holati

**Qoidalar:**
- Har bir foydalanuvchi kamida bitta organization'ga tegishli
- Personal organization avtomatik yaratiladi (signup vaqtida)
- Company organization invite yoki SSO orqali qo'shiladi
- Organization o'chirilsa, uning barcha ma'lumotlari soft-delete qilinadi

**Munosabatlar:**
- Organization → ko'p Department
- Organization → ko'p Team
- Organization → ko'p Project
- Organization → ko'p Member (User)
- Organization → ko'p AgentDefinition

---

### 2. Department

**Ta'rif:** Organization ichidagi funksional bo'lim. Qanday turdagi ish bajarilishini belgilaydi.

**Turlari (qat'iy ro'yxat, v1 uchun):**
- `engineering` — kod yozish, build, deploy
- `design` — UI/UX, asset, prototip
- `research` — tahlil, ma'lumot yig'ish, hisobot
- `qa` — test, sifat nazorati
- `operations` — deploy, infra, monitoring
- `planning` — roadmap, backlog, sprint

**Qoidalar:**
- Department organization darajasida mavjud, project darajasida emas
- Har bir Team bitta Department'ga tegishli
- Department o'zi task bajarmaydi — u Team'larni guruhlaydi

**Munosabatlar:**
- Department → ko'p Team
- Department → Organization (parent)

---

### 3. Team

**Ta'rif:** Birgalikda ish bajaradigan Agent va Member'lar guruhi. Department ichida joylashadi.

**Xususiyatlar:**
- Ism, slug, department
- Capacity: nechta parallel session ko'tara olishi
- Default agent configuration

**Qoidalar:**
- Team kamida bitta Agent yoki Member'ga ega bo'lishi kerak
- Team bir nechta Project'da ishlashi mumkin
- Team o'z default prompt va tool set'iga ega bo'lishi mumkin

**Munosabatlar:**
- Team → Department (parent)
- Team → ko'p AgentSlot
- Team → ko'p Member
- Team → ko'p ProjectAssignment

---

### 4. Member

**Ta'rif:** Platformaga kirgan inson foydalanuvchi.

**Rollar (organization darajasida):**
- `owner` — to'liq nazorat, billing, organization o'chirish
- `admin` — member boshqarish, project va team yaratish
- `operator` — agent'larni boshqarish, session ko'rish va boshqarish
- `viewer` — faqat ko'rish

**Qoidalar:**
- Member bir nechta Organization'ga tegishli bo'lishi mumkin
- Har bir Organization'da faqat bitta roli bo'ladi
- Member shu bilan birga Agent'ni ham nazorat qilishi mumkin (operator sifatida)

**Munosabatlar:**
- Member → ko'p Organization (orqali Membership)
- Member → ko'p Session (yaratgan, nazorat qilgan)
- Member → ko'p ApprovalAction

---

### 5. Project

**Ta'rif:** Aniq maqsadga yo'naltirilgan ish maydoni. Workflow, task'lar, va agent session'lar shu yerda yashaydi.

**Xususiyatlar:**
- Ism, slug, tavsif
- Repository bog'lanishi (GitHub repo yoki local path)
- Default branch
- Status: `active` | `paused` | `archived`
- Tracker bog'lanishi (GitHub Issues, Linear)

**Lifecycle:**
```
draft → active → paused → archived
```

**Qoidalar:**
- Project Organization'ga tegishli
- Bir nechta Team bitta Project'da ishlashi mumkin
- Project o'chirilmaydi — arxivlanadi (audit log saqlanadi)
- Project'ning o'z agent qoidalari bo'lishi mumkin (organization qoidalarini override qiladi)

**Munosabatlar:**
- Project → Organization (parent)
- Project → ko'p Session
- Project → ko'p Workflow
- Project → ko'p TeamAssignment

---

### 6. AgentDefinition

**Ta'rif:** Platformada mavjud agent turi. Konkret session emas — blueprint.

**Turlari (v1 uchun qo'llab-quvvatlanadigan):**
- `claude-code` — Anthropic Claude Code
- `codex` — OpenAI Codex CLI
- `gemini-cli` — Google Gemini CLI
- `aider` — aider.chat
- `zai` — z.ai/GLM
- `local-custom` — foydalanuvchi o'zi sozlagan local agent

**Xususiyatlar:**
- Tur, versiya, provider
- Qo'llab-quvvatlanadigan capability'lar: `code`, `research`, `design`, `review`, `test`
- Runtime talablari: qaysi runtime'da ishlaydi
- Default prompt configuration

**Qoidalar:**
- AgentDefinition global (platform darajasida) yoki organization-private bo'lishi mumkin
- Versiyalar alohida saqlanadi — rollback mumkin
- Capability to'plami runtime bilan mos kelishi kerak

---

### 7. AgentSlot

**Ta'rif:** Team ichida bitta agent o'rni. AgentDefinition'ni konkret Team kontekstiga bog'laydi.

**Xususiyatlar:**
- Qaysi AgentDefinition
- Qaysi Team
- Custom name (masalan: "Frontend Engineer 1")
- Prompt override (team-level)
- Max parallel session soni

**Qoidalar:**
- AgentSlot — konkret session emas, u "bu team'da shu turdagi agent ishlaydi" degan deklaratsiya
- Bir xil AgentDefinition'dan bir nechta AgentSlot bo'lishi mumkin
- AgentSlot o'chirilsa, unga bog'liq session'lar arxivlanadi

---

### 8. Session

**Ta'rif:** Bitta agent'ning bitta task ustida ishlashining to'liq hayot tsikli.

**Bu platformaning eng muhim runtime entity'si.**

**Xususiyatlar:**
- Unikal ID (masalan: `eng-frontend-001`)
- Qaysi AgentSlot, Project, Task/Issue bog'lanishi
- Branch nomi (agar SCM bilan bog'liq bo'lsa)
- Workspace yo'li
- Runtime (masalan: `tmux`, `process`)
- Status (quyida)
- Yaratilgan vaqt, oxirgi faollik vaqti
- PR/CR havolasi (yaratilgandan keyin)

**Session status lifecycle:**
```
spawning
  → working
  → waiting_for_input
  → needs_response     (CI failing yoki comment keldi)
  → review_requested
  → ready_to_merge
  → merging
  → done
  → failed
  → killed
```

**Attention darajalari (operator uchun):**
- `critical` — darhol e'tibor kerak (CI failed, error, blocked)
- `needs_action` — qaror yoki input kerak
- `monitoring` — ishlayapti, hamma narsa yaxshi
- `done` — tugallangan, arxivlanishi mumkin

**Qoidalar:**
- Session o'chirilmaydi — status `killed` yoki `done` ga o'tadi
- Session metadata disk'da saqlanadi (platforma restart'dan keyin ham qayta tiklanadi)
- Bitta Task uchun bir vaqtda faqat bitta aktiv session bo'lishi kerak
- Session o'z runtime'iga ega — platforma crash qilsa ham session davom etishi mumkin (tmux)

**Munosabatlar:**
- Session → AgentSlot
- Session → Project
- Session → Task (ixtiyoriy)
- Session → ko'p SessionEvent
- Session → ko'p TerminalChunk (stream)

---

### 9. Task

**Ta'rif:** Bajariladigan ish birligi. Tracker'dan (GitHub Issues, Linear) kelishi yoki to'g'ridan platformada yaratilishi mumkin.

**Xususiyatlar:**
- Sarlavha, tavsif
- Manba: `github_issue` | `linear_issue` | `platform_native`
- Tashqi ID (agar tracker'dan kelsa)
- Priority, label'lar
- Status (tracker'dan sinxronlashadi)
- Acceptance criteria (ixtiyoriy)

**Qoidalar:**
- Task — Session'dan mustaqil entity. Session tugatilsa ham Task qoladi
- Bitta Task bir nechta Session tomonidan urinilishi mumkin (retry scenario)
- Platform native task'lar ham to'liq qo'llab-quvvatlanadi (tracker talab etilmaydi)

---

### 10. Workflow

**Ta'rif:** Bir nechta Stage va Task'larni tartibga soluvchi execution model.

**Standart stage'lar (v1):**
```
research → design → build → test → deploy
```

**Xususiyatlar:**
- Ism, tavsif
- Stage'lar ro'yxati (tartibli)
- Har bir stage uchun: responsible Department, qabul mezonlari, auto-advance qoidasi
- Trigger qoidalari (qachon boshlanadi)

**Qoidalar:**
- Workflow Project darajasida aniqlanadi
- Stage'lar parallel yoki ketma-ket ishlashi mumkin
- Har bir stage'ning "done" mezoni aniq bo'lishi kerak
- Workflow engine session'larni avtomatik yaratishi va o'tkazishi mumkin

---

### 11. SessionEvent

**Ta'rif:** Session hayoti davomida sodir bo'lgan har bir muhim voqea.

**Event turlari:**
- `status_changed` — session holati o'zgardi
- `pr_created` — PR yaratildi
- `ci_updated` — CI natijasi yangilandi
- `comment_received` — PR'ga comment keldi
- `human_sent_message` — operator message yubordi
- `agent_requested_input` — agent javob so'radi
- `merged` — PR merge qilindi
- `error_occurred` — xato yuz berdi

**Qoidalar:**
- Event'lar immutable — o'chirilmaydi, o'zgartirilmaydi
- Audit log sifatida ishlatiladi
- Realtime transport orqali frontend'ga uzatiladi

---

## Entity munosabatlari xaritasi

```
Organization
├── Department (1..n)
│   └── Team (1..n)
│       ├── AgentSlot (1..n) → AgentDefinition
│       └── Member (0..n)
├── Project (1..n)
│   ├── Workflow (0..n)
│   └── Session (0..n)
│       ├── AgentSlot (ref)
│       ├── Task (0..1)
│       └── SessionEvent (0..n)
└── Member (1..n)
```

---

## Nima bu domain model EMAS

- Bu database schema emas — implementation detail keyinroq
- Bu API contract emas — transport layer keyinroq
- Bu UI model emas — presentation layer keyinroq

Bu **tushunchalar tili** — platforma haqida gapirganda ishlatadigan so'zlar va ularning ma'nosi.

---

## Versiya

- v1.0 — dastlabki domain model
- Status: **APPROVED**
- Keyingi ko'rib chiqish: Bounded Contexts hujjati yozilgandan keyin
