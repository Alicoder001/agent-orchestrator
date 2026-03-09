# Workstream Management

## Maqsad

Ushbu hujjat ishni qanday stream'larga bo'lish, dependency boshqarish va progress reporting qoidalarini belgilaydi.

Bu hujjat `platform-roadmap.md` (phase'lar), `implementation-sequencing.md` (sprint plan) va `agent-operating-model.md` ga asoslanadi.

---

## Workstream Types

| Workstream | Tavsif | Misol |
|-----------|--------|-------|
| **Architecture** | Hujjat, ADR, dizayn qarorlari | Bounded context, data architecture |
| **Platform** | Backend infra, core service | Auth, event bus, database setup |
| **Application** | Feature implementation | Organization CRUD, session spawn |
| **Documentation** | Hujjat yozish va yangilash | Standards, governance, worklogs |
| **Operations** | CI/CD, deploy, monitoring | GitHub Actions, Docker, health check |

---

## Dependency Rules

| Qoida | Tavsif |
|-------|--------|
| Architecture → Platform | Platform boshlanishidan oldin architecture hujjatlari tayyor |
| Platform → Application | Application boshlanishidan oldin infra tayyor (DB, auth, config) |
| Documentation || Platform | Documentation parallel ishlashi mumkin |
| Operations || Application | CI/CD parallel setup qilinishi mumkin |

### Dependency visualization

```
Architecture ──→ Platform ──→ Application
      │              │
      └── Documentation (parallel)
                     │
                     └── Operations (parallel)
```

**Qat'iy qoida:** Parallel ish faqat mustaqil stream'larda. Dependency zanjirida — ketma-ket.

---

## Handoff Rules

| Kimdan | Kimga | Handoff artifact |
|--------|-------|-----------------|
| Architecture → Platform | Hujjat (architecture doc) APPROVED | Hujjat link + summary |
| Platform → Application | API + test working | Endpoint list + test result |
| Application → Operations | Feature complete, test pass | Release checklist |
| Agent → Operator | Session done, PR ready | Worklog + PR link |
| Operator → Agent | Task defined, scope clear | Task description (Definition of Ready) |

**Handoff qoidasi:**
- Handoff artifact'siz keyingi bosqich **boshlanmaydi**
- Handoff vaqtida noaniqlik bo'lsa → escalation (operator/owner)
- Agent handoff'i worklog orqali (`docs/08-worklogs/agents/`)

---

## Reporting Rules

| Level | Chastota | Format | Kim tomonidan |
|-------|----------|--------|---------------|
| Sprint progress | Har 2 hafta | Status board update | Owner |
| Daily sync | Har kun (agar kerak) | 3 satr: done / doing / blocked | Developer/Agent |
| Phase completion | Phase tugaganda | Summary + lessons learned | Owner |
| Incident report | Hodisa bo'lganda | Timeline + root cause + fix | Operational owner |

### Status board

`docs/08-worklogs/status-board.md` da tracking:

```markdown
## Sprint 1 Status

| Deliverable | Status | Owner | Blocker |
|------------|--------|-------|---------|
| Go monorepo scaffold | ✅ Done | dev-01 | — |
| Docker Compose | 🔄 In Progress | dev-01 | — |
| CI pipeline | ⏳ Not Started | ops-01 | Docker Compose kerak |
```

---

## Versiya

- v1.0
- Status: **APPROVED**
