# Operator Dashboard Model

## Maqsad

Ushbu hujjat platformaning asosiy foydalanuvchi interfeysi — operator dashboard'ining tuzilishi, ko'rinishi va interaksiya modelini belgilaydi.

Bu hujjat `collaboration-model.md` (attention system), `user-personas.md` (persona ehtiyojlari) va `surface-and-access-model.md` ga asoslanadi.

---

## Dashboard maqsadi

Dashboard — operatorning "buyruq markazi" (command center). Bitta ekranda quyidagilar ko'rinadi:

1. **Barcha agent'lar nima qilyapti** (hozirgi status)
2. **Qaerda diqqat kerak** (attention zones)
3. **Sprint progress** (done / in-progress / blocked)

---

## Dashboard Layout

```
┌─────────────────────────────────────────────────────────┐
│  ┌─────┐  Agent Orchestrator  [Org: Acme Corp ▾] [👤]  │
│  │Logo │                                                │
├──┴─────┴────────────────────────────────────────────────┤
│  ┌────────┐                                             │
│  │Sidebar │  ┌──────────────────────────────────────┐   │
│  │        │  │        Main Content Area             │   │
│  │ 📊 Dash│  │                                      │   │
│  │ 📁 Proj│  │  ┌──────┐ ┌──────┐ ┌──────┐        │   │
│  │ 👥 Team│  │  │Metric│ │Metric│ │Metric│        │   │
│  │ ⚙️ Set │  │  │Card 1│ │Card 2│ │Card 3│        │   │
│  │        │  │  └──────┘ └──────┘ └──────┘        │   │
│  │        │  │                                      │   │
│  │        │  │  ┌──────────────────────────────┐    │   │
│  │        │  │  │     Active Sessions Grid      │    │   │
│  │        │  │  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐ │    │   │
│  │        │  │  │  │Sess│ │Sess│ │Sess│ │Sess│ │    │   │
│  │        │  │  │  │ 1  │ │ 2  │ │ 3  │ │ 4  │ │    │   │
│  │        │  │  │  └────┘ └────┘ └────┘ └────┘ │    │   │
│  │        │  │  └──────────────────────────────┘    │   │
│  └────────┘  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## Dashboard Components

### 1. Metric Cards (Top)

| Card | Ma'lumot | Real-time |
|------|----------|-----------|
| Active Sessions | Hozirgi ishlaydigan session soni | SSE ✅ |
| Attention Required | `critical` + `response` zone session soni | SSE ✅ |
| Today's Merged PRs | Bugungi merge soni | SSE ✅ |

### 2. Session Grid (Main)

Har bir session card:

```
┌─────────────────────────────────┐
│ 🟢 Working          [Backend]  │  ← status + team badge
│ "Fix auth middleware"           │  ← task title
│ Agent: cursor-backend           │  ← agent name
│ Project: api-server             │  ← project
│ Duration: 23 min                │  ← elapsed
│ ▓▓▓▓▓▓▓▓░░ 80%                │  ← progress (estimated)
└─────────────────────────────────┘
```

**Attention color coding:**
- 🟢 Verde — quiet (agent ishlayapti)
- 🔵 Ko'k — info (status o'zgardi)
- 🟡 Sariq — response (javob kerak)
- 🔴 Qizil — critical (darhol harakat)

### 3. Sidebar Navigation

| Item | Route |
|------|-------|
| Dashboard | `/` |
| Projects | `/projects` |
| Teams | `/teams` |
| Sessions | `/sessions` (archive'lar bilan) |
| Settings | `/settings` |

---

## Page'lar

### Project Detail Page

```
/projects/:slug
  ├── Overview (README, stats)
  ├── Tasks (Kanban board)
  ├── Sessions (active + history)
  └── Settings (visibility, mode, agents)
```

### Session Detail Page

```
/sessions/:id
  ├── Status bar (live status, attention zone)
  ├── Terminal output (live stream)
  ├── File changes (diff view)
  ├── Timeline (event history)
  └── Actions (send message, kill, merge)
```

---

## Responsive Design

| Breakpoint | Layout |
|-----------|--------|
| Desktop (> 1024px) | Sidebar + full grid |
| Tablet (768-1024px) | Collapsible sidebar + reduced grid |
| Mobile (< 768px) | Bottom nav + list view (grid o'rniga) |

---

## Versiya

- v1.0
- Status: **APPROVED**
