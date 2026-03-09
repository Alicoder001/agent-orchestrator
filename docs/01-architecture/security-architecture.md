# Security Architecture

## Maqsad

Ushbu hujjat platformaning xavfsizlik arxitekturasini belgilaydi: autentifikatsiya, avtorizatsiya, secrets boshqaruvi, va audit mexanizmlari.

Bu hujjat `bounded-contexts.md` (Identity Context), `system-context.md` (trust chegaralari), va `domain-model.md` (Member rollari) ga asoslanadi.

---

## Security Goals

Platformaning xavfsizlik maqsadlari to'rtta yo'nalishda:

| Goal | Tavsif |
|------|--------|
| **Authentication** | Foydalanuvchi kim ekanini ishonchli aniqlash |
| **Authorization** | Foydalanuvchi nima qila olishini nazorat qilish |
| **Audit** | Barcha muhim harakatlarni o'zgarmas tarzda qayd etish |
| **Data protection** | Transit va rest holatda ma'lumotlarni himoya qilish |

---

## Authentication and Authorization

### Auth model

Platform-managed auth service. Tashqi auth provider (Ory, Keycloak) v1 da ishlatilmaydi — lekin interface sifatida ajratilgan bo'lib, keyinroq almashtirilishi mumkin.

### Auth flows (v1)

#### Email/password registration

```
POST /auth/register
  → email + password qabul qilinadi
  → password bcrypt bilan hash qilinadi (cost = 12)
  → user yaratiladi
  → personal organization avtomatik yaratiladi
  → JWT access token + refresh token qaytariladi
```

#### Email/password login

```
POST /auth/login
  → email + password tekshiriladi
  → bcrypt.CompareHashAndPassword
  → JWT access token (15 daqiqa) qaytariladi
  → Refresh token (7 kun) httpOnly cookie sifatida o'rnatiladi
```

#### GitHub OAuth

```
GET /auth/github
  → GitHub OAuth authorize URL'ga redirect
  → Callback: authorization code → access token
  → GitHub user ma'lumotlari olinadi
  → Platform user yaratiladi yoki bog'lanadi
  → JWT access token + refresh token qaytariladi
```

#### Token refresh

```
POST /auth/refresh
  → httpOnly cookie'dagi refresh token tekshiriladi
  → Yangi access token qaytariladi
  → Yangi refresh token rotate qilinadi (token rotation)
```

### JWT structure

```json
{
  "header": {
    "alg": "RS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user_id (UUID)",
    "org_id": "current_org_id (UUID)",
    "role": "owner | admin | operator | viewer",
    "iat": 1709980800,
    "exp": 1709981700
  }
}
```

**Qoidalar:**
- Access token: 15 daqiqa TTL, stateless validation
- Refresh token: 7 kun TTL, database'da saqlanadi, rotation
- Signing: RS256 (asymmetric) — public key frontend/service'larda verification uchun
- Token blacklist: logout va revoke uchun Redis set (TTL = remaining token lifetime)

### API token model

Developer va automation uchun long-lived, scoped token:

