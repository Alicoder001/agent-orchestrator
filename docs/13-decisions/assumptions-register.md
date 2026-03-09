# Assumptions Register

## Maqsad

Ushbu hujjat loyihadagi barcha muhim taxminlar (assumptions) ni qayd etadi — har bir taxminning asosi, xavfi va tekshirish vaqtini belgilaydi.

Bu hujjat `open-questions.md` (resolved questions asoslari), `scope.md` (out-of-scope decisions) va `business-context.md` ga asoslanadi.

---

## Taxminlar ro'yxati

### A-001: Solo Developer Demand

| Field | Qiymat |
|-------|--------|
| **Taxmin** | Solo developer'lar ko'p agent'ni parallel boshqarish ehtiyojiga ega |
| **Asos** | Cursor/Copilot adoption rate, AI-assisted development trend |
| **Xavf** | Past — developer'lar bitta agent bilan yetarli deb hisoblashi mumkin |
| **Tekshirish** | V1 launch → user feedback (30 kun) |
| **Status** | ⏳ Unvalidated |

### A-002: Modular Monolith Yetarli

| Field | Qiymat |
|-------|--------|
| **Taxmin** | Modular monolith Phase 1-3 uchun yetarli, microservice'ga erta kerak emas |
| **Asos** | ADR-003: 100 concurrent session target, single server 50-100 ga yetadi |
| **Xavf** | O'rta — agar user soni tez o'ssa, extraction vaqtida complexity |
| **Tekshirish** | Phase 2 oxirida load test |
| **Status** | ✅ ADR bilan tasdiqlangan |

### A-003: tmux Runtime Yetarli (V1)

| Field | Qiymat |
|-------|--------|
| **Taxmin** | tmux-based agent runtime V1 uchun yetarli isolation beradi |
| **Asos** | Development/small-team scenario, 50 concurrent session target |
| **Xavf** | O'rta — security isolation past, resource control cheklangan |
| **Tekshirish** | V1 beta → security audit |
| **Status** | ⏳ Unvalidated |

### A-004: GitHub Primary Integration

| Field | Qiymat |
|-------|--------|
| **Taxmin** | Foydalanuvchilarning 80%+ i GitHub ishlatadi |
| **Asos** | GitHub market share (developer tools), target persona profili |
| **Xavf** | Past — GitLab/Bitbucket foydalanuvchilari ham bo'lishi mumkin |
| **Tekshirish** | V1 launch → user survey |
| **Status** | ⏳ Unvalidated |

### A-005: LLM Provider Diversity

| Field | Qiymat |
|-------|--------|
| **Taxmin** | Foydalanuvchilar turli LLM provider'lardan (OpenAI, Anthropic, local) foydalanmoqchi |
| **Asos** | Adapter pattern (ADR), provider lock-in'dan qochish |
| **Xavf** | Past — ko'pchilik faqat OpenAI ishlatishi mumkin |
| **Tekshirish** | V2 da provider usage analytics |
| **Status** | ⏳ Unvalidated |

### A-006: Team Structure Demand

| Field | Qiymat |
|-------|--------|
| **Taxmin** | Org → Department → Team hierarchiyasi kerak (flat emas) |
| **Asos** | User persona (Tech Lead, CTO) ehtiyoji |
| **Xavf** | O'rta — ko'p foydalanuvchilar flat structure afzal ko'rishi mumkin |
| **Tekshirish** | V1 beta user interview |
| **Status** | ⏳ Unvalidated |

### A-007: Self-Hosting Interest

| Field | Qiymat |
|-------|--------|
| **Taxmin** | Developer'lar self-hosted variant'ni xohlaydi (SaaS'dan tashqari) |
| **Asos** | Open-source community trend, data sovereignty concerns |
| **Xavf** | O'rta — support va docs qo'shimcha kuch talab qiladi |
| **Tekshirish** | Community feedback (GitHub Stars, Issues) |
| **Status** | ⏳ Unvalidated |

### A-008: Attention System Value

| Field | Qiymat |
|-------|--------|
| **Taxmin** | Attention system foydalanuvchiga qiymat qo'shadi (random polling'dan yaxshiroq) |
| **Asos** | Domain research — notification fatigue muammosi |
| **Xavf** | Past — foydalanuvchilar oddiy notification'ni afzal ko'rishi mumkin |
| **Tekshirish** | V1 A/B test (attention vs simple notification) |
| **Status** | ⏳ Unvalidated |

---

## Status Legend

| Status | Tavsif |
|--------|--------|
| ⏳ Unvalidated | Hali tekshirilmagan |
| ✅ Validated | Ma'lumot bilan tasdiqlangan |
| ❌ Invalidated | Noto'g'ri ekanligi aniqlangan |
| 🔄 Updated | O'zgartirilgan (yangi ma'lumot asosida) |

---

## Versiya

- v1.0
- Status: **APPROVED**
