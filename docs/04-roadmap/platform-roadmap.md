# Platform Roadmap

## Maqsad

Ushbu hujjat platformaning qurish ketma-ketligini belgilaydi. Har bir fazaning aniq deliverable'lari, exit criteria'si va bog'liqlik zanjirlari mavjud.

Roadmap arxitektura qarorlariga asoslanadi — u arxitekturani boshqarmaydi.

---

## Fazalar

### Phase 0 — Foundation (Hozir)

**Maqsad:** Hamma narsa aniq yozilsin. Hech qanday noto'g'ri tushuncha qolmasin.

**Deliverable'lar:**
- [x] Vision va scope hujjatlari
- [x] Domain model
- [x] Bounded contexts
- [x] System context
- [x] Final technology stack qarorlari
- [x] ADR-001, ADR-002, ADR-003
- [ ] Product map
- [ ] Repo governance (agent qoidalari)
- [ ] Status board — faol holat kuzatuvi

**Exit criteria:**
- Yangi kishi (yoki agent) loyihaga kirib, 30 daqiqada nima qurilayotganini tushunishi mumkin
- Hech qanday TODO'siz asosiy hujjatlar to'liq
- Implementation boshlashga to'sqinlik qiladigan ochiq savol yo'q

---

### Phase 1 — Core Platform (Keyingi)

**Maqsad:** Ishlaydigan backend skeleton — auth, org, project, agent session.

**Deliverable'lar:**

**1a. Repo tuzilmasi va tooling**
- Go monorepo tuzilmasi (`/apps/api`, `/pkg/identity`, `/pkg/org`, `/pkg/project`, `/pkg/orchestration`)
- Next.js app (`/apps/web`)
- Tauri app (`/apps/desktop`)
- Shared TypeScript types (`/packages/types`)
- Docker Compose (local dev: PostgreSQL, Redis)
- CI pipeline (lint, typecheck, test)
- `.env` strategy va secrets model

**1b. Identity Context**
- User registration va login (email/password)
- JWT / secure session token
- API token yaratish va revoke qilish
- GitHub OAuth (v1 uchun primary)

**1c. Organization Context**
- Organization CRUD
- Member invite va role assignment
- Department va Team CRUD
- AgentDefinition registry (global va org-private)
- AgentSlot konfiguratsiyasi

