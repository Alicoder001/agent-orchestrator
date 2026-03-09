# ADR-004: Event Bus uchun Go Internal Channel (Extraction-Ready)

## Status

ACCEPTED

## Kontekst

`bounded-contexts.md` event-driven muloqotni asosiy model sifatida belgilagan (L208-209). 7 ta context bir-biri bilan event orqali gaplashadi. Modular monolith ichida event bus implementatsiyasi kerak.

Talablar:
- Context'lar asinxron muloqot qila olishi kerak
- Implementation sodda va debug qilish oson bo'lishi kerak
- Keyinchalik Redis PubSub yoki dedicated broker'ga extraction imkoni bo'lishi kerak
- V1 da qo'shimcha infra dependency qo'shilmasligi kerak

## Qaror

V1 uchun **Go internal event bus** (channel-based, in-process) ishlatiladi. Event interface sifatida define qilinadi — keyinchalik Redis PubSub, NATS yoki boshqa broker'ga almashtirish imkoni qoladi.

### Interface dizayni

```go
type Event struct {
    Type      string    // "session.status_changed"
    Payload   any       // typed payload
    Source    string    // "orchestration"
    Timestamp time.Time
}

type Publisher interface {
    Publish(ctx context.Context, event Event) error
}

type Subscriber interface {
    Subscribe(eventType string, handler func(Event)) error
}

type EventBus interface {
    Publisher
    Subscriber
    Close() error
}
```

### V1 implementation

```go
// In-process, channel-based, goroutine-per-subscriber
type InMemoryEventBus struct {
    subscribers map[string][]func(Event)
    mu          sync.RWMutex
    ch          chan Event
}
```

## Sabab

**Go internal channel tanlash sabablari:**
- Network hop yo'q — latency minimal (microseconds vs milliseconds)
- Zero infra dependency — Redis PubSub yoki NATS o'rnatish shart emas
- Testlash oson — mock publisher inject qilish trivial
- Debug qilish sodda — bitta process ichida, distributed tracing kerak emas
- ADR-003 (modular monolith) bilan mos — bitta deploy unit

**Interface-first design sababi:**
- `Publisher`, `Subscriber` interface'lari almashtirilishi mumkin
- V2 da `RedisPubSubEventBus` yaratish = faqat yangi implementation
- Consumer kodini (subscriber'lar) o'zgartirish shart emas

## Oqibatlar

**Ijobiy:**
- Zero infrastructure overhead for v1
- Testlash va local development soddalashadi
- Performance yuqori (in-process, no serialization)
- Extraction-ready — interface almashtirish yetarli

**Salbiy:**
- Process crash = inflight event yo'qolishi (at-most-once delivery)
- Multi-instance deploy da event fan-out ishlamaydi (qo'shimcha qadam kerak)
- Horizontal scale uchun extraction qilish kerak bo'ladi
- Event ordering faqat bitta subscriber ichida kafolatlanadi

**Extraction trigger:**
- 2+ instance deploy kerak bo'lganda → Redis PubSub ga o'tish
- Event volume 10k+/sec bo'lganda → dedicated broker (NATS) ko'rib chiqish
- At-least-once delivery talab qilinganda → outbox pattern + broker

## Alternativlar ko'rib chiqildi

- **Redis PubSub from day 1** — rad etildi: V1 uchun ortiqcha complexity, Redis down bo'lsa event system ishlamay qoladi
- **NATS** — rad etildi: qo'shimcha infra dependency, jamoa tajribasi yo'q
- **RabbitMQ** — rad etildi: heavyweight, operational burden yuqori
- **Kafka** — rad etildi: enterprise-scale, V1 uchun absurdly overkill
