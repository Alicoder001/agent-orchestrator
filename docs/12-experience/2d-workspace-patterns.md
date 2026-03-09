# 2D Workspace Patterns

## Maqsad

Ushbu hujjat platformaning 2D spatial workspace interfeysini — canvas-based layout, drag-and-drop va spatial navigation modelini belgilaydi.

Bu hujjat `digital-office-model.md` (office metaphor) va `operator-dashboard-model.md` ga asoslanadi.

---

## 2D Workspace nima (V2+)

Grid yoki freeform canvas bo'lib, unda team'lar, agent'lar va session'lar spatial joylashgan. Haqiqiy ofisning yuqoridan ko'rinishi.

---

## Layout Patterns

### Pattern 1: Grid Layout

```
┌──────────┬──────────┬──────────┐
│ Backend  │ Frontend │   QA     │
│  Team    │  Team    │  Team    │
│ 🤖🤖🤖 │ 🤖🤖   │ 🤖      │
│ 3 active │ 1 idle   │ 1 active │
└──────────┴──────────┴──────────┘
```

**Use case:** Structured, formal tashkilot — department va team'lar aniq tartiblangan.

### Pattern 2: Cluster Layout

```
        🤖 🤖
      🤖 Backend 🤖
        🤖 🤖

  🤖 Frontend 🤖        🤖 QA
    🤖 🤖
```

**Use case:** Organic tashkilot — team'lar o'z joylarini tanlaydi, cluster sifatida ko'rinadi.

### Pattern 3: Kanban Spatial

```
┌─ Backlog ─┬─ Working ─┬─ Review ─┬─ Done ────┐
│ Task 1    │ 🤖 Task 3 │ Task 5   │ ✅ Task 7 │
│ Task 2    │ 🤖 Task 4 │ 🤖 Task 6│ ✅ Task 8 │
└───────────┴───────────┴──────────┴───────────┘
```

**Use case:** Project-focused ko'rinish — task'lar workflow bo'yicha joylashgan.

---

## Interaction Model

| Action | Input | Natija |
|--------|-------|--------|
| Pan | Mouse drag / scroll | Canvas harakat qiladi |
| Zoom | Mouse wheel / pinch | Zoom in/out |
| Select agent | Click | Agent detail panel ochiladi |
| Move team | Drag team container | Team joylashuvi o'zgaradi |
| Context menu | Right-click agent | Quick actions (kill, status, chat) |
| Double-click session | Double-click | Session detail page ochiladi |

---

## Canvas Technology

| Framework | Tavsif | Phase |
|-----------|--------|-------|
| **React Flow** (tavsiya) | Node-based canvas, React ecosystem | V2 |
| **PixiJS** | High-performance 2D rendering | V3 (agar zarurat) |
| **Three.js** | 3D uchun | V5 (`3d-world-strategy.md`) |

---

## Versiya

- v1.0
- Status: **APPROVED**
