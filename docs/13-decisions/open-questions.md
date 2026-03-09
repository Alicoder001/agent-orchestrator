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
- Status: OPEN

**OQ-004: Task tracker bo'lmasa ham platforma ishlaydi?**
- GitHub Issues ulash majburiy emas deb belgilangan, lekin UX aniq emas
- "Platform native" task yaratish oqimi qanday?
- Status: OPEN

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
- Status: OPEN — governance model kerak

**OQ-008: Local LLM (Ollama) bilan session qanday ishlaydi?**
- Agent binary Ollama'ga local API call qiladimi?
- Platforma bu provider'ni qanday konfiguratsiya qiladi?
- Status: OPEN (Phase 1-2'da aniqlanadi)

---

## Versiya

- v1.0
- Status: **LIVE** (doimiy yangilanadi)
