# Domain Map

## Maqsad

Ushbu hujjat platformaning domain chegaralarini yuqori darajada xaritalaydi. Yangi kishi loyihaga kirganda, birinchi 5 daqiqada "platforma nima haqida" degan savolga javob berishi kerak.

Bu hujjat `domain-model.md` (entity detail) va `bounded-contexts.md` (context chegaralari) ning qisqacha ko'rinishidir.

---

## Core Domains

### Organization Management

Tashkilot tuzilmasini boshqarish — kimlar ishlaydi, qanday tuzilgan.

**Entity'lar:** Organization, Department, Team, Membership, AgentDefinition, AgentSlot

**Owner:** Organization Context

**Asosiy savol:** "Kim qaysi jamoadagi qaysi agent bilan ishlaydi?"

---

### Project Execution

Ish maydonlarini boshqarish — qayerda va qanday tartibda ishlaydi.

**Entity'lar:** Project, Workflow, WorkflowStage, Task, TeamAssignment

**Owner:** Project Context

**Asosiy savol:** "Qaysi loyihada qanday ish ketma-ketligida nima bajarilmoqda?"

---

### Agent Orchestration

Agent session'larini yaratish, boshqarish, kuzatish — platformaning ijro yadrosi.

**Entity'lar:** Session, SessionEvent, SessionMetadata

**Owner:** Orchestration Context

**Asosiy savol:** "Agent hozir nima qilmoqda, qayerda bloklangan, qachon tugaydi?"

---

## Supporting Domains

### Identity & Access

Autentifikatsiya va avtorizatsiya — platformaga kim kirayotganini aniqlash.

**Entity'lar:** User, SessionToken, OAuthConnection, APIToken

**Owner:** Identity Context

---

### Realtime Transport

Event'larni clientlarga yetkazish — platforma "tirik" bo'lib ko'rinishi.

**Entity'lar:** WebSocket connection, SSE stream, Event fanout

**Owner:** Realtime Context

---

### Notification

Tashqi kanal orqali xabar yuborish — foydalanuvchini platforma tashqarisida ham xabardor qilish.

**Entity'lar:** NotificationPreference, NotificationLog

**Owner:** Notification Context

---

### Audit

Barcha muhim harakatlarni o'zgarmas tarzda qayd etish — nima sodir bo'lganining doimiy izi.

**Entity'lar:** AuditLog (immutable)

**Owner:** Audit Context

---

## Shared Concepts

| Concept | Tavsif |
|---------|--------|
| **Event** | Context'lar orasidagi asinxron muloqot birligi |
| **Policy** | Org va platform darajasidagi qoidalar (RBAC, approval, scope) |
| **Scope** | Entity ko'rinish chegarasi: platform / org / team / project / session |
| **Attention** | Operator e'tiborini talab qilish darajasi: critical / needs_action / monitoring / done |

---

## Boundary Notes

- Core domain'lar bitta modular monolith ichida, lekin alohida PostgreSQL schema da yashaydi
- Supporting domain'lar core'ga to'g'ridan bog'liq emas — event bus orqali subscribe qiladi
- Identity Context eng pastki qatlam — u hech qanday boshqa context'ga bog'liq emas
- Orchestration Context eng ko'p tashqi bog'liqlikka ega — runtime adapter, SCM adapter
- Context'lar orasida to'g'ridan SQL yoki struct sharing **taqiqlangan**

---

## Domain vizualizatsiyasi

```
┌──────────────────────────────────────────────────────┐
│                    CORE DOMAINS                       │
│                                                       │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐ │
│  │Organization │  │  Project    │  │ Orchestration│ │
│  │ Management  │──│  Execution  │──│              │ │
│  │             │  │             │  │              │ │
│  └─────────────┘  └─────────────┘  └──────────────┘ │
│                                                       │
├───────────────────────────────────────────────────────┤
│                 SUPPORTING DOMAINS                    │
│                                                       │
│  ┌────────┐ ┌──────────┐ ┌────────────┐ ┌─────────┐│
│  │Identity│ │ Realtime │ │Notification│ │  Audit  ││
│  └────────┘ └──────────┘ └────────────┘ └─────────┘│
│                                                       │
├───────────────────────────────────────────────────────┤
│                   SHARED CONCEPTS                     │
│         Event  ·  Policy  ·  Scope  ·  Attention     │
└──────────────────────────────────────────────────────┘
```

---

## Versiya

- v1.0
- Status: **APPROVED**
- Keyingi ko'rib chiqish: bounded-contexts.md yoki domain-model.md o'zgarganda
