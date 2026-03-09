# Storage Architecture

## Maqsad

Ushbu hujjat platformadagi barcha data saqlash qatlamlarini — database, file storage, cache va archive'ni belgilaydi.

Bu hujjat `data-architecture.md` (PostgreSQL schema), `agent-runtime-model.md` (workspace) va `configuration-strategy.md` ga asoslanadi.

---

## Storage Layers

```
┌───────────────────────────────────┐
│         Application Layer         │
├───────────┬───────────┬───────────┤
│ PostgreSQL│   Redis   │   Disk    │
│ (primary) │  (cache)  │  (files)  │
├───────────┼───────────┼───────────┤
│ Structured│ Ephemeral │Unstructured│
│   data    │   data    │   data    │
└───────────┴───────────┴───────────┘
```

### PostgreSQL (Primary Store)

| Xususiyat | Qiymat |
|-----------|--------|
| Version | 16+ |
| Schema model | Schema-per-context (`data-architecture.md`) |
| Connection pool | pgx (Go) — max 25, min 5 |
| Migration tool | golang-migrate |
| Backup | pg_dump (daily, V1) |

**Saqlanadigan data:**
- Barcha domain entity'lar (User, Org, Project, Session...)
- Audit log (immutable)
- Event log (keyinroq — hozir faqat in-memory)
- Session metadata

### Redis (Cache & Ephemeral)

| Xususiyat | Qiymat |
|-----------|--------|
| Version | 7+ |
| Max memory | 256MB (V1) |
| Eviction policy | allkeys-lru |
| Connection pool | go-redis — max 10 |

**Saqlanadigan data:**
- JWT blacklist (logout qilingan token'lar)
- Rate limiter counters
- Session status cache (real-time dashboard uchun tez o'qish)
- Temporary locks (distributed lock pattern)

### Disk (File Storage)

| Xususiyat | Qiymat |
|-----------|--------|
| Location | Server local disk (V1) |
| V3+ | S3-compatible object storage |

**Saqlanadigan data:**
- Agent workspaces (`/workspaces/{session_id}/`)
- Git repository clones
- Agent output artifacts
- Log files (rotated)

---

## Data Lifecycle

| Data turi | Retention | Archive | Hard delete |
|-----------|-----------|---------|-------------|
| User account | Indefinite | Yo'q | Account delete request |
| Organization | Indefinite (soft-delete) | 90 kun keyin | Manual |
| Session metadata | 1 yil | PostgreSQL → archive table | 2 yil keyin |
| Session events | 6 oy | Compressed backup | 1 yil keyin |
| Agent workspace | 7 kun (done), 3 kun (failed) | Yo'q | Auto-cleanup |
| Audit log | 3 yil | Cold storage (V3+) | Hech qachon |
| Redis cache | TTL-based | Yo'q | Auto-eviction |

---

## Backup Strategy

### V1 (Minimal)

```bash
# Daily database backup
pg_dump agent_orchestrator > backup_$(date +%Y%m%d).sql

# Cron: har 24 soatda
0 3 * * * /scripts/backup-db.sh
```

| Component | Backup | Frequency | Retention |
|-----------|--------|-----------|-----------|
| PostgreSQL | pg_dump → local file | Daily | 7 kun |
| Redis | RDB snapshot | — (ephemeral, backup kerak emas) | — |
| Workspaces | Backup yo'q (reproducible) | — | — |

### V3+ (Production)

| Component | Backup | Frequency | Retention |
|-----------|--------|-----------|-----------|
| PostgreSQL | WAL streaming → S3 | Continuous | 30 kun point-in-time |
| File storage | S3 replication | Real-time | Lifecycle policy |

---

## Versiya

- v1.0
- Status: **APPROVED**