| Field | Tavsif |
|-------|--------|
| `id` | UUID v7 |
| `name` | Token nomi (foydalanuvchi beradi) |
| `token_hash` | SHA-256 hash (plaintext faqat yaratilganda ko'rsatiladi) |
| `scope` | `org:{org_id}` yoki `project:{project_id}` yoki `global` |
| `permissions` | `read`, `write`, `admin` (scope ichida) |
| `created_by` | User ID |
| `created_at` | Timestamp |
| `last_used_at` | Oxirgi ishlatilgan vaqt |
| `expires_at` | Tugash vaqti (NULL = cheksiz) |
| `revoked_at` | Bekor qilingan vaqt (NULL = faol) |

**Qoidalar:**
- Token plaintext faqat birinchi marta qaytariladi — keyin hash saqlanadi
- Har bir API so'rovda `Authorization: Bearer ao_xxxx` header ishlatiladi
- Token scope'dan tashqari operatsiya qilib bo'lmaydi
- Revoke qilingan token darhol ishlamay qoladi

---

## RBAC Model

### Role-permission mapping

Role'lar `domain-model.md` Member entity'sida belgilangan (owner, admin, operator, viewer).

| Permission | owner | admin | operator | viewer |
|-----------|-------|-------|----------|--------|
| org.create | ✅ | ❌ | ❌ | ❌ |
| org.update | ✅ | ❌ | ❌ | ❌ |
| org.delete | ✅ | ❌ | ❌ | ❌ |
| org.billing | ✅ | ❌ | ❌ | ❌ |
| member.invite | ✅ | ✅ | ❌ | ❌ |
| member.remove | ✅ | ✅ | ❌ | ❌ |
| member.role_change | ✅ | ✅ | ❌ | ❌ |
| team.create | ✅ | ✅ | ❌ | ❌ |
| team.update | ✅ | ✅ | ❌ | ❌ |
| team.delete | ✅ | ✅ | ❌ | ❌ |
| project.create | ✅ | ✅ | ❌ | ❌ |
| project.update | ✅ | ✅ | ✅ | ❌ |
| project.read | ✅ | ✅ | ✅ | ✅ |
| project.archive | ✅ | ✅ | ❌ | ❌ |
| session.spawn | ✅ | ✅ | ✅ | ❌ |
| session.send_message | ✅ | ✅ | ✅ | ❌ |
| session.kill | ✅ | ✅ | ✅ | ❌ |
| session.read | ✅ | ✅ | ✅ | ✅ |
| session.merge | ✅ | ✅ | ✅ | ❌ |
| agent_slot.configure | ✅ | ✅ | ❌ | ❌ |
| api_token.create | ✅ | ✅ | ✅ | ❌ |
| api_token.revoke | ✅ | ✅ | ✅ (own) | ❌ |
| audit_log.read | ✅ | ✅ | ❌ | ❌ |

### RBAC implementation

- Middleware sifatida Chi router'ga qo'shiladi
- JWT payload'dagi `role` field'dan permission tekshiriladi
- Org-specific permission: `org_id` JWT'dan olinadi va resource ownership tekshiriladi
- Permission denied = `403 Forbidden` + audit log yoziladi

---

## Secrets and Configuration

### Environment strategy

| Muhit | Strategy |
|-------|----------|
| Local development | `.env` fayl (`.env.example` versioned, `.env` gitignored) |
| CI/CD | GitHub Actions secrets / environment variables |
| Production | Container environment variables (injected at deploy time) |

### Secret turlari

| Secret | Qayerda saqlanadi | Qoidasi |
|--------|--------------------|---------|
| DB connection string | Environment variable | Kodda HECH QACHON yo'q |
| JWT signing key (RSA) | Environment variable / file path | Private key faqat backend'da |
| GitHub OAuth client secret | Environment variable | Faqat backend'da |
| Redis connection string | Environment variable | Kodda HECH QACHON yo'q |
| API token hash salt | Environment variable | Per-environment unique |

### .env.example

```bash
# Database
DATABASE_URL=postgres://user:password@localhost:5432/agent_orchestrator?sslmode=disable

# Redis
REDIS_URL=redis://localhost:6379/0

# JWT
JWT_PRIVATE_KEY_PATH=./keys/private.pem
JWT_PUBLIC_KEY_PATH=./keys/public.pem
JWT_ACCESS_TTL=15m
JWT_REFRESH_TTL=168h

# GitHub OAuth
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_REDIRECT_URL=http://localhost:3000/auth/github/callback

# Server
API_PORT=8080
API_ENV=development
```

### Qat'iy qoidalar

- `.env` fayl git'ga HECH QACHON commit qilinmaydi
- API key, token, password kod ichiga yoki hujjatga YOZILMAYDI (repo-governance.md qoidasi #7)
- Production'da secrets rotation policy belgilanadi (keyinroq)

---

## Agent execution security

### Trust model

`system-context.md` trust chegaralariga asoslangan:

```
HIGH TRUST    → Platform Backend (Go) — barcha operatsiyalar
MEDIUM TRUST  → Desktop App (Tauri) — authenticated, local
MEDIUM TRUST  → Web App (Next.js) — authenticated session
LOW TRUST     → CLI — authenticated, headless
LOW TRUST     → VS Code Extension — limited scope
UNTRUSTED     → Webhook incoming — HMAC signature required
UNTRUSTED     → AI Agent output — NEVER directly executed
```

### Agent izolyatsiya qoidalari

- Agent output to'g'ridan OS'ga yetib bormaydi — runtime adapter orqali o'tadi
- Agent faqat o'zining tmux session / workspace ichida ishlaydi
- Agent boshqa agent'ning workspace'iga kira olmaydi
- Agent platformaning internal API'siga to'g'ridan chaqira olmaydi
- Agent yozgan kod human approval'siz merge qilinmaydi (OQ-007 qarori)

### Webhook security

- Kiruvchi webhook'lar HMAC-SHA256 signature bilan tekshiriladi
- Signature noto'g'ri = `401 Unauthorized`, request reject
- Webhook secret per-integration saqlanadi

---

## Audit and Compliance

### Audit log scope

Quyidagi event'lar audit_log'ga yoziladi:

| Category | Events |
|----------|--------|
| Auth | user.registered, user.logged_in, user.logged_out, user.password_changed |
| Token | api_token.created, api_token.revoked, api_token.used |
| Org | organization.created, member.invited, member.removed, role.changed |
| Session | session.spawned, session.killed, session.merged, session.message_sent |
| Security | auth.failed, permission.denied, webhook.signature_invalid |

### Audit log structure

```json
{
  "id": "UUID v7",
  "timestamp": "ISO 8601",
  "actor_id": "user_id yoki system",
  "actor_type": "user | agent | system",
  "action": "session.spawned",
  "resource_type": "session",
  "resource_id": "UUID",
  "org_id": "UUID",
  "metadata": {},
  "ip_address": "optional",
  "user_agent": "optional"
}
```

### Qoidalar

- Audit log **immutable** — o'chirilmaydi, o'zgartirilmaydi
- Retention: minimum 1 yil (production'da)
- Audit log UI Phase 5 da quriladi, lekin log collection Phase 1 dan boshlanadi

---

## Versiya

- v1.0
- Status: **APPROVED**
- Keyingi ko'rib chiqish: Phase 1b (Identity Context) implementation boshlangandan keyin