**1d. Project Context**
- Project CRUD (GitHub repo bog'lanishi bilan)
- Task sync (GitHub Issues, manual)
- Workflow definition (stage'lar bilan)
- Team assignment

**Exit criteria:**
- `POST /orgs`, `POST /projects`, `POST /teams` ishlaydi
- GitHub OAuth orqali login ishlaydi
- Local dev environment `docker compose up` bilan 1 daqiqada ko'tariladi
- Har bir paket uchun unit test coverage ≥ 70%

---

### Phase 2 — Orchestration Core

**Maqsad:** Agent session'larini spawn qilish, kuzatish, va boshqarish.

**Deliverable'lar:**

**2a. Runtime Adapter (tmux)**
- Session spawn: `ao spawn` ekvivalenti API orqali
- Session status polling
- Message send (agent'ga ko'rsatma)
- Session kill va restore
- Terminal stream (WebSocket)

**2b. SCM Adapter (GitHub)**
- Branch yaratish
- PR ochish va kuzatish
- CI status olish
- PR comment kuzatish (webhook)

**2c. Orchestration API**
- `POST /sessions/spawn`
- `GET /sessions` (filter: project, status, attention)
- `POST /sessions/:id/send`
- `DELETE /sessions/:id` (kill)
- `GET /sessions/:id/events` (SSE)
- `GET /sessions/:id/terminal` (WebSocket)

**2d. Session Lifecycle Engine**
- Status machine: spawning → working → needs_response → ready_to_merge → done
- Attention level kalkulyatsiyasi
- Auto-detect: CI failed, comment keldi, agent input kutmoqda
- Reaction rules (trigger qoidalari)

**2e. Realtime Gateway**
- WebSocket server (Go)
- SSE fallback
- Event fan-out (session event → connected clients)
- Connection health monitoring

**Exit criteria:**
- Bitta agent spawn qilib, uning terminal output'ini web'da real-time ko'rish mumkin
- PR yaratilganda dashboard'da ko'rinadi
- CI natijasi kelganda session status avtomatik yangilanadi
- 50 parallel session'da sistem barqaror ishlaydi

---

### Phase 3 — Operator Dashboard (Web)

**Maqsad:** Operatorlar uchun to'liq ishlatiladigan web surface.

**Deliverable'lar:**

**3a. Dashboard**
- Attention zone'lar (critical, needs_action, monitoring, done)
- Session card: status, PR holati, CI holati, attention badge
- Batch action: merge all ready, kill all idle
- Real-time yangilanish (WebSocket/SSE)

**3b. Session Detail**
- Terminal (xterm.js + WebSocket)
- PR card (CI checks, unresolved comments, merge readiness)
- Session event timeline
- "Send message" input

**3c. Project View**
- Aktiv session'lar
- Workflow stage progress
- Task backlog va status

**3d. Org/Team Settings**
- Member management
- AgentSlot konfiguratsiyasi
- Notification routing

**Exit criteria:**
- Operator barcha aktiv session'larni bitta sahifada ko'ra oladi
- PR merge bitta click bilan amalga oshiriladi
- Agent'ga message yuborish 2 soniyada yetib boradi
- Mobile'da (responsive) asosiy monitoring ishlaydi

---

### Phase 4 — Desktop Shell

**Maqsad:** Local runtime quvvati bilan to'liq desktop experience.

**Deliverable'lar:**
- Tauri app — web UI bilan birlashgan
- Local tmux runtime management (internet'siz)
- Desktop notification (OS-native)
- Shell capability detection
- Secure local credential storage
- Workspace-native file access

---

### Phase 5 — Scale va Hardening

**Maqsad:** Production'ga tayyor qilish.

**Deliverable'lar:**
- Auth: SSO (SAML/OIDC) enterprise uchun
- Observability: OpenTelemetry, Prometheus, Grafana, Sentry
- Rate limiting va abuse protection
- Audit log UI
- Backup va disaster recovery
- Multi-region tayyor arxitektura (Kubernetes)
- Security audit

---

## Bog'liqlik zanjiri

```
Phase 0 (Docs) 
  → Phase 1a (Repo + tooling)
    → Phase 1b (Identity)
      → Phase 1c (Org)
        → Phase 1d (Project)
          → Phase 2a (Runtime)
          → Phase 2b (SCM)
            → Phase 2c+2d (Orchestration API + Lifecycle)
              → Phase 2e (Realtime)
                → Phase 3 (Dashboard)
                  → Phase 4 (Desktop) [parallel bo'lishi mumkin]
                    → Phase 5 (Scale)
```

---

## Risklar

**Risk 1: Domain model noto'g'ri bo'lsa**
Bounded context'lar katta o'zgarishga uchraydi. Mitigation: Phase 0 chiqish mezoni qat'iy.

**Risk 2: tmux runtime platform-specific muammo chiqarsa**
Process runtime fallback bor, lekin UX farq qiladi. Mitigation: Docker adapter Phase 1'da parallel boshlanishi mumkin.

**Risk 3: GitHub API rate limit**
Ko'p parallel session'da CI polling cheklangan. Mitigation: Webhook-first, poll-fallback arxitektura.

**Risk 4: Agent context drift**
Agent'lar hujjat'ga mos ishlamasligi. Mitigation: Har bir agent uchun worklog va clear task scope.

---

## Versiya

- v1.0
- Status: **APPROVED**
- Keyingi ko'rib chiqish: Phase 1 tugagandan keyin
