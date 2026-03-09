# Chat and Command Surface

## Maqsad

Ushbu hujjat platformadagi chat interfeysi va command tizimini — operator-agent kommunikatsiya surface'ini belgilaydi.

Bu hujjat `collaboration-model.md` (session communication), `operator-dashboard-model.md` va `realtime-architecture.md` ga asoslanadi.

---

## Chat Surface

Session detail page'dagi asosiy interaksiya joyi:

```
┌──────────────────────────────────────┐
│  Session: Fix auth middleware  🟢    │
├──────────────────────────────────────┤
│                                      │
│  [System] Session started            │
│  [Agent] Analyzing codebase...       │
│  [Agent] Found issue in handler.go   │
│  [Agent] ┌─ handler.go (diff) ────┐  │
│           │ -  token := ""         │  │
│           │ +  token, err := ...   │  │
│           └────────────────────────┘  │
│  [Agent] I've fixed the bug and      │
│          added a test.               │
│  [System] CI running...              │
│  [System] CI passed ✅               │
│  [Agent] PR created: #42             │
│                                      │
├──────────────────────────────────────┤
│  ┌──────────────────────────┐  [Send]│
│  │ Type a message...        │        │
│  └──────────────────────────┘        │
│  [📎 Attach] [/ Commands]           │
└──────────────────────────────────────┘
```

---

## Message Types Rendering

| Type | Rendering | Misol |
|------|-----------|-------|
| `user_message` | Right-aligned, blue bubble | Operator yozgan xabar |
| `agent_message` | Left-aligned, gray bubble | Agent javobi |
| `system_event` | Center, muted text | "CI passed", "Status changed" |
| `file_change` | Inline diff block | Code diff |
| `terminal_output` | Monospace block (collapsible) | Terminal natijasi |

---

## Command System

`/` bilan boshlanadigan quick actions:

| Command | Tavsif | Misol |
|---------|--------|-------|
| `/spawn` | Yangi session boshlash | `/spawn cursor-backend task-42` |
| `/kill` | Session to'xtatish | `/kill` (hozirgi session) |
| `/status` | Session status olish | `/status` |
| `/retry` | Session qayta boshlash | `/retry` (failed session) |
| `/merge` | PR merge qilish | `/merge` |
| `/assign` | Task assign qilish | `/assign @agent-name task-42` |
| `/context` | Context qo'shish | `/context file:handler.go` |
| `/help` | Barcha command'lar ro'yxati | `/help` |

### Command Palette (global)

`Ctrl+K` — session'dan tashqarida ham ishlaydi:

```
> spawn session for api-server
> show all critical sessions
> kill session #42
> open project web-dashboard
```

---

## Real-time Features

| Feature | Implementation | Phase |
|---------|---------------|-------|
| Live message stream | SSE (V1), WebSocket (V2) | V1 |
| Terminal live output | SSE stream | V1 |
| Typing indicator | — | V2 |
| File change notifications | Event bus → SSE | V1 |
| Agent thinking indicator | Animated dots | V1 |

---

## Versiya

- v1.0
- Status: **APPROVED**
