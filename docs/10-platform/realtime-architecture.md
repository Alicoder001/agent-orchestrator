# Realtime Architecture

## Maqsad

Ushbu hujjat platformadagi real-time ma'lumot oqimlarini — WebSocket, SSE va live update strategiyasini belgilaydi.

Bu hujjat `final-technology-stack.md` (Go WebSocket/SSE), `application-architecture.md` va `collaboration-model.md` (attention system) ga asoslanadi.

---

## Realtime Channels

### V1: Server-Sent Events (SSE)

| Xususiyat | Qiymat |
|-----------|--------|
| Protokol | HTTP/2 SSE (server → client) |
| Yo'nalish | Unidirectional (server push) |
| Reconnect | Built-in (browser auto-reconnect) |
| Auth | JWT token (query param yoki header) |

**Nima uchun SSE (V1 da)?**
- WebSocket'dan soddaroq — Go'da implementation oson
- Unidirectional yetarli — client → server uchun REST API bor
- Auto-reconnect — browser native support
- HTTP/2 multiplexing bilan samarali

### V2+: WebSocket

Phase 2+ da WebSocket qo'shiladi:
- Bidirectional real-time (collaborative editing, live terminal)
- Binary data support (terminal output stream)

---

## SSE Endpoint'lar

### Dashboard live updates

```
GET /api/v1/stream/dashboard?org_id={id}
Authorization: Bearer {jwt}

Event stream:
data: {"type":"session.status_changed","session_id":"...","status":"working"}

data: {"type":"attention.changed","project_id":"...","zone":"critical"}

data: {"type":"session.spawned","session_id":"...","project_id":"..."}
```

### Session output stream

```
GET /api/v1/stream/session/{id}/output
Authorization: Bearer {jwt}

Event stream:
data: {"type":"terminal_output","content":"$ go test ./...\nPASS\n"}

data: {"type":"file_change","path":"handler.go","action":"modified"}

data: {"type":"agent_message","content":"I've fixed the bug and added tests."}
```

---

## Server Implementation

```go
func (h *StreamHandler) DashboardStream(w http.ResponseWriter, r *http.Request) {
    // SSE headers
    w.Header().Set("Content-Type", "text/event-stream")
    w.Header().Set("Cache-Control", "no-cache")
    w.Header().Set("Connection", "keep-alive")

    flusher, ok := w.(http.Flusher)
    if !ok {
        http.Error(w, "SSE not supported", 500)
        return
    }

    // Subscribe to relevant events
    orgID := r.URL.Query().Get("org_id")
    ch := h.hub.Subscribe(orgID)
    defer h.hub.Unsubscribe(orgID, ch)

    for {
        select {
        case event := <-ch:
            fmt.Fprintf(w, "data: %s\n\n", event.JSON())
            flusher.Flush()
        case <-r.Context().Done():
            return // client disconnected
        }
    }
}
```

### Connection Hub

```go
type Hub struct {
    subscribers map[string][]chan Event // orgID → channels
    mu          sync.RWMutex
}

func (h *Hub) Broadcast(orgID string, event Event) {
    h.mu.RLock()
    defer h.mu.RUnlock()
    for _, ch := range h.subscribers[orgID] {
        select {
        case ch <- event:
        default: // channel full — skip (backpressure)
        }
    }
}
```

---

## Frontend Integration

```typescript
// hooks/use-dashboard-stream.ts
export function useDashboardStream(orgId: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const source = new EventSource(
      `${API_URL}/stream/dashboard?org_id=${orgId}`,
    );

    source.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case 'session.status_changed':
          queryClient.invalidateQueries(['sessions']);
          break;
        case 'attention.changed':
          queryClient.setQueryData(['attention', data.project_id], data.zone);
          break;
      }
    };

    source.onerror = () => {
      // Auto-reconnect (browser built-in)
    };

    return () => source.close();
  }, [orgId]);
}
```

---

## Scaling (V3+)

| Scale | Strategiya |
|-------|-----------|
| < 100 connections | Single Go process |
| 100-1000 | Redis PubSub as fan-out backend |
| 1000+ | NATS + edge proxy (Centrifugo) |

---

## Versiya

- v1.0
- Status: **APPROVED**
