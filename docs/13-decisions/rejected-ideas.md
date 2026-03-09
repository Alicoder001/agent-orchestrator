# Rejected Ideas

## Maqsad

Ushbu hujjat loyiha davomida ko'rib chiqilgan, lekin rad etilgan g'oyalar va yondashuvlarni qayd etadi — kelajakda qayta ko'rib chiqish uchun.

Bu hujjat ADR'lar (alternatives considered), `open-questions.md` va `assumptions-register.md` ga bog'liq.

---

## Rad etilgan g'oyalar

### RI-001: Microservices From Day One

| Field | Qiymat |
|-------|--------|
| **G'oya** | Har bir bounded context alohida microservice sifatida |
| **Taklif qiluvchi** | Architecture brainstorm |
| **Rad sababi** | Over-engineering — V1 uchun 1-2 developer, microservice infra maintain qilish ortiqcha |
| **ADR ref** | ADR-003: Modular Monolith |
| **Qayta ko'rish** | Phase 3+ da extraction kerak bo'lganda |

### RI-002: Electron Instead of Tauri

| Field | Qiymat |
|-------|--------|
| **G'oya** | Desktop app uchun Electron (Chromium + Node.js) |
| **Rad sababi** | 200MB+ binary size, yuqori memory usage, Tauri 10x hafifroq |
| **ADR ref** | ADR-002: Desktop Tauri |
| **Qayta ko'rish** | Yo'q — Tauri qaror final |

### RI-003: Redux Instead of Zustand

| Field | Qiymat |
|-------|--------|
| **G'oya** | Frontend state management uchun Redux Toolkit |
| **Rad sababi** | Boilerplate ko'p, loyiha hajmi uchun overkill, Zustand 10x soddaroq |
| **ADR ref** | ADR-005: Frontend State Management |
| **Qayta ko'rish** | Yo'q — Zustand + TanStack Query qaror final |

### RI-004: GraphQL API

| Field | Qiymat |
|-------|--------|
| **G'oya** | REST o'rniga GraphQL API |
| **Rad sababi** | V1 entity'lar soni kam, REST yetarli, GraphQL learning curve, Go'da GraphQL tooling past |
| **Qayta ko'rish** | Phase 3+ — agar frontend data fetching murakkablashsa |

### RI-005: Firebase / Supabase BaaS

| Field | Qiymat |
|-------|--------|
| **G'oya** | Backend yozmasdan BaaS ishlatish |
| **Rad sababi** | Platform = core business logic, BaaS'da custom orchestration qilish qiyin, vendor lock-in |
| **Qayta ko'rish** | Yo'q — self-hosted core business requirement |

### RI-006: Docker-First Runtime (V1)

| Field | Qiymat |
|-------|--------|
| **G'oya** | V1 dan Docker container'da agent run qilish |
| **Rad sababi** | Development setup murakkablashadi, tmux soddaroq va tezroq, Docker V2'da qo'shiladi |
| **Qayta ko'rish** | V2 — container runtime adapter sifatida |

### RI-007: Real-time Database (RethinkDB, Supabase Realtime)

| Field | Qiymat |
|-------|--------|
| **G'oya** | Real-time ma'lumot uchun alohida database |
| **Rad sababi** | PostgreSQL + SSE yetarli, qo'shimcha database — operational complexity |
| **Qayta ko'rish** | Phase 3+ — agar real-time requirements sezilarli o'ssa |

### RI-008: Mono-repo (API + Frontend + Desktop)

| Field | Qiymat |
|-------|--------|
| **G'oya** | Barcha kod bitta mono-repo'da |
| **Rad sababi** | Hozircha alohida repo — CI/CD sodda, contribute oson, dependency isolation aniq |
| **Qayta ko'rish** | Phase 2 — agar shared library'lar ko'paysa Turborepo/Nx bilan |

---

## Versiya

- v1.0
- Status: **APPROVED**
