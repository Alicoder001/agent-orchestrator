# Change Management

## Maqsad

Ushbu hujjat repodagi muhim o'zgarishlar qanday kiritilishi, review qilinishi va rollback qilinishini belgilaydi.

Bu hujjat `repo-governance.md` (branch strategy, PR rules) va `deployment-architecture.md` (release flow) ga asoslanadi.

---

## Change Categories

| Toifa | Misol | Required Artifacts | Review |
|-------|-------|-------------------|--------|
| **Critical** | DB schema, auth logic, security | ADR + PR + test + hujjat | Owner review |
| **Major** | Yangi API endpoint, yangi module | PR + test + hujjat | Peer review |
| **Standard** | Feature implementation, bug fix | PR + test | Peer review |
| **Minor** | Typo fix, config tweak, docs update | PR | Any reviewer |

---

## Required Artifacts by Change Type

### Critical change

- [ ] ADR yozilgan va tasdiqlangan
- [ ] Migration script (`up` va `down`)
- [ ] Unit + integration test
- [ ] Hujjat yangilangan
- [ ] Rollback plan aniq
- [ ] Owner tomonidan review

### Major change

- [ ] PR description to'liq (nima, nima uchun, test)
- [ ] Test yozilgan (unit minimum)
- [ ] Tegishli hujjat yangilangan
- [ ] `.env.example` yangilangan (agar new env)

### Standard change

- [ ] PR + test
- [ ] CI green

### Minor change

- [ ] PR (1 approval yetarli)

---

## Rollback Expectations

| O'zgarish turi | Rollback usuli | Max vaqt |
|---------------|---------------|----------|
| Kod o'zgarishi | Previous build/tag ga deploy | 5 daqiqa |
| DB migration | Down migration script | 15 daqiqa |
| Config o'zgarishi | Env variable revert + restart | 5 daqiqa |
| Frontend | Vercel previous deploy | 1 daqiqa |

**Qoidalar:**
- Har bir destructive DB migration uchun rollback plan **PR'da yoziladi**
- `DROP TABLE`, `DROP COLUMN` faqat owner approval bilan
- Rollback test'i staging'da sinovdan o'tkaziladi (major/critical uchun)

---

## Communication Expectations

| O'zgarish | Kim xabardor | Qanday |
|-----------|-------------|--------|
| Breaking API change | Barcha frontend developers | PR description + `[BREAKING]` label |
| New environment variable | DevOps + hamma dev | `.env.example` update + PR note |
| Security-related change | Owner | PR + direct notification |
| Schema migration | Barcha backend devs | PR description + migration note |
| Dependency update (major) | Barcha devs | PR description |

---

## Versiya

- v1.0
- Status: **APPROVED**
