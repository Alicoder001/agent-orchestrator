# Implementation Sequencing

## Maqsad

Ushbu hujjat Phase 1 ning aniq sprint bo'linmasini, dependency graphini va early risk'larini belgilaydi.

Bu hujjat `platform-roadmap.md` Phase 1 deliverable'lariga asoslanadi va ularni bajariladigan sprint'larga bo'ladi.

---

## Order of Work

### Sprint 1 — Foundation + Tooling (Hafta 1-2)

**Maqsad:** Repo tuzilmasi ishlaydi, local dev environment ko'tariladi.

| # | Deliverable | Priority |
|---|------------|----------|
| 1 | Go monorepo scaffold (`/apps/api` + `cmd/server/main.go`) | P0 |
| 2 | Next.js app scaffold (`/apps/web`) | P0 |
| 3 | Docker Compose (`PostgreSQL + Redis`) | P0 |
| 4 | Makefile (build, test, lint, migrate) | P0 |
| 5 | CI pipeline (GitHub Actions: lint, test, typecheck) | P1 |
| 6 | `.env.example` + config loader | P1 |
| 7 | golang-migrate setup + initial migration runner | P1 |
| 8 | OpenAPI spec initial file + type generation | P2 |

**Exit criteria:**
- `docker compose up` bilan 1 daqiqada local environment ko'tariladi
- `make build` Go binary yaratadi
- `make test` ishlaydi (hali bo'sh test'lar bilan)
- CI pipeline GitHub'da yashil ko'rinadi

---

### Sprint 2 — Identity Context (Hafta 3-4)

**Maqsad:** Foydalanuvchi ro'yxatdan o'ta oladi, login qila oladi, token oladi.

| # | Deliverable | Priority |
|---|------------|----------|
| 1 | `identity` schema migration (users, session_tokens, oauth_connections, api_tokens) | P0 |
| 2 | User registration endpoint (`POST /api/v1/auth/register`) | P0 |
| 3 | User login endpoint (`POST /api/v1/auth/login`) | P0 |
| 4 | JWT issuance + RS256 signing | P0 |
| 5 | Refresh token flow (`POST /api/v1/auth/refresh`) | P0 |
| 6 | Auth middleware (JWT validation) | P0 |
| 7 | RBAC middleware (role-based permission check) | P1 |
| 8 | GitHub OAuth flow | P1 |
| 9 | API token CRUD (`POST/GET/DELETE /api/v1/tokens`) | P1 |

**Exit criteria:**
- `POST /auth/register` + `POST /auth/login` ishlaydi
- JWT token qaytariladi va middleware orqali validatsiya bo'ladi
- GitHub OAuth orqali login ishlaydi (callback dahil)
- Unit test coverage ≥ 70%

---

### Sprint 3 — Organization Context (Hafta 5-6)

**Maqsad:** Organization, team va department tuzilmasi ishlaydi.

| # | Deliverable | Priority |
|---|------------|----------|
| 1 | `organization` schema migration (organizations, departments, teams, memberships, agent_definitions, agent_slots) | P0 |
| 2 | Organization CRUD (`POST/GET/PUT /api/v1/orgs`) | P0 |
| 3 | Personal org auto-creation (signup vaqtida) | P0 |
| 4 | Member invite va role assignment | P0 |
| 5 | Department CRUD (`POST/GET/PUT/DELETE /api/v1/orgs/:id/departments`) | P1 |
| 6 | Team CRUD (`POST/GET/PUT/DELETE /api/v1/orgs/:id/teams`) | P1 |
| 7 | AgentDefinition registry (CRUD) | P1 |
| 8 | AgentSlot configuration | P2 |

**Exit criteria:**
- `POST /orgs` bilan organization yaratish ishlaydi
- Member invite va role assignment ishlaydi
- Department → Team hierarxiyasi to'g'ri ishlaydi
- AgentSlot team'ga bog'lanadi

---

### Sprint 4 — Project Context (Hafta 7-8)

**Maqsad:** Project, workflow va task tuzilmasi ishlaydi. To'liq org → project → task flow.

| # | Deliverable | Priority |
|---|------------|----------|
| 1 | `project` schema migration (projects, workflows, workflow_stages, tasks, team_assignments) | P0 |
| 2 | Project CRUD (`POST/GET/PUT /api/v1/orgs/:id/projects`) | P0 |
| 3 | GitHub repo bog'lash (project yaratishda) | P1 |
| 4 | Task CRUD — platform native (`POST/GET/PUT /api/v1/projects/:id/tasks`) | P0 |
| 5 | Workflow definition (stage'lar bilan) | P1 |
| 6 | Team assignment (qaysi team qaysi projectda) | P1 |
| 7 | GitHub Issues optional sync | P2 |

**Exit criteria:**
- Project yaratish + GitHub repo bog'lash ishlaydi
- Task yaratish va status o'zgartirish ishlaydi
- Team'lar project'ga assign bo'ladi
- To'liq flow: Register → Create Org → Create Team → Create Project → Create Task

---

## Dependency Graph

```
Sprint 1 (Foundation)
    │
    ▼
Sprint 2 (Identity)
    │
    ▼
Sprint 3 (Organization)  ← Identity: user validation, RBAC kerak
    │
    ▼
Sprint 4 (Project)        ← Organization: team, agent_slot kerak
```

Barcha sprint'lar **ketma-ket** — parallel boshlanmaydi.

**Istisno:** Frontend scaffold (Next.js) Sprint 1 bilan parallel boshlanishi mumkin — backend API'lar tayyor bo'lgunga qadar mock data bilan ishlaydi.

---

## Early Risks

| # | Risk | Ehtimol | Mitigation |
|---|------|---------|------------|
| 1 | Go + Chi onboarding uchun kutilganidan ko'p vaqt ketishi | MEDIUM | Sprint 1 da 2-3 kun Go bootstrap uchun buffer qo'yilgan |
| 2 | GitHub OAuth callback flow murakkabligi | MEDIUM | Sprint 2 da P1 qilib qo'yilgan — core auth (email/password) P0 |
| 3 | golang-migrate bilan multi-schema migration | LOW | Har schema alohida migration papka — standard pattern |
| 4 | JWT RS256 key management complexity | LOW | Development'da file-based key, production'da env variable |
| 5 | OpenAPI → TypeScript type generation pipeline | LOW | Sprint 1 da P2 — tayyor bo'lsa yaxshi, keyin ham qo'shsa bo'ladi |

---

## Parallelizable Streams

| Stream | Sprint | Parallel mumkin? |
|--------|--------|-----------------|
| Frontend (Next.js) scaffold | Sprint 1 bilan parallel | ✅ |
| Design system tokens | Sprint 1-2 bilan parallel | ✅ |
| Desktop (Tauri) | Phase 4 ga defer | ❌ |
| Mobile | Phase 3+ ga defer | ❌ |
| VS Code Extension | Phase 3+ ga defer | ❌ |

---

## Versiya

- v1.0
- Status: **APPROVED**
- Keyingi ko'rib chiqish: Sprint 1 tugagandan keyin
