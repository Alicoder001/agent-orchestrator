# Trust and Reputation

## Maqsad

Ushbu hujjat agent'lar, foydalanuvchilar va marketplace publisher'lar uchun ishonch (trust) va obro' (reputation) tizimini belgilaydi.

Bu hujjat `mode-system.md` (trust → mode evolution), `agent-economy.md` (efficiency metrics) va `marketplace-model.md` ga asoslanadi.

---

## Agent Trust Score

Har bir AgentSlot vaqt o'tishi bilan trust score to'playdi:

### Trust Signals

| Signal | Og'irlik | Tavsif |
|--------|---------|--------|
| **PR merge rate** | 30% | Merge qilingan PR / jami PR |
| **CI pass rate** | 25% | CI pass / jami PR |
| **Session success rate** | 20% | Done sessions / total sessions |
| **Review iteration** | 15% | O'rtacha review round soni (past mos) |
| **Security incidents** | 10% | Security-related reject'lar |

### Score calculation

```
trust_score = (merge_rate * 0.3)
            + (ci_pass_rate * 0.25)
            + (session_success * 0.2)
            + ((1 - avg_review_rounds/5) * 0.15)
            + ((1 - security_incidents/10) * 0.1)
```

**Range:** 0.0 — 1.0

### Trust → Mode progression

| Trust Score | Allowed Mode | Tavsif |
|-------------|-------------|--------|
| 0.0 — 0.5 | Supervised only | Yangi yoki past-performing agent |
| 0.5 — 0.8 | Supervised + Collaborative | Proven agent |
| 0.8 — 1.0 | All modes | Highly trusted agent |

**Qoida:** Mode upgrade faqat owner approval bilan (avtomatik emas).

---

## Publisher Reputation (V3+)

Marketplace publisher'lar uchun:

| Signal | Tavsif |
|--------|--------|
| Downloads | Jami download soni |
| Rating | Foydalanuvchi baholari (1-5) |
| Response time | Issue/support'ga javob tezligi |
| Update frequency | Template/workflow yangilanish chastoti |
| Verified badge | Platform team tomonidan tekshirilgan |

### Publisher Tiers

| Tier | Talablar |
|------|----------|
| **Community** | Hech qanday talab yo'q |
| **Verified** | 10+ downloads, 4.0+ rating, identity verified |
| **Premium** | 100+ downloads, 4.5+ rating, SLA mavjud |

---

## Abuse Prevention

| Muammo | Yechim |
|--------|--------|
| Fake reviews | 1 review per user per item, verified purchase |
| Malicious template | Security scan, sandbox test |
| Spam listings | Rate limit + manual review |
| Trust score manipulation | Rolling window (90 kun), outlier detection |

---

## Versiya

- v1.0
- Status: **APPROVED**
