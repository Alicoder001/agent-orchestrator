# Bounded Contexts

## Maqsad

Ushbu hujjat platformaning domain chegaralarini belgilaydi. Har bir context o'z ichida mustaqil — boshqa context'lar bilan faqat aniq shartnoma (contract) orqali gaplashadi.

Bu hujjat domain-model.md'ga asoslanadi. Agar domain model o'zgarsa, bu hujjat ham ko'rib chiqiladi.

---

## Asosiy prinsip

Har bir bounded context:
- O'z entity'lariga to'liq egalik qiladi
- Boshqa context'dan to'g'ridan ma'lumot o'qimaydi
- Faqat event yoki API orqali muloqot qiladi
- O'z database schema'siga ega (mantiqan, fizik ajratish keyinroq)

---

## Context'lar ro'yxati

### 1. Identity Context

**Mas'uliyat:** Kim kimligini bilish — autentifikatsiya va avtorizatsiya.

**Owns:**
- User (email, password hash, profile)
- Session token / refresh token
- OAuth connection (GitHub, Google)
- API token

**Provides:**
- `who is this token?` → UserId + OrgId + Role
- `does this user have permission X in org Y?`

**Consumes:**
- Hech narsa — Identity eng pastki qatlam, u hech kimga bog'liq emas

**Events (chiqaradi):**
- `user.registered`
- `user.logged_in`
- `api_token.created`
- `api_token.revoked`

---

### 2. Organization Context

**Mas'uliyat:** Tashkilot tuzilmasini boshqarish — org, department, team, membership.

**Owns:**
- Organization
- Department
- Team
- Membership (User ↔ Org bog'lanishi va roli)
- AgentSlot
- AgentDefinition

**Provides:**
- `what teams exist in org X?`
- `what agents are in team Y?`
- `what is user Z's role in org X?`

**Consumes:**
- Identity Context: UserId validatsiya uchun

**Events (chiqaradi):**
- `organization.created`
- `team.created`
- `member.invited`
- `member.role_changed`
- `agent_slot.configured`

---

### 3. Project Context

**Mas'uliyat:** Ish maydonlarini boshqarish — project, workflow, task.

**Owns:**
- Project
- Workflow
- WorkflowStage
- Task
- TeamAssignment (qaysi team qaysi projectda)

**Provides:**
- `what projects exist in org X?`
- `what tasks are in project Y?`
- `what workflow does project Z follow?`

**Consumes:**
- Organization Context: Team va AgentSlot ma'lumotlari uchun
- Identity Context: permission tekshirish uchun

**Events (chiqaradi):**
- `project.created`
- `project.archived`
- `task.created`
- `task.status_changed`
- `workflow.stage_advanced`

---

### 4. Orchestration Context

**Mas'uliyat:** Agent session'larini yaratish, boshqarish, kuzatish — platformaning ijro yadro'si.

**Owns:**
- Session
- SessionEvent
- SessionMetadata (disk'da saqlanadigan runtime holat)

**Provides:**
- `what sessions are active in project X?`
- `what is the current status of session Y?`
- `spawn a new session for task Z`
- `send message to session Y`
- `kill session Y`

**Consumes:**
- Project Context: Task ma'lumotlari uchun
- Organization Context: AgentSlot konfiguratsiyasi uchun
- Runtime Adapter: haqiqiy process boshqarish uchun
- SCM Adapter: PR/branch ma'lumotlari uchun

**Events (chiqaradi):**
- `session.spawned`
- `session.status_changed`
- `session.pr_created`
- `session.ci_updated`
- `session.needs_input`
- `session.merged`
- `session.killed`
- `session.failed`

---

### 5. Realtime Context

**Mas'uliyat:** Event'larni frontend'ga uzatish — WebSocket va SSE transport.

**Owns:**
- WebSocket connection registry
- SSE stream registry
- Event fan-out logic

**Provides:**
- Live event stream (subscription bo'yicha)
- Connection health

**Consumes:**
- Barcha context'lardan event'lar (event bus orqali)

**Events (chiqaradi):**
- Hech narsa — u faqat uzatadi, chiqarmaydi

---

### 6. Notification Context

**Mas'uliyat:** Tashqi kanal orqali xabar yuborish.

**Owns:**
- NotificationPreference
- NotificationLog

**Provides:**
- Kanal konfiguratsiyasi (Slack, email, desktop, webhook)

**Consumes:**
- Barcha context'lardan critical event'lar
- Identity Context: foydalanuvchi ma'lumotlari uchun

**Events (chiqaradi):**
- `notification.sent`
- `notification.failed`

---

### 7. Audit Context

**Mas'uliyat:** Barcha muhim harakatlarni o'zgarmas tarzda qayd etish.

**Owns:**
- AuditLog (immutable)

**Provides:**
- Audit trail query

**Consumes:**
- Barcha context'lardan barcha event'lar

**Events (chiqaradi):**
- Hech narsa — u faqat yozadi

---

## Context'lar o'rtasida muloqot qoidalari

### Sinxron muloqot (HTTP/gRPC)
Faqat quyidagi holatlarda:
- Real-time permission tekshirish
- Spawn vaqtida konfiguratsiya olish
- User-triggered action

### Asinxron muloqot (Event Bus)
Asosiy usul. Har bir context o'z event'ini chiqaradi va boshqa context'lar subscribe bo'ladi.

### Qat'iy taqiq
- Context boshqa context'ning database jadvaliga to'g'ridan SQL yozmaydi
- Context boshqa context'ning ichki servisini to'g'ridan chaqirmaydi
- Shared mutable state yo'q

---

## Ownership xaritasi

```
Identity         → user, token
Organization     → org, dept, team, member, agent_definition, agent_slot
Project          → project, workflow, task, team_assignment
Orchestration    → session, session_event, session_metadata
Realtime         → ws_connection, sse_stream
Notification     → notification_pref, notification_log
Audit            → audit_log
```

---

## Versiya

- v1.0
- Status: **APPROVED**
- Keyingi ko'rib chiqish: System Context hujjati va ADR'lar yozilgandan keyin
