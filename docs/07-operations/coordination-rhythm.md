# Coordination Rhythm

## Maqsad

Ushbu hujjat jamoaviy ish ritmi — taktik va strategik uchrashuvlar, sinxronizatsiya mexanizmlari va sprint cadence'ini belgilaydi.

Bu hujjat `workstream-management.md` (reporting), `agent-operating-model.md` (agent coordination) va `implementation-sequencing.md` (sprint plan) ga asoslanadi.

---

## Ritm tuzilmasi

### Kunlik

| Ritual | Vaqt | Ishtirokchilar | Format | Maqsad |
|--------|------|----------------|--------|--------|
| Daily sync | 5 daqiqa (async) | Barcha contributors | Yozma (3 satr) | Done / Doing / Blocked |

**Format:**
```
✅ Done: Session spawn endpoint yozildi, test pass
🔄 Doing: PR review, definition-of-done checklist
🚫 Blocked: GitHub OAuth callback — CLIENT_SECRET kerak
```

**Agent daily sync:** Agent worklog'iga yozadi (`docs/08-worklogs/agents/{id}.md`). Operator ertalab ko'rib chiqadi.

### Haftalik

| Ritual | Vaqt | Ishtirokchilar | Format | Maqsad |
|--------|------|----------------|--------|--------|
| Weekly review | 30 daqiqa | Owner + active devs | Sync yoki async | Sprint progress, blocker triage |

**Agenda:**
1. Sprint board ko'rib chiqish (done, in-progress, blocked)
2. Blocker'lar hal qilish yoki escalate
3. Keyingi hafta priority aniqlash
4. Agent session natijalarini ko'rib chiqish

### Sprint (2 haftalik)

| Ritual | Vaqt | Ishtirokchilar | Format | Maqsad |
|--------|------|----------------|--------|--------|
| Sprint planning | 1 soat | Owner + devs | Sync | Keyingi sprint scope belgilash |
| Sprint review | 30 daqiqa | Owner + stakeholders | Demo | Natijalarni ko'rsatish |
| Sprint retro | 30 daqiqa | Owner + devs | Async/sync | Nima yaxshi / nima yomon / nima o'zgartirish |

### Oylik / Phase-level

| Ritual | Vaqt | Ishtirokchilar | Maqsad |
|--------|------|----------------|--------|
| Milestone review | 1 soat | Owner | Phase exit criteria tekshirish |
| Architecture review | 1 soat | Owner + architecture contributors | ADR'lar va arxitektura qarorlarini qayta ko'rish |

---

## Agent Coordination

### Session handoff

```
Operator → Agent:
  Task definition (Definition of Ready mos)
  Branch nomi
  Context (tegishli hujjatlar)

Agent → Operator:
  PR link
  Worklog update
  Blocker/follow-up qayd
```

### Parallel agent management

| Qoida | Tavsif |
|-------|--------|
| File-level locking | Ikki agent bir xil faylda ishlamaydi |
| Branch isolation | Har agent o'z branch'ida |
| Event notification | Agent done bo'lganda operator xabardor |
| Conflict resolution | Merge conflict → operator hal qiladi |

---

## Communication channels

| Kanal | Maqsad | Latency |
|-------|--------|---------|
| GitHub PR comments | Kod review, texnik discussion | Async (soatlar) |
| Worklog | Agent progress | Async (kunlik) |
| Status board | Sprint tracking | Real-time (platform UI) |
| Direct message (keyinroq) | Urgent blocker | Sync (daqiqalar) |

---

## Versiya

- v1.0
- Status: **APPROVED**
