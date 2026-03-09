# Mode Experience Mapping

## Maqsad

Ushbu hujjat har bir mode (supervised, collaborative, autonomous) uchun UX farqlarini — qaysi UI element'lar qanday o'zgarishini belgilaydi.

Bu hujjat `mode-system.md` (mode definitions), `operator-dashboard-model.md` va `chat-and-command-surface.md` ga asoslanadi.

---

## Mode → UX Mapping

### Supervised Mode UX

| UI Element | Ko'rinish |
|-----------|-----------|
| Session card | "Supervised" badge (yashil) |
| Merge button | Highlighted, operator must faqat click |
| Auto-merge | Disabled, greyed out |
| Kill button | Always visible |
| Chat input | Always visible — operator hamma vaqt yoza oladi |
| Agent autonomy indicator | ░░░░░░░░░░ 10% bar |
| Notifications | Barcha status o'zgarishlar notification |
| PR review | Agent PR yaratganida darhol notification |

### Collaborative Mode UX (V2+)

| UI Element | Ko'rinish |
|-----------|-----------|
| Session card | "Collaborative" badge (ko'k) |
| Merge button | Agent approve olsa — auto-merge option ko'rinadi |
| Auto-merge toggle | Enabled, operator on/off qila oladi |
| Kill button | Visible |
| Chat input | Visible, lekin agent savol bergandagina highlight |
| Agent autonomy indicator | ▓▓▓▓▓░░░░░ 50% bar |
| Notifications | Faqat attention-required events |
| PR review | Digest — har 4 soatda summary |

### Autonomous Mode UX (V3+)

| UI Element | Ko'rinish |
|-----------|-----------|
| Session card | "Autonomous" badge (binafsha) |
| Merge button | Auto-merge default (CI pass bo'lsa) |
| Auto-merge | Always on, override button bor |
| Kill button | Emergency only — confirm dialog |
| Chat input | Minimal — faqat override uchun |
| Agent autonomy indicator | ▓▓▓▓▓▓▓▓▓░ 90% bar |
| Notifications | Faqat critical events |
| PR review | Daily digest only |

---

## Mode Transition UI

Mode o'zgartirish uchun:

```
Settings → Project → Mode
┌─────────────────────────────────────┐
│  Current mode: Supervised           │
│                                     │
│  ○ Supervised (recommended)         │
│    Agent'lar har qadamda to'xtaydi  │
│                                     │
│  ○ Collaborative ⬆️ requires trust  │
│    Agent'lar mustaqilroq ishlaydi   │
│    Agent trust score: 0.72 ✅        │
│                                     │
│  ○ Autonomous 🔒 locked             │
│    Trust score 0.8 kerak (0.72)     │
│                                     │
│  [Save Changes]                     │
└─────────────────────────────────────┘
```

---

## Versiya

- v1.0
- Status: **APPROVED**
