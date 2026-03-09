# Changelog Policy

## Maqsad

Ushbu hujjat platformadagi changelog yozish, formatlash va maintain qilish qoidalarini belgilaydi.

Bu hujjat `repo-governance.md` (conventional commits) va `deployment-architecture.md` (versioning) ga asoslanadi.

---

## Changelog formati

[Keep a Changelog](https://keepachangelog.com/) standartiga asoslangan:

```markdown
# Changelog

## [1.1.0] - 2026-03-15

### Added
- Organization invite flow (email-based)
- GitHub OAuth login

### Changed
- JWT access token TTL default 30m → 15m

### Fixed
- Refresh token rotation race condition

### Removed
- Legacy password reset endpoint (replaced by new flow)
```

---

## Toifalar

| Toifa | Tavsif |
|-------|--------|
| `Added` | Yangi feature yoki imkoniyat |
| `Changed` | Mavjud funksionallik o'zgarishi |
| `Deprecated` | Tez orada o'chirilishi rejalashtirilgan |
| `Removed` | O'chirilgan feature |
| `Fixed` | Bug tuzatish |
| `Security` | Xavfsizlik bilan bog'liq o'zgarish |

---

## Qoidalar

| Qoida | Tavsif |
|-------|--------|
| Har bir release uchun changelog yangilanadi | Tag qo'yishdan oldin |
| Changelog `CHANGELOG.md` da repo root'da saqlanadi | — |
| Yozish tili: inglizcha, present tense | "Add", "Fix", "Remove" |
| Breaking change `[BREAKING]` bilan belgilanadi | `### Changed` ichida |
| Changelog PR merge vaqtida developer tomonidan yangilanadi | — |
| `Unreleased` section mavjud — hali tag bo'lmagan o'zgarishlar uchun | — |

---

## Versiya

- v1.0
- Status: **APPROVED**
