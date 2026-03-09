# Mode System

## Maqsad

Ushbu hujjat platformadagi ish rejimlari (mode) tizimini belgilaydi — har bir mode organizatsiyaning ishlash uslubini belgilaydi.

Bu hujjat `vision.md` (AI-native organizations), `platform-thesis.md` (core thesis) va `scope.md` ga asoslanadi.

---

## Mode nima

Mode — organizatsiya yoki project uchun ishlash rejimi. Inson va agent'larning rolini, avtonomiylik darajasini va workflow'ni belgilaydi.

---

## V1 Mode'lar

### Mode 1: Supervised (Default)

```
Inson: Qaror beradi, task yaratadi, review qiladi
Agent: Bajaradi, hisobot beradi, to'xtab kutadi
```

| Xususiyat | Qiymat |
|-----------|--------|
| Agent avtonomiyasi | Past |
| PR merge | Faqat inson |
| Session spawn | Faqat operator |
| Agent savol bersa | Session to'xtaydi (`needs_response`) |
| Maqsad | Sifatni nazorat qilish |

**Use case:** Yangi agent setup, critical codebase, compliance-talab qiladigan muhit.

### Mode 2: Collaborative (V2+)

```
Inson: Yo'nalish beradi, murakkab qarorlar
Agent: Mustaqil ishlaydi, faqat muhim paytda so'raydi
```

| Xususiyat | Qiymat |
|-----------|--------|
| Agent avtonomiyasi | O'rta |
| PR merge | Agent yaratadi, inson approve → auto-merge |
| Session spawn | Agent yoki operator |
| Agent savol bersa | Davom etadi, savol queue'ga tushadi |
| Maqsad | Tezlikni oshirish |

### Mode 3: Autonomous (V3+)

```
Inson: Faqat strategik yo'nalish, monitoring
Agent: To'liq mustaqil — plan, execute, deploy
```

| Xususiyat | Qiymat |
|-----------|--------|
| Agent avtonomiyasi | Yuqori |
| PR merge | Auto-merge (CI pass bo'lsa) |
| Session spawn | Agent o'zi qaror beradi |
| Deploy | Agent → staging auto, production inson approve |
| Maqsad | Maksimal tezlik |

---

## Mode Configuration

Project yoki organization darajasida o'rnatiladi:

```json
{
  "mode": "supervised",
  "overrides": {
    "auto_merge": false,
    "agent_can_spawn": false,
    "require_human_review": true,
    "max_autonomous_duration_minutes": 0,
    "allowed_agent_actions": [
      "file_edit", "terminal_read", "terminal_write",
      "git_commit", "git_push", "pr_create"
    ],
    "blocked_agent_actions": [
      "pr_merge", "deploy", "db_migrate"
    ]
  }
}
```

---

## Mode Evolution

```
Phase 1: Supervised (default, yagona)
Phase 2: Supervised + Collaborative
Phase 3: Supervised + Collaborative + Autonomous (limited)
Phase 5: Full autonomous with guardrails
```

**Trust model:**
- Yangi agent/team → `supervised` da boshlaydi
- Track record yaxshi bo'lsa (success rate, PR quality) → `collaborative` ga o'tish mumkin
- `autonomous` — faqat proven agent'lar uchun, owner approval bilan

---

## Versiya

- v1.0
- Status: **APPROVED**
