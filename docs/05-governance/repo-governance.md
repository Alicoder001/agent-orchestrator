# Repo Governance

## Maqsad

Bu hujjat repoda ishlayotgan barcha aktorlar — inson va AI agent — uchun qoidalarni belgilaydi. Bu qoidalar loyihaning sifatini, izchilligini va xavfsizligini ta'minlaydi.

---

## Repo holati

| Yo'l | Holat | Izohi |
|------|-------|-------|
| `/` (root) | ACTIVE | Yangi platforma — asosiy manba |
| `/legacy-monorepo` | ARCHIVE | Faqat reference — o'zgartirilmaydi |
| `/docs` | SOURCE OF TRUTH | Hujjatlar koddan oldin keladi |

---

## Branch strategiyasi

```
main          → production-ready, har doim yashil
dev           → aktiv development, feature'lar bu yerga merge
feature/*     → bitta feature yoki task uchun
fix/*         → bugfix uchun
docs/*        → faqat hujjat o'zgarishi uchun
agent/*       → AI agent tomonidan yaratilgan branch (masalan: agent/eng-001-task-42)
```

**Qoidalar:**
- `main`ga to'g'ridan push taqiqlangan
- `main`ga faqat PR orqali merge (review kerak)
- `dev`ga agent branch'lar PR orqali merge
- Har bir commit Conventional Commits formatida bo'lishi kerak

---

## Conventional Commits

```
feat:     yangi imkoniyat
fix:      bugfix
docs:     hujjat o'zgarishi
refactor: kod o'zgarishi (feature ham, fix ham emas)
test:     test qo'shish yoki o'zgartirish
chore:    tooling, config, dependency
ci:       CI/CD o'zgarishi
perf:     performance yaxshilash
```

Misol: `feat(orchestration): add session spawn API endpoint`

---

## AI Agent qoidalari

### Asosiy qoidalar

1. **Hujjatni avval o'qi.** Har qanday implementation boshlanishidan oldin tegishli hujjat o'qiladi. Hujjat yo'q bo'lsa — hujjat yoziladi, keyin implement qilinadi.

2. **Scope'dan chiqma.** Agent faqat o'ziga berilgan task doirasida ishlaydi. Qo'shni paketlarni "tuzatib" yoki "yaxshilab" o'zgartirmaydi.

3. **Worklog yozish.** Har bir agent o'z worklog'ini yuritadi (`docs/08-worklogs/agents/agent-ID.md`). Har sessiyadan keyin yangilanadi.

4. **Noaniqlikda to'xta.** Agar task noaniq bo'lsa yoki ikki yo'l bo'lsa — harakat qilmasdan operator'ga escalate qiladi.

5. **Test yoz.** Yangi kod yozilganda test ham yoziladi. Test yo'q kod merge qilinmaydi.

6. **Legacy'ga tegma.** `/legacy-monorepo` faqat o'qiladi. Hech narsa yozilmaydi, o'chirilmaydi.

7. **Secrets yozma.** Hech qanday API key, token, parol kod ichiga yoki hujjatga yozilmaydi.

### Agent branch qoidasi

```bash
# Agent branch nomi formati:
agent/{agent-id}/{task-id}-{qisqa-tavsif}

# Misol:
agent/eng-001/task-42-add-session-api
```

### Agent PR qoidasi

PR sarlavhasi:
```
[Agent: eng-001] feat(orchestration): add session spawn endpoint
```

PR tavsifi quyidagilarni o'z ichiga olishi kerak:
- Qaysi task (issue link)
- Nima qilindi
- Test qilinganmi
- Qanday tekshirish mumkin (local run instruksiyasi)

---

## Inson reviewer qoidalari

Agent PR'larini review qilganda:

1. **Domain model bilan tekshir.** Yangi entity yoki field domain-model.md'ga mos kelishi kerak
2. **Bounded context qoidasiga rioya qilganmi?** Context'lar aralashtirilib ketganmi?
3. **Test bormi?** Test yo'q bo'lsa merge qilinmaydi
4. **Secrets yo'qmi?** `.env.example` yangilanganmi (yangi env kerak bo'lsa)
5. **Hujjat yangilanganmi?** Yangi behavior hujjatlashtirilganmi

---

## Fayl tuzilmasi qoidalari

```
/apps
  /api          → Go backend (modular monolith)
  /web          → Next.js frontend
  /desktop      → Tauri desktop app
/packages
  /types        → Shared TypeScript types (auto-generated from OpenAPI)
  /ui           → Shared React component library
/docs           → Barcha hujjatlar (SOURCE OF TRUTH)
/legacy-monorepo → ARCHIVE — tegma
/scripts        → Dev va CI uchun helper script'lar
```

**Qoidalar:**
- Yangi top-level papka yaratish uchun avval bu hujjat yangilanadi
- `/docs` ichidagi hujjatlar tegishli bo'lim ichida bo'ladi
- Har bir Go paketi `README.md`ga ega bo'lishi kerak

---

## Hujjat yozish qoidalari

- Hujjat oxirida `## Versiya` bo'limi bo'ladi
- Status: `DRAFT` | `IN_REVIEW` | `APPROVED` | `SUPERSEDED`
- TODO'siz approve bo'lmaydi
- Hujjat o'zgarsa — `Versiya` yangilanadi va `## O'zgarish tarixi` bo'limiga yoziladi

---

## Versiya

- v1.0
- Status: **APPROVED**
