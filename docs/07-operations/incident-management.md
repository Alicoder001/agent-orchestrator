# Incident Management

## Maqsad

Ushbu hujjat production incident'larni aniqlash, triage qilish, hal etish va post-mortem o'tkazish jarayonini belgilaydi.

Bu hujjat `deployment-architecture.md` (rollback), `observability-standards.md` (alerting) va `ownership-model.md` (escalation) ga asoslanadi.

---

## Incident Severity

| Severity | Tavsif | Response SLA | Misol |
|----------|--------|-------------|-------|
| **P0 — Critical** | Platform to'liq ishlamayapti | < 15 daqiqa | API down, DB crash, auth broken |
| **P1 — Major** | Asosiy feature ishlamayapti | < 1 soat | Session spawn fail, PR merge broken |
| **P2 — Minor** | Qisman degradation | < 4 soat | Slow queries, dashboard glitch |
| **P3 — Low** | Minor bug, workaround bor | < 24 soat | UI misalignment, log spam |

---

## Incident Lifecycle

```
1. DETECT — Alert/monitoring yoki manual report
        ↓
2. TRIAGE — Severity aniqlash (P0-P3)
        ↓
3. RESPOND — Owner assign, investigation boshlash
        ↓
4. MITIGATE — Tezkor yechim (rollback, hotfix, workaround)
        ↓
5. RESOLVE — Root cause topildi, permanent fix deploy
        ↓
6. POST-MORTEM — Timeline, root cause, lessons learned
```

### Detection sources

| Source | Misol |
|--------|-------|
| Health check endpoint | `/api/internal/health` → 503 |
| Error rate spike | Error > 5% (5 daqiqa window) |
| User report | "Login ishlamayapti" |
| CI/CD failure | Deploy pipeline fail |
| Monitoring alert | p95 latency > 2s |

---

## Response Playbook

### P0 — Critical

```
1. [0 min]   Alert keldi → owner darhol xabardor
2. [5 min]   Owner incident channel ochadi (GitHub Issue + label: P0)
3. [10 min]  First assessment — nima buzilgan, scope qancha
4. [15 min]  Mitigation qaror: rollback vs hotfix
5. [30 min]  Mitigation deploy qilindi
6. [60 min]  Verified — tizim ishlayapti
7. [24 soat] Post-mortem yozildi
```

### P1 — Major

```
1. [0 min]   Alert → owner xabardor
2. [15 min]  Investigation boshlanadi
3. [30 min]  Root cause taxmin qilinadi
4. [1 soat]  Fix yoki workaround deploy
5. [48 soat] Post-mortem (agar kerak)
```

### P2/P3

```
1. GitHub Issue yaratildi (severity tag bilan)
2. Keyingi sprint'da yoki hozirgi sprint backlog'ga qo'shildi
3. Fix + test → PR → merge
```

---

## Rollback Decision Matrix

| Sharoit | Harakat |
|---------|---------|
| Oxirgi deploy sabab bo'lgan | Previous tag'ga rollback |
| DB migration oqibati | Down migration + binary rollback |
| Config o'zgarishi oqibati | Env revert + restart |
| Tashqi dependency (GitHub, Redis) | Graceful degradation, retry logic |
| Unknown root cause | Rollback → investigate → redeploy |

---

## Post-Mortem Formati

Har bir P0 va P1 uchun **majburiy**:

```markdown
# Incident Post-Mortem: [Sarlavha]

## Summary
- **Severity:** P0
- **Duration:** 45 daqiqa (14:00 — 14:45 UTC)
- **Impact:** Barcha foydalanuvchilar 45 daqiqa login qila olmadi

## Timeline
| Vaqt (UTC) | Event |
|------------|-------|
| 14:00 | Deploy v1.2.3 → production |
| 14:02 | Health check fail boshlanadi |
| 14:05 | Alert trigger → owner xabardor |
| 14:10 | Investigation — JWT key file yo'q |
| 14:15 | Rollback qaror → v1.2.2 ga |
| 14:20 | Rollback deploy boshlanadi |
| 14:25 | Rollback complete, health check pass |
| 14:45 | Full verification, incident closed |

## Root Cause
Yangi deploy'da JWT key file path o'zgargan, lekin `.env` yangilanmagan.

## What Went Well
- Alert 2 daqiqada ishladi
- Rollback 10 daqiqada yakunlandi

## What Went Wrong
- Config validation startup'da key file mavjudligini tekshirmagan
- `.env` o'zgarishi PR'da yozilmagan

## Action Items
- [ ] Config validation'ga key file check qo'shish
- [ ] Deploy checklist'ga `.env` tekshiruv qo'shish
- [ ] PR template'ga env changes section qo'shish
```

---

## Incident Register

`docs/07-operations/incidents/` papkasida saqlanadi:

```
incidents/
├── INC-001-jwt-key-missing.md
├── INC-002-db-connection-pool-exhausted.md
└── ...
```

---

## Versiya

- v1.0
- Status: **APPROVED**
