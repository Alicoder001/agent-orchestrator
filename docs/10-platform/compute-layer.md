# Compute Layer

## Maqsad

Ushbu hujjat platformadagi compute resurslarini — API server, agent runtime va background job'larni belgilaydi.

Bu hujjat `deployment-architecture.md` (resource requirements), `agent-runtime-model.md` va `scaling-model.md` ga asoslanadi.

---

## Compute Units

### V1 Architecture

```
Single Server
├── Go API Server (1 process)
│   ├── HTTP handlers
│   ├── SSE connections
│   ├── Event bus (goroutines)
│   └── Background workers (goroutines)
├── Agent Sessions (N tmux processes)
│   ├── tmux session 1 (cursor agent)
│   ├── tmux session 2 (aider agent)
│   └── tmux session N (...)
├── PostgreSQL (1 instance)
└── Redis (1 instance)
```

### Resource Allocation (V1)

| Component | CPU | RAM | I/O |
|-----------|-----|-----|-----|
| Go API Server | 1 vCPU | 256MB | Low (JSON parse) |
| Per agent session | 0.5 vCPU (burst) | 200MB (avg) | Medium (file I/O, git) |
| PostgreSQL | 1 vCPU | 512MB | High (read/write) |
| Redis | 0.25 vCPU | 128MB | Low |
| **50 session server** | **~8 vCPU** | **~12GB** | Mixed |

### Sizing Guide

| Scenario | Server spec | Max sessions |
|----------|-------------|-------------|
| Development | 2 vCPU, 4GB RAM | 5-10 |
| Small team | 4 vCPU, 8GB RAM | 20-30 |
| Medium team | 8 vCPU, 16GB RAM | 50-80 |
| Large (V3+) | Cluster | 100+ |

---

## Background Processing

### V1: Goroutine Workers

```go
type WorkerPool struct {
    tasks    chan Task
    workers  int
    wg       sync.WaitGroup
}

// Background jobs:
// 1. Workspace cleanup (expired sessions)
// 2. Session timeout check
// 3. Health monitoring
// 4. Metric aggregation
```

### V3+: Job Queue

| Component | Vosita |
|-----------|--------|
| Queue | Redis-based (asynq) yoki NATS |
| Workers | Separate Go processes |
| Scheduling | Cron-style periodic jobs |
| Retry | Exponential backoff, max 3 |
| Dead letter | Failed job'lar alohida queue'da |

---

## CPU Throttling

Agent session'lar server CPU'sini monopolize qilmasligi uchun:

| Strategy | V1 | V3+ |
|----------|-----|-----|
| Process nice level | nice -10 (agent sessions) | cgroup limits |
| Max concurrent builds | 5 (parallel go build/npm run) | Container CPU quota |
| Timeout | 120 daqiqa per session | Configurable per agent slot |

---

## Versiya

- v1.0
- Status: **APPROVED**
