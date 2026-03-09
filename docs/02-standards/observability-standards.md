# Observability Standards

## Maqsad

Ushbu hujjat platformadagi logging, metrics, tracing va operational signal standartlarini belgilaydi.

Bu hujjat `final-technology-stack.md` (observability stack), `deployment-architecture.md` (muhitlar) va `application-architecture.md` ga asoslanadi.

---

## Logging

### Log kutubxonasi

| Stack | Kutubxona | Format |
|-------|-----------|--------|
| Go | `log/slog` (stdlib, Go 1.21+) | JSON (production), text (development) |
| TypeScript | `pino` yoki `console` wrapper | JSON (server-side), console (client) |

### Log darajalari

| Daraja | Ishlatiladi | Misol |
|--------|-------------|-------|
| `ERROR` | Tizim xatosi, foydalanuvchiga ta'sir qiladi | DB connection lost, external API 500 |
| `WARN` | Potentsial muammo, hozircha ishlayapti | Rate limit yaqinlashdi, deprecated API |
| `INFO` | Muhim business event | User registered, session spawned, PR merged |
| `DEBUG` | Developer uchun detail | SQL query, event payload, config loaded |

### Structured logging formati

```go
// ✅ TO'G'RI — structured, context bilan
slog.Info("session spawned",
    "session_id", session.ID,
    "project_id", session.ProjectID,
    "agent_slot_id", session.AgentSlotID,
    "runtime", "tmux",
)

// ✅ Error bilan
slog.Error("failed to spawn session",
    "session_id", input.SessionID,
    "error", err.Error(),
    "retry_count", retryCount,
)

// ❌ NOTO'G'RI — unstructured
log.Printf("Session %s spawned for project %s", id, projectID)
```

### Majburiy log field'lar

| Field | Tavsif | Misol |
|-------|--------|-------|
| `timestamp` | ISO 8601 (slog auto) | `2026-03-09T14:00:00Z` |
| `level` | Log darajasi | `INFO`, `ERROR` |
| `msg` | Xabar | `session spawned` |
| `request_id` | HTTP request correlation ID | `req-abc123` |
| `user_id` | Authenticated user (agar bor) | `usr-xyz789` |
| `org_id` | Organization context | `org-abc456` |

### Log qoidalari

- Secret **hech qachon log qilinmaydi** (password, token, API key)
- PII (email, ism) faqat `DEBUG` da va development muhitda
- Request/response body faqat `DEBUG` da (body > 1KB bo'lsa truncate)
- Har bir request `request_id` bilan kuzatiladi (UUID middleware orqali)

---

## Metrics

### V1 Metrics Stack

| Component | Vosita |
|-----------|--------|
| Collection | Go `expvar` + custom HTTP endpoint |
| Format | JSON (V1), Prometheus (Phase 5) |
| Dashboard | — (V1 da CLI/API orqali, Phase 5 da Grafana) |

### Asosiy metrikalar

#### Application metrics

| Metrika | Turi | Tavsif |
|---------|------|--------|
| `http_requests_total` | Counter | Jami HTTP request soni |
| `http_request_duration_seconds` | Histogram | Request davomiyligi |
| `http_requests_by_status` | Counter | Status code bo'yicha |
| `active_sessions_count` | Gauge | Hozirgi aktiv session soni |
| `sessions_spawned_total` | Counter | Jami spawn qilingan session |
| `sessions_failed_total` | Counter | Failed session soni |
| `event_bus_published_total` | Counter | Event soni (type bo'yicha) |
| `event_bus_processing_errors_total` | Counter | Event processing xatolar |

#### Infrastructure metrics

| Metrika | Turi | Tavsif |
|---------|------|--------|
| `db_connections_active` | Gauge | Aktiv DB connection soni |
| `db_connections_idle` | Gauge | Idle DB connection soni |
| `db_query_duration_seconds` | Histogram | SQL query davomiyligi |
| `redis_connections_active` | Gauge | Aktiv Redis connection |
| `redis_command_duration_seconds` | Histogram | Redis command davomiyligi |

### Metrics endpoint

```
GET /api/internal/metrics       → JSON format (V1)
GET /api/internal/health        → Health check (below)
```

---

## Tracing

### V1 strategiyasi

V1 da to'liq distributed tracing yo'q (single process — `ADR-003`). O'rniga:

- **Request ID** — har bir HTTP request uchun UUID (middleware orqali inject)
- **Correlation ID** — event chain'da bir xil ID yuradi
- **Session ID** — session lifecycle davomida barcha log'larda

```go
// Middleware
func RequestIDMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        requestID := r.Header.Get("X-Request-ID")
        if requestID == "" {
            requestID = uuid.NewString()
        }
        ctx := context.WithValue(r.Context(), requestIDKey, requestID)
        w.Header().Set("X-Request-ID", requestID)
        next.ServeHTTP(w, r.WithContext(ctx))
    })
}
```

### Phase 5 tracing (keyinroq)

OpenTelemetry integration:
- Jaeger yoki Tempo (trace backend)
- Automatic HTTP instrumentation
- Database query tracing
- Event bus tracing

---

## Operational Signals

### Health check

```
GET /api/internal/health

Response (200 OK):
{
  "status": "healthy",
  "checks": {
    "database": { "status": "up", "latency_ms": 2 },
    "redis": { "status": "up", "latency_ms": 1 },
    "event_bus": { "status": "up" }
  },
  "version": "1.0.0",
  "uptime_seconds": 3600
}
```

**Health check qoidalari:**
- Har 30 soniyada internal check (liveness)
- External health check endpoint (readiness) — deploy va load balancer uchun
- Dependency down bo'lsa — `degraded` status (to'liq `unhealthy` emas, agar qism ishlasa)

### Alerting qoidalari (V1 — minimal)

| Signal | Threshold | Harakat |
|--------|-----------|---------|
| Health check fail (3x ketma-ket) | 3 consecutive | Restart trigger |
| Error rate > 5% (5 daqiqa window) | 5% | Log alert |
| Response time p95 > 2s | 2 seconds | Log warning |
| DB connection pool exhausted | 0 idle | Log error |
| Active sessions > 80% capacity | 80% | Log warning |

### Audit logging

`security-architecture.md` L251-270 asosida:

| Event | Log qilinadi | Immutable |
|-------|-------------|-----------|
| User login/logout | Ha | Ha |
| Member invite/remove | Ha | Ha |
| Role change | Ha | Ha |
| Session spawn/kill | Ha | Ha |
| PR merge | Ha | Ha |
| API token create/revoke | Ha | Ha |
| Permission denied | Ha | Ha |

Audit log'lar **alohida jadvalda**, soft-delete **yo'q** — faqat INSERT.

---

## Versiya

- v1.0
- Status: **APPROVED**
- Keyingi ko'rib chiqish: Phase 1 Sprint 1 tugaganda
