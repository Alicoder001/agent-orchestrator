# Digital Office Model

## Maqsad

Ushbu hujjat platformaning "digital office" metaforasi — virtual ish muhitini qanday vizualizatsiya qilishni belgilaydi.

Bu hujjat `vision.md` (AI-native digital organizations), `platform-thesis.md` va `user-personas.md` ga asoslanadi.

---

## Metafora

Platform — bu digital ofis. Xuddi haqiqiy ofisdek:

| Haqiqiy ofis | Digital ofis (platforma) |
|-------------|------------------------|
| Bino | Organization |
| Qavat / bo'lim | Department |
| Xona / ish joyi | Team |
| Ish stoli | AgentSlot |
| Loyiha dorasi | Project |
| Ish holati (band/bo'sh) | Session status |
| Elatmalar (qo'ng'iroq) | Attention system |

---

## Visualization Layers

### Layer 1: Organization Overview (V1)

```
┌─────────────── Acme Corp ──────────────┐
│                                         │
│  Engineering          Product           │
│  ┌─────────────┐     ┌──────────┐     │
│  │ Backend Team│     │ UX Team  │     │
│  │ 🤖🤖🤖     │     │ 🤖🤖    │     │
│  │ 3 active    │     │ 1 idle   │     │
│  └─────────────┘     └──────────┘     │
│  ┌─────────────┐                       │
│  │Frontend Team│                       │
│  │ 🤖🤖       │                       │
│  │ 2 active    │                       │
│  └─────────────┘                       │
└─────────────────────────────────────────┘
```

### Layer 2: 2D Workspace (V2+)

Spatial layout — team'lar va agent'lar 2D canvas'da joylashgan. Drag-and-drop bilan qayta tartiblanishi mumkin.

### Layer 3: 3D World (V5+)

Immersive 3D muhit — `3d-world-strategy.md` da batafsil.

---

## Office Metaphor Benefits

| Benefit | Tavsif |
|---------|--------|
| **Intuitive** | Ofis metaforasi barcha foydalanuvchilarga tanish |
| **Spatial awareness** | Kim qayerda ishlayapti — bitta qarashda ko'rinadi |
| **Status visibility** | Agent "ish stolida" yoki "yig'ilishda" — holat aniq |
| **Navigation** | "Engineering bo'limiga boring" — tabiiy yo'nalish |
| **Scalability** | Kichik ofisdan katta kampusga o'sish mumkin |

---

## Office States

| State | Vizual | Ma'no |
|-------|--------|-------|
| Active office | Chiroqlar yoniq, agent'lar harakatda | Ish vaqti |
| Quiet office | Pastel, minimal harakat | Barcha agent'lar idle |
| Busy office | Yorqin, ko'p harakat | Ko'p parallel session |
| Alert office | Qizil indicator, pulsating | Attention required |

---

## Versiya

- v1.0
- Status: **APPROVED**
