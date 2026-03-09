# Ownership Model

## Maqsad

Ushbu hujjat tizimlar, paketlar, hujjatlar va jarayonlar kimga tegishli ekanligini belgilaydi.

Bu hujjat `bounded-contexts.md` (context'lar) va `repo-governance.md` (fayl tuzilmasi) ga asoslanadi.

---

## Ownership Layers

### Business ownership
Platformaning strategik yo'nalishi va mahsulot qarorlari.
- **Owner:** Loyiha asoschisi (Owner role)
- **Javobgarlik:** Vision, roadmap, product prioritization

### Architecture ownership
Texnik qarorlar, ADR'lar, bounded context chegaralari.
- **Owner:** Loyiha asoschisi / Lead architect
- **Javobgarlik:** Tech stack, architecture decisions, code structure

### Module ownership
Har bir bounded context / Go package uchun javobgar shaxs yoki agent.
- **Owner:** Belgilangan developer yoki agent team
- **Javobgarlik:** Implementation, test, documentation

### Operational ownership
Deploy, monitoring, incident management.
- **Owner:** DevOps / platform operator
- **Javobgarlik:** Uptime, performance, security patches

---

## Mapping Rules

| Component | Owner | Qoidasi |
|-----------|-------|---------|
| `/docs/00-foundation/*` | Architecture owner | O'zgartirish = owner approval |
| `/docs/01-architecture/*` | Architecture owner | O'zgartirish = owner approval |
| `/docs/02-standards/*` | Architecture owner | O'zgartirish = owner approval |
| `/apps/api/internal/modules/identity/*` | Identity module owner | PR review = module owner |
| `/apps/api/internal/modules/organization/*` | Organization module owner | PR review = module owner |
| `/apps/api/internal/modules/project/*` | Project module owner | PR review = module owner |
| `/apps/api/internal/modules/orchestration/*` | Orchestration module owner | PR review = module owner |
| `/apps/api/internal/shared/*` | Architecture owner | Shared code = stricter review |
| `/apps/web/*` | Frontend module owner | PR review = module owner |
| `/apps/desktop/*` | Desktop module owner (Phase 4) | — |
| `.github/workflows/*` | DevOps owner | CI/CD = DevOps approval |
| `docker-compose.yml` | DevOps owner | Infra = DevOps approval |

---

## Escalation Path

```
Module Owner → Architecture Owner → Project Owner
    (kod)          (dizayn)           (strategiya)
```

| Holat | Kimga escalate |
|-------|---------------|
| Module ichidagi texnik qaror | Module owner hal qiladi |
| Cross-module dependency | Architecture owner qaror beradi |
| Architecture o'zgarishi | Project owner tasdiqlaydi (ADR) |
| Security issue | Project owner darhol xabardor |
| Production incident | Operational owner → Project owner |

---

## Versiya

- v1.0
- Status: **APPROVED**
