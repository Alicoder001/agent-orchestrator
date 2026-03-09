# Multi-Region Strategy

## Maqsad

Ushbu hujjat platformaning geografik tarqalish strategiyasini — qachon, qanday va nima uchun multi-region deployment kerak bo'lishini belgilaydi.

Bu hujjat `scaling-model.md`, `deployment-architecture.md` va `storage-architecture.md` ga asoslanadi.

---

## Multi-Region Roadmap

| Phase | Model | Regions | Maqsad |
|-------|-------|---------|--------|
| V1-V2 | Single region | 1 (US yoki EU) | MVP, simplicity |
| V3 | Active-passive | 2 (primary + standby) | Disaster recovery |
| V5 | Active-active | 3+ (US, EU, Asia) | Low latency, compliance |

---

## V1-V2: Single Region

```
┌─────────────────────────────┐
│        Region: US-East      │
│  ┌─────┐ ┌─────┐ ┌──────┐  │
│  │ API │ │ DB  │ │Redis │  │
│  └─────┘ └─────┘ └──────┘  │
│  ┌──────────────────────┐   │
│  │   Worker Nodes       │   │
│  └──────────────────────┘   │
└─────────────────────────────┘
```

**Yetarli bo'lgan payt:** < 500 concurrent users, compliance talab yo'q.

---

## V3: Active-Passive (Disaster Recovery)

```
Primary Region (US-East)          Standby Region (EU-West)
┌──────────────────────┐         ┌──────────────────────┐
│  API (active)        │         │  API (standby, off)  │
│  DB (primary)   ─────────────→ │  DB (read replica)   │
│  Redis (active)      │  async  │  Redis (cold)        │
│  Workers (active)    │  repli  │  Workers (standby)   │
└──────────────────────┘  cation └──────────────────────┘
```

**Failover trigger:**
- Primary region butunlay down (> 5 daqiqa)
- Manual failover qaror (operator)
- DNS switch — 5-15 daqiqa downtime

### Replication

| Component | Qanday | Lag |
|-----------|--------|-----|
| PostgreSQL | Streaming replication | < 1s |
| Redis | Yo'q (re-warm on failover) | — |
| File storage | S3 cross-region replication | < 15 min |

---

## V5: Active-Active

```
US-East              EU-West              Asia-East
┌──────────┐        ┌──────────┐        ┌──────────┐
│ API + DB │←──────→│ API + DB │←──────→│ API + DB │
│ Workers  │  sync  │ Workers  │  sync  │ Workers  │
└──────────┘        └──────────┘        └──────────┘
      ↕                   ↕                   ↕
   CockroachDB / Spanner (global distributed DB)
```

### Active-Active challenges

| Challenge | Yechim |
|-----------|--------|
| Write conflict | CockroachDB serializable isolation |
| Data locality | Org → region pinning |
| Session affinity | Agent runtime region'ga bog'langan |
| Compliance (GDPR) | EU user data faqat EU region'da |

---

## Data Residency (Compliance)

| Regulation | Talab | Yechim |
|-----------|-------|--------|
| GDPR (EU) | EU user PII faqat EU'da | Region pinning per org |
| SOC 2 | Audit trail, encryption | Audit log + TLS |
| HIPAA | — | Hozircha scope'da yo'q |

### Region pinning

```json
{
  "org_id": "...",
  "data_region": "eu-west",
  "compute_region": "eu-west",
  "backup_region": "eu-central"
}
```

---

## Versiya

- v1.0
- Status: **APPROVED**
