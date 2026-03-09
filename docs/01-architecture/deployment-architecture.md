# Deployment Architecture

## Maqsad

Ushbu hujjat platformaning deploy muhitlari, deployable unitlari, infratuzilma taxminlari va release topologiyasini belgilaydi.

Bu hujjat `application-architecture.md` (modular monolith), `final-technology-stack.md` (stack qarorlari), `configuration-strategy.md` (config management) va `implementation-sequencing.md` (sprint plan) ga asoslanadi.

---

## Muhitlar (Environments)

### V1 Muhitlar

| Muhit | Maqsad | Infra | Deploy usuli |
|-------|--------|-------|-------------|
| **Local** | Developer/agent kundalik ishi | Docker Compose | `docker compose up` |
| **CI** | Avtomatik test va lint | GitHub Actions runner | Har PR da |
| **Staging** | Integration test, demo | VPS yoki Vercel+Container | Manual trigger yoki main merge |
| **Production** | Foydalanuvchilar uchun | VPS / Cloud Run / Fly.io | Tag-based deploy |

### Local development muhiti

```
docker compose up
  ├── PostgreSQL 16          → localhost:5432
  ├── Redis 7                → localhost:6379
  ├── Go API Server          → localhost:8080  (hot-reload: air)
  └── Next.js Dev Server     → localhost:3000  (next dev)
```

**Exit criteria (`implementation-sequencing.md` Sprint 1):**
> `docker compose up` bilan 1 daqiqada local environment ko'tariladi

### docker-compose.yml tuzilishi

```yaml
version: "3.8"

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: agent_orchestrator
      POSTGRES_USER: ao_user
      POSTGRES_PASSWORD: ao_local_pass
    ports:
      - "5432:5432"
    volumes:
      - pg_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
    ports:
      - "8080:8080"
    env_file:
      - .env
    depends_on:
      - postgres
      - redis

volumes:
  pg_data:
```

---

## Deployable Units

### V1 — Modular Monolith

`ADR-003` asosida platforma **bitta deploy unit** sifatida ishlaydi:

| Unit | Texnologiya | Artifact | Deploy target |
|------|-------------|----------|---------------|
| **API Server** | Go binary | Single binary (~15MB) | Container / VPS |
| **Web App** | Next.js | Static + SSR | Vercel / Container |
| **Desktop App** | Tauri | Platform-specific installer | Release download (Phase 4) |

### Go binary build

```dockerfile
# apps/api/Dockerfile
FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /server ./apps/api/cmd/server

FROM alpine:3.19
RUN apk add --no-cache ca-certificates tzdata
COPY --from=builder /server /server
EXPOSE 8080
CMD ["/server"]
```

**Natija:** ~15MB binary, runtime dependency yo'q, startup < 1s.

### Next.js deploy

| Deploy target | Usul | Afzalligi |
|--------------|------|-----------|
| **Vercel** (tavsiya V1) | Git push → auto deploy | Zero-config, edge functions |
| **Container** | Docker build → push | Self-hosted control |
| **Static export** | `next build && next export` | CDN-based, lekin SSR yo'q |

---

## Infrastructure Taxminlari

### V1 minimal infra

```
┌─────────────────────────────────────────┐
│                Internet                  │
└─────────┬───────────────────┬───────────┘
          │                   │
    ┌─────┴─────┐      ┌─────┴─────┐
    │  Vercel   │      │  VPS /    │
    │  (Web)    │      │  Cloud    │
    │  Next.js  │      │  (API)    │
    └───────────┘      └─────┬─────┘
                             │
                   ┌─────────┼─────────┐
                   │         │         │
              ┌────┴───┐ ┌───┴───┐ ┌───┴───┐
              │Postgres│ │ Redis │ │ Disk  │
              │  16    │ │  7    │ │(tmux) │
              └────────┘ └───────┘ └───────┘
```

**V1 uchun taxminlar:**
- Single server yetarli (50-100 parallel session uchun)
- PostgreSQL va Redis bitta server'da (managed DB keyinroq)
- Horizontal scaling Phase 5 da
- CDN faqat static asset uchun (Vercel'da built-in)

### Resource talablari (V1)

| Component | CPU | RAM | Disk |
|-----------|-----|-----|------|
| Go API | 1 vCPU | 256MB | 50MB (binary) |
| PostgreSQL | 1 vCPU | 512MB | 10GB (data) |
| Redis | 0.5 vCPU | 256MB | — |
| tmux sessions (50) | 2 vCPU | 1GB | 500MB (workspaces) |
| **Jami (V1)** | **4 vCPU** | **2GB** | **~11GB** |

---

## Release Topology

### Branch → Deploy mapping

```
main       → Production  (tag-triggered)
dev        → Staging     (auto on merge)
feature/*  → Preview     (optional, Vercel preview)
```

### Release flow

```
1. Developer/Agent PR yaratadi (feature/* → dev)
2. CI pipeline ishlaydi:
   ├── Lint (golangci-lint, eslint)
   ├── Typecheck (go vet, tsc)
   ├── Unit tests
   ├── Integration tests (test containers)
   └── Build verification
3. PR review + approval
4. Merge → dev
5. Auto-deploy → Staging
6. Staging verification (manual / E2E)
7. dev → main PR (release PR)
8. Tag qo'yiladi: v1.0.0-beta.1
9. Auto-deploy → Production (tag trigger)
```

### Versioning

**Semantic Versioning** — `MAJOR.MINOR.PATCH`:

```
v1.0.0       → First stable release
v1.1.0       → New feature (backward compatible)
v1.1.1       → Bugfix
v2.0.0       → Breaking change
v1.0.0-beta.1 → Pre-release
```

---

## CI/CD Pipeline

### GitHub Actions workflow

```yaml
# .github/workflows/ci.yml
name: CI

on:
  pull_request:
    branches: [dev, main]
  push:
    branches: [dev]

jobs:
  go-checks:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_DB: ao_test
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
        ports:
          - 5433:5432
      redis:
        image: redis:7-alpine
        ports:
          - 6380:6379
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-go@v5
        with:
          go-version: '1.22'
      - run: golangci-lint run ./...
      - run: go vet ./...
      - run: go test -coverprofile=coverage.out ./...
      - run: go test -tags=integration ./...

  ts-checks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
        working-directory: apps/web
      - run: npx tsc --noEmit
        working-directory: apps/web
      - run: npx eslint .
        working-directory: apps/web
      - run: npx vitest run --coverage
        working-directory: apps/web
```

---

## Rollback strategiyasi

| Holat | Harakat | Vaqt |
|-------|---------|------|
| API bug (minor) | Hotfix PR → main → redeploy | < 1 soat |
| API bug (major) | Previous binary/container'ga rollback | < 5 daqiqa |
| DB migration xatosi | Down migration + binary rollback | < 15 daqiqa |
| Web UI bug | Vercel'da previous deployment'ga revert | < 1 daqiqa |

**DB migration qoidasi:**
- Har bir migration `up` va `down` faylga ega
- Destructive migration (drop column, drop table) alohida PR va review talab qiladi
- Production'da destructive migration faqat owner approval bilan

---

## Versiya

- v1.0
- Status: **APPROVED**
- Keyingi ko'rib chiqish: Phase 1 Sprint 1 tugaganda
