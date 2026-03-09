# Monetization Model

## Maqsad

Ushbu hujjat platformaning daromad modeli — pricing, plan'lar va revenue stream'larini belgilaydi.

Bu hujjat `business-context.md` (business model), `platform-positioning.md` (target market) va `agent-economy.md` ga asoslanadi.

---

## Revenue Streams

| Stream | Phase | Tavsif |
|--------|-------|--------|
| **Platform subscription** | V2+ | Monthly/annual plan per org |
| **Usage-based pricing** | V3+ | LLM token markup, compute time |
| **Marketplace commission** | V3+ | Paid listing'lardan 15-20% |
| **Enterprise license** | V5+ | Self-hosted, custom deployment |
| **Support & Consulting** | V3+ | Premium support, onboarding |

---

## Pricing Plans (V2+ Draft)

| Plan | Narx | Kimlar uchun | Limits |
|------|------|-------------|--------|
| **Free** | $0 | Solo developer | 3 agent slot, 1 project, 50 session/oy |
| **Pro** | $29/oy | Freelancer, small team | 20 agent slot, 10 project, 500 session/oy |
| **Team** | $99/oy | Tech teams | 50 agent slot, unlimited project, 2000 session/oy |
| **Enterprise** | Custom | Katta kompaniyalar | Unlimited, SSO, SLA, dedicated support |

### Feature matrix

| Feature | Free | Pro | Team | Enterprise |
|---------|------|-----|------|-----------|
| Agent slots | 3 | 20 | 50 | Unlimited |
| Projects | 1 | 10 | ∞ | ∞ |
| Sessions/oy | 50 | 500 | 2000 | ∞ |
| Team members | 1 | 5 | 20 | ∞ |
| Modes | Supervised | Supervised + Collaborative | All | All |
| Analytics | Basic | Full | Full + custom | Full + API |
| Support | Community | Email | Priority | Dedicated |
| SSO | ❌ | ❌ | ❌ | ✅ |
| Audit log | ❌ | ✅ | ✅ | ✅ + export |
| Self-host | ❌ | ❌ | ❌ | ✅ |

---

## Open-Core Model

| Layer | License | Tavsif |
|-------|---------|--------|
| **Core platform** | Open source (AGPL-3.0) | API, dashboard, session management |
| **Pro features** | Proprietary | Analytics, advanced modes, integrations |
| **Enterprise features** | Proprietary + license | SSO, audit, multi-region, support |

---

## Versiya

- v1.0
- Status: **DRAFT** (V2 da finalize qilinadi)
