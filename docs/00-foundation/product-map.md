# Product Map

## Maqsad

Ushbu hujjat platformaning product area'larini, foydalanuvchi yo'llarini, va har bir surface'ning asosiy vazifasini belgilaydi.

---

## Product area'lar

### 1. Orchestration Hub
**Nima:** Agent session'larini yaratish va boshqarish markazi.
**Kim ishlatadi:** Operator, Admin.
**Asosiy imkoniyatlar:**
- Session spawn (bitta yoki batch)
- Aktiv session monitoring
- Agent'ga message yuborish
- Session kill va restore
- PR merge

---

### 2. Operator Dashboard
**Nima:** Hamma aktiv ishni bir joyda ko'rish — attention-based view.
**Kim ishlatadi:** Operator, Viewer.
**Asosiy imkoniyatlar:**
- Attention zone'lar (critical → needs_action → monitoring → done)
- Session card'lar (status, PR, CI, branch)
- Real-time yangilanish
- Batch action'lar

---

### 3. Project Space
**Nima:** Bitta project uchun to'liq ish maydoni.
**Kim ishlatadi:** Operator, Admin, Viewer.
**Asosiy imkoniyatlar:**
- Workflow stage progress
- Task backlog va assignment
- Aktiv session'lar (bu project uchun)
- Team assignment

---

### 4. Organization Control
**Nima:** Tashkilot tuzilmasini boshqarish.
**Kim ishlatadi:** Admin, Owner.
**Asosiy imkoniyatlar:**
- Department va team boshqaruvi
- Member invite va rol assignment
- AgentDefinition va AgentSlot konfiguratsiyasi
- Notification routing

---

### 5. Session Inspector
**Nima:** Bitta session uchun to'liq tekshirish muhiti.
**Kim ishlatadi:** Operator.
**Asosiy imkoniyatlar:**
- Live terminal (xterm.js)
- PR card (CI, comments, merge readiness)
- Session event timeline
- Message send

---

### 6. Settings & Governance
**Nima:** Platforma va organization sozlamalari.
**Kim ishlatadi:** Admin, Owner.
**Asosiy imkoniyatlar:**
- API token boshqaruvi
- Audit log ko'rish
- Billing (keyinroq)
- SSO konfiguratsiyasi (keyinroq)

---

## Foydalanuvchi yo'llari

### Yo'l 1: Operator kundalik ish
```
Login
  → Dashboard (attention zone'larni ko'r)
    → Critical zone: session'ni oч, terminal ko'r, message yubor
    → Needs action zone: PR merge yoki comment javob ber
    → Monitoring zone: faqat kuzat
  → Yangi task kerakmi? → Spawn new session
  → Kech: done zone'ni cleanup qil
```

### Yo'l 2: Admin setup (yangi org uchun)
```
Signup → Organization yaratish
  → Department'lar yaratish (engineering, design, qa)
  → Team'lar yaratish (har department uchun)
  → AgentDefinition tanlash (claude-code, zai, ...)
  → AgentSlot'lar qo'shish (har team uchun)
  → Project yaratish (GitHub repo bog'lash)
  → Team'larni project'ga assign qilish
  → Workflow belgilash
  → Birinchi session spawn
```

### Yo'l 3: Yangi project boshlash
```
Project yaratish
  → GitHub repo ulash
  → Workflow stage'larini belgilash
  → Team'larni assign qilish
  → Mavjud issue'lardan task sync qilish
  → Batch spawn (bir nechta task bir vaqtda)
  → Dashboard'da kuzat
```

### Yo'l 4: Bloklangan session hal qilish
```
Dashboard → Critical zone
  → Session ochish
  → Terminal: xato o'qish
  → Message yuborish ("CI xatolarini hal qil, keyin push qil")
  → Monitoring zone'ga o'tguncha kuzat
  → PR tayyor bo'lganda merge
```

---

## Priority surfaces (v1)

| Surface | Priority | Sabab |
|---------|----------|-------|
| Operator Dashboard (web) | P0 | Asosiy ish joyi |
| Session Inspector (web) | P0 | Intervensiya uchun zarur |
| Organization Control (web) | P1 | Setup uchun zarur |
| CLI | P1 | Power user va automation |
| Desktop App | P2 | Local runtime uchun |
| Mobile | P3 | Faqat monitoring |
| VS Code Extension | P3 | Editor integration |

---

## Versiya

- v1.0
- Status: **APPROVED**
