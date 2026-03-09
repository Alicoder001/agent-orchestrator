# Release Process

## Maqsad

Ushbu hujjat platformaning release jarayonini — build, tag, deploy va post-release tekshiruvlarini belgilaydi.

Bu hujjat `deployment-architecture.md` (CI/CD, muhitlar), `testing-strategy.md` (release gates) va `changelog-policy.md` ga asoslanadi.

---

## Release turlari

| Tur | Trigger | Misol tag | Deploy target |
|-----|---------|-----------|---------------|
| **Patch** | Bug fix, security fix | `v1.0.1` | Production (fast-track) |
| **Minor** | Yangi feature, non-breaking | `v1.1.0` | Staging → Production |
| **Major** | Breaking change | `v2.0.0` | Staging → Production (extended test) |
| **Pre-release** | Beta / RC | `v1.1.0-beta.1` | Staging only |

---

## Release flow

### Standard release (minor/major)

```
1. dev branch'da barcha feature'lar merge bo'lgan
         ↓
2. Release PR yaratiladi: dev → main
   - CHANGELOG.md yangilanadi
   - Version bump (package.json, go constant)
         ↓
3. Release gates tekshiriladi:
   ├── All tests pass (unit + integration)
   ├── E2E critical paths pass
   ├── Lint + typecheck clean
   ├── No P0 open bugs
   └── Changelog complete
         ↓
4. PR review + owner approval
         ↓
5. Merge → main
         ↓
6. Tag yaratiladi: git tag v1.1.0
         ↓
7. CI trigger:
   ├── Go binary build + container push
   ├── Next.js build + deploy (Vercel auto)
   └── Release notes auto-generate (GitHub Release)
         ↓
8. Post-release verification:
   ├── Health check pass
   ├── Smoke test (login, org create, session list)
   └── Monitoring 30 daqiqa kuzatish
```

### Hotfix release (patch)

```
1. Bug topiladi production'da
         ↓
2. Hotfix branch: fix/critical-bug (main'dan)
         ↓
3. Fix + test yoziladi
         ↓
4. PR → main (fast-track review)
         ↓
5. Merge + tag: v1.0.1
         ↓
6. Auto-deploy → production
         ↓
7. Fix dev'ga ham merge qilinadi (cherry-pick yoki merge back)
```

---

## Release checklist

```markdown
### Pre-release
- [ ] Barcha feature PR'lari dev'ga merge bo'lgan
- [ ] CI pipeline green
- [ ] Integration test pass
- [ ] E2E critical paths pass
- [ ] CHANGELOG.md yangilangan
- [ ] Version bump qilingan
- [ ] No open P0/P1 bugs
- [ ] Owner approval olingan

### Deploy
- [ ] Release PR → main merge
- [ ] Git tag yaratilgan
- [ ] CI build va deploy muvaffaqiyatli
- [ ] Container image push qilingan (agar applicable)

### Post-release
- [ ] Health check pass (production)
- [ ] Smoke test pass (login, basic flow)
- [ ] 30 daqiqa monitoring — error rate normal
- [ ] GitHub Release notes published
- [ ] Team/stakeholders xabardor qilingan
```

---

## Rollback

`deployment-architecture.md` dan:

| Holat | Harakat | Max vaqt |
|-------|---------|----------|
| API bug | Previous tag ga redeploy | 5 daqiqa |
| DB migration xatosi | Down migration + rollback | 15 daqiqa |
| Frontend bug | Vercel previous deploy | 1 daqiqa |

**Rollback trigger:** Error rate > 5% yoki critical path broken.

---

## Versiya

- v1.0
- Status: **APPROVED**
