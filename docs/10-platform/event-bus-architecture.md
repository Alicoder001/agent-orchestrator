# Event Bus Architecture

## Maqsad

Ushbu hujjat platformadagi event bus tizimining ichki arxitekturasi, delivery semantics, va monitoring qoidalarini belgilaydi.

Bu hujjat `ADR-004` (event bus strategy), `bounded-contexts.md` (inter-context communication) va `integration-architecture.md` (event catalog) ga asoslanadi.

---

## Arxitektura

### V1: In-Process Event Bus

```go
// Interface — barcha implementation shu contract'ga mos
type EventBus interface {
    Publish(ctx context.Context, event Event) error
    Subscribe(eventType string, handler EventHandler) error
    Unsubscribe(eventType string, handler EventHandler) error
}

type Event struct {
    ID        string    `json:"id"`         // UUID v7
    Type      string    `json:"type"`       // "session.status_changed"
    Source    string    `json:"source"`     // "orchestration"
    Payload   any       `json:"payload"`    // typed struct
    Timestamp time.Time `json:"timestamp"`  // event yaratilgan vaqt
    CorrelationID string `json:"correlation_id"` // request tracing
}

type EventHandler func(ctx context.Context, event Event) error
```

### V1 Implementation: Go Channel

```go
type ChannelEventBus struct {
    subscribers map[string][]EventHandler
    mu          sync.RWMutex
    bufferSize  int // default: 1000
}
```

**Xususiyatlari:**
- In-process — tashqi dependency yo'q
- Goroutine-based — non-blocking publish
- Buffer — 1000 event (to'lib qolsa back-pressure)
- At-most-once delivery (V1)

### V3+ Implementation: External Broker

Phase 3+ da NATS yoki Redis Streams ga migration:

```
V1: Go channel (in-process)
V3: NATS JetStream (distributed, at-least-once)
V5: NATS + dead letter queue + retry
```

**Migration path:** Interface o'zgarmaydi — faqat implementation almashadi.

---

## Delivery Semantics

| Version | Semantics | Tavsif |
|---------|-----------|--------|
| V1 | At-most-once | Event yo'qolishi mumkin (process crash) |
| V3 | At-least-once | Event takrorlanishi mumkin (idempotency kerak) |
| V5 | Exactly-once | Transactional outbox pattern |

### V1 qoidalari

- Subscriber xato qilsa — log qilinadi, boshqa subscriber'lar davom etadi
- Subscriber panic qilsa — recovery middleware ushlaydi
- Event processing async (goroutine)
- Order garantiyasi yo'q (parallel processing)

---

## Event Processing Pipeline

```
Publisher
  │
  ▼
EventBus.Publish()
  │
  ├── Serialize event
  ├── Validate event type
  ├── Route to subscribers
  │     ├── Subscriber 1 (goroutine)
  │     ├── Subscriber 2 (goroutine)
  │     └── Subscriber N (goroutine)
  └── Emit metric (event_bus_published_total)
```

### Event filtering

Subscriber event type pattern bo'yicha subscribe qilishi mumkin:

```go
// Aniq type
bus.Subscribe("session.status_changed", handler)

// Wildcard (V2+)
bus.Subscribe("session.*", handler)

// Barcha event (debug/audit uchun)
bus.Subscribe("*", auditLogger)
```

---

## Monitoring

| Metric | Tur | Tavsif |
|--------|-----|--------|
| `event_bus_published_total` | Counter | Event type bo'yicha publish soni |
| `event_bus_processed_total` | Counter | Subscriber tomonidan qayta ishlangan |
| `event_bus_errors_total` | Counter | Processing xatolari |
| `event_bus_processing_duration` | Histogram | Processing vaqti |
| `event_bus_buffer_size` | Gauge | Hozirgi buffer to'lishi |

### Health check

```go
func (b *ChannelEventBus) Health() bool {
    return b.bufferUsage() < 0.9 // 90% dan kam
}
```

---

## Versiya

- v1.0
- Status: **APPROVED**
