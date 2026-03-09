# Collaboration Model

## Maqsad

Ushbu hujjat platformadagi hamkorlik mexanizmlarini — inson-agent, agent-agent va inson-inson interaksiyalarini belgilaydi.

Bu hujjat `agent-operating-model.md` (agent coordination), `domain-model.md` (Session, SessionEvent) va `bounded-contexts.md` ga asoslanadi.

---

## Collaboration turlari

### 1. Inson → Agent (Delegation)

Operatsiya: Operator agent'ga task beradi.

```
Operator:
  1. Task yaratadi (Definition of Ready mos)
  2. AgentSlot tanlaydi
  3. Session spawn qiladi
  4. Agent ishlaydi...
  5. Natijani review qiladi (PR, output)
```

**Communication channel:** Task description → Session → SessionEvent (message type)

### 2. Agent → Inson (Escalation)

Agent o'zi hal qila olmaydigan holatlar uchun:

| Holat | Signal | Inson harakati |
|-------|--------|---------------|
| Noaniq task | `needs_response` status | Task aniqlashtirish |
| Access kerak | `needs_response` + message | Permission berish |
| CI fail (tuzata olmaydi) | `needs_response` | Debug yordam |
| PR review | `review_requested` | Review + approve/reject |
| Merge | `ready_to_merge` | Merge button |
| Critical error | `failed` | Investigate |

### 3. Agent → Agent (Indirect)

V1 da agent'lar **to'g'ridan gaplashmaydi**. Faqat bilvosita:

```
Agent A ishlaydi → PR yaratadi
Agent B boshqa task'da A ning kodini ishlatadi (branch merge keyin)
```

**Conflict prevention:**
- File-level locking (ikki agent bir fayl'da ishlamaydi)
- Branch isolation (har agent o'z branch)
- Operator coordination (task dependency'lar operator tomonidan belgilanadi)

**Phase 3+:** Agent-to-agent direct messaging, shared workspace, collaborative debugging.

### 4. Inson → Inson

Platform orqali (V2+):
- PR comment + discussion
- Task assign va re-assign
- Sprint board orqali progress sharing

---

## Attention System

Inson diqqati — eng qimmat resurs. Platforma uni to'g'ri boshqarishi kerak.

### Attention zones (`domain-model.md` L235-254)

| Zone | Rang | Ma'no | Misol |
|------|------|-------|-------|
| `quiet` | Yashil | Hamma ishlayapti | No attention needed |
| `info` | Ko'k | Ma'lumot bor | Session tugadi, PR yaratildi |
| `response` | Sariq | Javob kerak | Agent savol berdi |
| `critical` | Qizil | Darhol harakat | CI fail, session crash |

### Aggregation

Dashboard darajasida attention aggregate qilinadi:

```
Organization attention = MAX(all project attentions)
Project attention = MAX(all session attentions in project)
Session attention = current status-based zone
```

**Misol:** Agar bitta session `critical` bo'lsa — butun project va org ham `critical` ko'rsatadi.

---

## Session Communication Protocol

### Message types

| Type | Yo'nalish | Tavsif |
|------|-----------|--------|
| `user_message` | Operator → Agent | Operator agent'ga yo'riqnoma beradi |
| `agent_message` | Agent → Operator | Agent natija yoki savol yuboradi |
| `system_event` | Platform → All | Status change, CI result |
| `file_change` | Agent → Platform | Agent fayl o'zgartirdi |
| `terminal_output` | Agent → Platform | Terminal natijasi (stream) |

### Session history

Barcha communication `SessionEvent` jadvalida saqlanadi — immutable, append-only.

---

## Versiya

- v1.0
- Status: **APPROVED**
