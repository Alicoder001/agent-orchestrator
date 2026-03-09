# Agent Operating Model

## Purpose

Define how AI agents participate in delivery without creating coordination chaos.

## Core Model

- Agents work within explicit scopes.
- Agents should update their own worklogs.
- Shared summaries should be short and checkpoint-based.
- Agents should not overwrite each other's active logs.

---

## Coordination Rules

### Session ownership

- Bitta task'ga bitta aktiv session — parallel session bir xil task da **taqiqlangan**
- Session yaratilganda agent task scope'ini va branch'ini oladi
- Agent faqat o'z branch'ida ishlaydi — boshqa agent yoki inson branch'iga tegmaydi

### Workspace izolyatsiya

- Har bir agent o'z workspace papkasida ishlaydi
- Shared file edit faqat operator ko'rsatmasi bilan amalga oshiriladi
- Agent boshqa agent'ning workspace'iga kira olmaydi

### Branch naming

```
agent/{agent-id}/{task-id}-{qisqa-tavsif}
```

Misol: `agent/eng-001/task-42-add-session-api`

### Birgalikda ishlash qoidasi

- Ikki agent bitta fayl'ni bir vaqtda o'zgartirishi **taqiqlangan**
- Agar conflict yuzaga kelsa — ikkala agent session **pause** holatiga o'tadi
- Operator conflict'ni hal qilgandan keyin session'lar davom ettiriladi

### Worklog discipline

- Har bir agent sessiya tugagandan keyin o'z worklog'ini yangilaydi
- Worklog formati: nima qilindi, nima muammo chiqdi, nima qoldi
- Worklog joyi: `docs/08-worklogs/agents/{agent-id}.md`

---

## Escalation Rules

### Avtomatik escalation trigger'lari

| Holat | Trigger | Session status |
|-------|---------|---------------|
| Agent 3 marta urinib natija olmasa | Auto-escalate | `needs_response` |
| CI 2 marta ketma-ket fail bo'lsa | Auto-escalate | `critical` |
| Agent'ning response vaqti 10 daqiqadan oshsa | Warning → escalate | `waiting_for_input` |
| Permission yetishmasa | Immediate escalate | `needs_response` |
| Task scope noaniq bo'lsa | Immediate escalate | `needs_response` |

### Escalation protocol

1. Agent muammoni SessionEvent sifatida qayd etadi (`error_occurred` yoki `agent_requested_input`)
2. Session status `needs_response` yoki `critical` ga o'tadi
3. Operator dashboard'da attention zone'da ko'rinadi
4. Notification channel'lar (Slack, desktop) orqali xabar yuboriladi
5. Operator javob berguncha agent **kutadi** — mustaqil hal qilmaydi

### Escalation qat'iy qoidasi

- Agent hech qachon o'zi hal qilib davom etmaydi agar scope noaniq bo'lsa
- Agent hech qachon permission'ni bypass qilmaydi
- Agent hech qachon boshqa agent'ning ishiga aralashmaydi

---

## Human Override Rules

### Operator qobiliyatlari

| Action | Tavsif | Audit |
|--------|--------|-------|
| **Send message** | Agent'ga yangi ko'rsatma yuborish | Ha |
| **Kill session** | Session'ni darhol to'xtatish | Ha |
| **Pause session** | Session'ni vaqtincha to'xtatish (agent idle) | Ha |
| **Resume session** | Pause qilingan session'ni davom ettirish | Ha |
| **Reassign task** | Task'ni boshqa agent'ga yoki team'ga berish | Ha |
| **Merge PR** | Agent yaratgan PR'ni merge qilish | Ha |
| **Reject PR** | PR'ni rad etish va agent'ga qayta ishlash ko'rsatmasi berish | Ha |

### Override qoidalari

- Agent operator ko'rsatmasini **rad eta olmaydi**
- Override vaqtida agent o'z holatini saqlaydi (restore mumkin)
- Barcha override'lar audit_log'ga yoziladi (kim, qachon, nima qildi)
- Kill qilingan session retry qilinishi mumkin (yangi session yaratiladi)
- Operator bir vaqtda bir nechta session'ni batch override qila oladi

### Override hierarxiyasi

```
Owner > Admin > Operator > Agent
```

- Owner va Admin barcha session'larni override qila oladi
- Operator faqat o'zi ko'ra oladigan session'larni override qila oladi
- Agent hech qanday override imkoniyatiga ega emas

---

## Versiya

- v1.0
- Status: **APPROVED**
- Keyingi ko'rib chiqish: Phase 2 (Orchestration Core) implementation boshlangandan keyin
