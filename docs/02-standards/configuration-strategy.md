# Configuration Strategy

## Maqsad

Ushbu hujjat platformadagi barcha konfiguratsiya qatlamlarini, manbalari va validatsiya qoidalarini belgilaydi.

Bu hujjat `security-architecture.md` (secrets), `application-architecture.md` (config loader) va `final-technology-stack.md` ga asoslanadi.

---

## Konfiguratsiya qatlamlari

Platformada konfiguratsiya 4 ta qatlamda boshqariladi:

```
┌──────────────────────────────────┐
│  Layer 4: Runtime Override       │  ← CLI flag, hot-reload (keyinroq)
├──────────────────────────────────┤
│  Layer 3: Environment Variable   │  ← .env yoki container env
├──────────────────────────────────┤
│  Layer 2: Config File            │  ← config.yaml (ixtiyoriy, keyinroq)
├──────────────────────────────────┤
│  Layer 1: Code Default           │  ← Go struct default
└──────────────────────────────────┘
```

**Ustunlik tartibi:** Layer 4 > Layer 3 > Layer 2 > Layer 1

**V1 uchun:** faqat Layer 1 (code default) va Layer 3 (environment variable) ishlatiladi.

---

## Environment Variables

### Majburiy (V1)

| Variable | Tavsif | Misol |
|----------|--------|-------|
| `DATABASE_URL` | PostgreSQL connection string | `postgres://user:pass@localhost:5432/agent_orchestrator?sslmode=disable` |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379/0` |
| `JWT_PRIVATE_KEY_PATH` | RSA private key fayl yo'li | `./keys/private.pem` |
| `JWT_PUBLIC_KEY_PATH` | RSA public key fayl yo'li | `./keys/public.pem` |
| `API_PORT` | HTTP server port | `8080` |
| `API_ENV` | Environment nomi | `development` \| `staging` \| `production` |

### Ixtiyoriy (V1)

| Variable | Tavsif | Default |
|----------|--------|---------|
| `JWT_ACCESS_TTL` | Access token muddati | `15m` |
| `JWT_REFRESH_TTL` | Refresh token muddati | `168h` (7 kun) |
| `GITHUB_CLIENT_ID` | GitHub OAuth client ID | — |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth client secret | — |
| `GITHUB_REDIRECT_URL` | OAuth callback URL | `http://localhost:3000/auth/github/callback` |
| `LOG_LEVEL` | Log darajasi | `info` |
| `LOG_FORMAT` | Log formati | `json` |
| `DB_MAX_CONNECTIONS` | PostgreSQL max pool | `25` |
| `DB_MIN_CONNECTIONS` | PostgreSQL min pool | `5` |
| `REDIS_MAX_CONNECTIONS` | Redis max pool | `10` |

---

## Go Config Loader

Typed config struct — hech qanday `os.Getenv` tarqoq ishlatish yo'q:

```go
type Config struct {
    API      APIConfig
    Database DatabaseConfig
    Redis    RedisConfig
    JWT      JWTConfig
    GitHub   GitHubConfig
    Log      LogConfig
}

type APIConfig struct {
    Port int    `env:"API_PORT" envDefault:"8080"`
    Env  string `env:"API_ENV" envDefault:"development"`
}

type DatabaseConfig struct {
    URL            string `env:"DATABASE_URL,required"`
    MaxConnections int    `env:"DB_MAX_CONNECTIONS" envDefault:"25"`
    MinConnections int    `env:"DB_MIN_CONNECTIONS" envDefault:"5"`
}

type JWTConfig struct {
    PrivateKeyPath string        `env:"JWT_PRIVATE_KEY_PATH,required"`
    PublicKeyPath  string        `env:"JWT_PUBLIC_KEY_PATH,required"`
    AccessTTL      time.Duration `env:"JWT_ACCESS_TTL" envDefault:"15m"`
    RefreshTTL     time.Duration `env:"JWT_REFRESH_TTL" envDefault:"168h"`
}
```

**Qoidalar:**
- Barcha config `Config` struct orqali olinadi — `os.Getenv` to'g'ridan chaqirilmaydi
- `required` tag bilan belgilangan field yo'q bo'lsa — dastur **boshlanmaydi**
- Config faqat `main.go` da yuklanadi va dependency injection orqali uzatiladi
- Go kutubxonasi: `github.com/caarlos0/env/v11` yoki shunga o'xshash

---

## Muhit bo'yicha strategiya

| Muhit | Config manbai | Secrets manbai |
|-------|---------------|----------------|
| **Local development** | `.env` fayl | `.env` fayl (gitignored) |
| **CI/CD** | GitHub Actions env | GitHub Actions secrets |
| **Staging** | Container env | Secret manager / env |
| **Production** | Container env | Secret manager / env |

### `.env` fayli qoidalari

- `.env` fayl **hech qachon git'ga commit qilinmaydi** (`security-architecture.md` L210)
- `.env.example` versioned — barcha variable nomlari va default misollari bor
- `.env.example` da hech qanday haqiqiy secret bo'lmaydi
- `.env` fayl `api/` papkada — `docker compose` ham shu faylni ishlatadi

---

## Secrets Handling

`security-architecture.md` L162-212 ga asoslanadi:

| Secret turi | Qayerda | Qoidasi |
|-------------|---------|---------|
| DB password | Env variable | Kodda **HECH QACHON** |
| JWT private key | File path (env orqali) | Faqat backend process |
| OAuth client secret | Env variable | Faqat backend |
| Redis password | Env variable (agar bor) | Kodda yo'q |
| API token hash salt | Env variable | Per-environment unique |

### V1 Secrets rotation

- V1 da manual rotation — env variable o'zgartiriladi va service restart qilinadi
- Phase 5 da automated rotation strategiyasi quriladi

---

## Validation Rules

Config yuklanishda quyidagi tekshiruvlar bajariladi:

```go
func (c *Config) Validate() error {
    // Port range
    if c.API.Port < 1 || c.API.Port > 65535 {
        return errors.New("API_PORT must be 1-65535")
    }

    // Environment
    validEnvs := []string{"development", "staging", "production"}
    if !contains(validEnvs, c.API.Env) {
        return fmt.Errorf("API_ENV must be one of: %v", validEnvs)
    }

    // JWT key files mavjudligi
    if _, err := os.Stat(c.JWT.PrivateKeyPath); err != nil {
        return fmt.Errorf("JWT private key not found: %s", c.JWT.PrivateKeyPath)
    }

    // Database URL format
    if !strings.HasPrefix(c.Database.URL, "postgres://") {
        return errors.New("DATABASE_URL must start with postgres://")
    }

    return nil
}
```

**Startup davri:**
1. Config yuklanadi (env → struct)
2. Validation bajariladi
3. Xato bo'lsa — dastur **boshlanmaydi** (log + exit 1)
4. Hammasi yaxshi — config inject qilinadi

---

## Frontend Configuration

Next.js uchun:

```typescript
// Environment variable'lar
// NEXT_PUBLIC_ prefix — client-side accessible
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:8080/ws

// Server-only
API_INTERNAL_URL=http://api:8080/api/v1
```

**Qoidalar:**
- Client-side env faqat `NEXT_PUBLIC_` prefix bilan
- Secret hech qachon `NEXT_PUBLIC_` bilan berlanmaydi
- API URL runtime'da o'zgartirilishi mumkin (config endpoint orqali — keyinroq)

---

## Versiya

- v1.0
- Status: **APPROVED**
- Keyingi ko'rib chiqish: Phase 1 Sprint 1 tugagandan keyin
