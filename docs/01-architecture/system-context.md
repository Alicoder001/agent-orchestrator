# System Context

## Maqsad

Ushbu hujjat platformaning tashqi dunyo bilan chegarasini belgilaydi. Kim platforma bilan gaplashadi, platforma kim bilan gaplashadi, va qayerda ishonch chegaralari o'tadi.

---

## Platforma nima

Platforma — AI-native digital tashkilotlar uchun operatsion tizim. U AI agent'larni, inson operatorlarni, va tashqi vositalarni bitta boshqariladigan muhitga birlashtiradi.

---

## Aktorlar

### Inson aktorlar

**Operator**
- Kim: texnik foydalanuvchi, platforma'ni kundalik boshqaradi
- Nima qiladi: session spawn, monitoring, agent'ga message yuborish, PR merge, bloker hal qilish
- Kirish kanali: Web dashboard, Desktop app, CLI

**Admin**
- Kim: organization'ni sozlaydigan kishi (team leader, CTO, founder)
- Nima qiladi: team va agent konfiguratsiyasi, member management, policy belgilash
- Kirish kanali: Web dashboard

**Owner**
- Kim: organization'ni yaratgan va billing'ga mas'ul kishi
- Nima qiladi: billing, plan, organization lifecycle
- Kirish kanali: Web dashboard

**Viewer**
- Kim: monitoring yoki ko'rib turuvchi kishi (PM, stakeholder)
- Nima qiladi: faqat kuzatish — session holati, workflow progress
- Kirish kanali: Web dashboard, Mobile

### Tizim aktorlar

**AI Agent**
- Kim: platform tomonidan spawn qilingan va boshqariladigan AI worker
- Nima qiladi: task bajaradi, kod yozadi, PR yaratadi, CI natijalariga munosabat bildiradi
- Kirish kanali: Runtime orqali (tmux/process) — to'g'ridan API chaqirmaydi

**CI/CD Tizim**
- Kim: GitHub Actions, GitLab CI yoki boshqa CI pipeline
- Nima qiladi: test natijalarini qaytaradi, deploy statusini bildiradi
- Kirish kanali: SCM adapter orqali (webhook/poll)

---

## Tashqi tizimlar

### SCM — Source Code Management

**GitHub (v1 primary)**
- Session uchun branch yaratish
- PR ochish va boshqarish
- CI natijalarini olish
- PR comment'larini kuzatish
- Webhook orqali real-time event qabul qilish

**GitLab (v2)**
- Xuddi GitHub kabi, keyinroq adapter sifatida

**Integratsiya turi:** OAuth token + REST API + Webhook

---

### Issue Tracker

**GitHub Issues (v1)**
- Task'larni olish va sinxronlashtirish
- Issue status'ini yangilash
- Label va milestone boshqarish

**Linear (v1)**
- Issue olish
- Status update yuborish
- Cycle/project sinxronizatsiya

**Integratsiya turi:** API token + REST/GraphQL API

---

### Runtime Environment

**tmux (v1 primary)**
- Agent process'larini izolyatsiya qilish
- Session restart'dan keyin tiklash
- Terminal stream'ini olish

**process (v1 fallback)**
- Oddiy OS process sifatida agent ishga tushirish
- tmux mavjud bo'lmagan muhit uchun

**Docker (v2)**
- Container'lashtirilgan agent execution
- Kuchli izolyatsiya kerak bo'lganda

**Integratsiya turi:** Local OS system call, Shell command

---

### AI Provider

**Anthropic (Claude Code)**
- Agent uchun LLM backbone
- API token orqali autentifikatsiya

**OpenAI (Codex CLI)**
- Muqobil agent provider

**Google (Gemini CLI)**
- Muqobil agent provider

**z.ai / GLM**
- Open-source muqobil, Xitoy bozori uchun muhim

**Ollama / LM Studio**
- Local inference — internet yo'q muhit, privacy-sensitive

**Integratsiya turi:** Agent CLI binary orqali (platforma to'g'ridan API chaqirmaydi — agent o'zi chaqiradi)

---

### Notification Channel

**Slack**
- Session holat o'zgarishi
- Critical event'lar
- Operator'ga xabar

**Email**
- Kamroq critical, digest yoki invite

**Desktop notification**
- OS-native notification (Tauri desktop)

**Webhook**
- Custom integratsiya uchun

**Integratsiya turi:** Push (API/WebHook)

---

## Trust chegaralari

### Platforma ichida ishonch

```
HIGH TRUST  →  Platform Backend (Go)
                ↓
MEDIUM TRUST → Desktop App (Tauri) — local, authenticated
MEDIUM TRUST → Web App (Next.js) — authenticated session
LOW TRUST    → CLI — authenticated, headless
LOW TRUST    → VS Code Extension — editor context, limited scope
UNTRUSTED    → Webhook incoming — always verified (HMAC signature)
UNTRUSTED    → AI Agent output — never directly executed, always mediated
```

### Asosiy qoidalar

- AI Agent output to'g'ridan OS'ga yetib bormaydi — runtime adapter orqali o'tadi
- Webhook'lar HMAC signature tekshiruvisiz qabul qilinmaydi
- API token'lar scope'li — bitta token barcha huquqga ega bo'lmaydi
- Desktop app local runtime'ga ega, lekin global backend'ga ham ulanadi — ikki yo'nalishli trust model

---

## Tashqi tizim bog'liqliklari (v1 uchun majburiy)

| Tizim | Majburiy | Izohi |
|-------|----------|-------|
| GitHub | Ha (SCM uchun) | Linear alternativ tracker bo'lishi mumkin |
| tmux | Ha (default runtime) | Docker v2'da |
| Kamida 1 AI provider | Ha | Local yoki remote |
| PostgreSQL | Ha | Asosiy ma'lumotlar bazasi |
| Redis | Ha | Session coordination va realtime |

---

## Versiya

- v1.0
- Status: **APPROVED**
- Keyingi ko'rib chiqish: ADR'lar yozilgandan keyin
