# Open Questions

Bu hujjat platformada hali aniq javob berilmagan savollrni qayd etadi. Har bir savol javob topilganda bu yerdan o'chiriladi va tegishli hujjatga yoziladi.

---

## Foundation

**OQ-001: Personal plan uchun organization cheklovi qanday?**
- Personal orgda nechta project bo'lishi mumkin?
- Personal orgda agent limit bormi?
- Status: OPEN

**OQ-002: Free plan nima o'z ichiga oladi?**
- Nechta agent session parallel?
- Storage limit?
- Status: OPEN (billing strategy aniqlanmagan)

---

## Product

**OQ-003: Workflow stage'lar optional yoki majburiy?**
- Har bir project'da workflow bo'lishi shartmi?
- "No workflow" — faqat session spawn modeli ham to'liq qo'llaniladimi?
- Status: **RESOLVED**
- Qaror: Workflow **optional**. Project workflow'siz ham yaratilishi mumkin.
- Workflow yo'q bo'lsa: session spawn → working → done (simplified lifecycle)
- Workflow bor bo'lsa: stage progression va department assignment ishlaydi
- Default workflow template taqdim etiladi lekin majburiy emas
- Resolved: 2026-03-09

**OQ-004: Task tracker bo'lmasa ham platforma ishlaydi?**
- GitHub Issues ulash majburiy emas deb belgilangan, lekin UX aniq emas
- "Platform native" task yaratish oqimi qanday?
- Status: **RESOLVED**
- Qaror: Ha, platforma tracker bo'lmasa ham **to'liq ishlaydi**.
- Platform native task: title, description, priority, status — platforma ichida yaratiladi
- GitHub Issues: optional sync, pull-only model (platforma master)
- Linear: optional sync, keyinroq Phase 2+
- "Quick spawn": tasksiz session boshlash mumkin (ad-hoc ish uchun)
- Resolved: 2026-03-09

---

## Architecture

**OQ-005: Session metadata qayerda saqlanadi?**
- PostgreSQL'da (structured) yoki disk'da (flat file, legacy kabi)?
- Ikkalasini kombinatsiyasi?
- Status: **RESOLVED** → PostgreSQL primary, disk'da runtime state (tmux session name va workspace path)

**OQ-006: Multi-region support qachon?**
- Phase 5 deb belgilangan, lekin DB sharding strategiyasi aniqlanmagan
- Status: OPEN (deferred to Phase 5)

---

## Platform

**OQ-007: Agent output'ni moderate qilish kerakmi?**
- Agent yozgan kod review'siz merge qilinishi mumkinmi?
- Human approval gate qachon trigger bo'lishi kerak?
- Status: **RESOLVED**
- Qaror: V1'da barcha merge'lar **human approval talab qiladi** (default).
- Per-project konfiguratsiya: `auto_merge_policy` = `manual` | `ci_pass_only` | `full_auto`
- Phase 1-2: faqat `manual` (default, o'zgartirib bo'lmaydi)
- Phase 3+: `ci_pass_only` va `full_auto` option'lar yoqiladi
- Approval gate: PR `review_requested` → operator approve → `ready_to_merge`
- Resolved: 2026-03-09

**OQ-008: Local LLM (Ollama) bilan session qanday ishlaydi?**
- Agent binary Ollama'ga local API call qiladimi?
- Platforma bu provider'ni qanday konfiguratsiya qiladi?
- Status: OPEN (Phase 1-2'da aniqlanadi)

---

## Versiya

- v1.0
- Status: **LIVE** (doimiy yangilanadi)
