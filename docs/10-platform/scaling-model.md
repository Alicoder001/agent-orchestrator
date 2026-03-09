# Scaling Model

## Maqsad

Ushbu hujjat platformaning qanday masshtablanishi — vertical, horizontal va component-level scaling strategiyasini belgilaydi.

Bu hujjat `compute-layer.md`, `ADR-003` (modular monolith → extraction), `deployment-architecture.md` va `storage-architecture.md` ga asoslanadi.

---

## Scaling Phases

| Phase | Model | Target | Max concurrent sessions |
|-------|-------|--------|------------------------|
| V1 | Single server (vertical) | Small teams | ~50-100 |
| V2 | Single server (optimized) | Medium teams | ~200 |
| V3 | Multi-server (horizontal) | Large teams | ~500 |
| V5 | Kubernetes cluster | Enterprise | 1000+ |

---

## V1: Vertical Scaling

```
Bottleneck: Server CPU va RAM
Yechim: Kattaroq server olish

2 vCPU, 4GB  → 10 session
4 vCPU, 8GB  → 30 session
8 vCPU, 16GB → 80 session
16 vCPU, 32GB → 150+ session
```

### V1 Optimization targets

| Bottleneck | Optimization |
|-----------|-------------|
| DB connections | Connection pool tuning (pgbouncer V2+) |
| Memory per session | Workspace lazy-load |
| CPU per session | Process priority (nice) |
| Disk I/O | SSD required, git shallow clone |

---

## V3: Horizontal Scaling

### Component extraction order (`ADR-003`)

```
1. Stateless API → multiple instances (load balancer)
2. Session runtime → dedicated worker nodes
3. Database → managed PostgreSQL (RDS, Cloud SQL)
4. Cache → managed Redis (ElastiCache)
5. Event bus → external broker (NATS)
```

### Architecture

```
         Load Balancer
        ╱      │       ╲
   API-1    API-2    API-3     (stateless)
        ╲      │       ╱
      ┌────────┴────────┐
      │  Shared Infra   │
      ├─────┬─────┬─────┤
      │ PG  │Redis│ NATS│
      └─────┴─────┴─────┘

   Worker-1   Worker-2   Worker-3   (agent sessions)
```

### Sticky sessions

SSE connections require sticky sessions:

| Component | Sticky kerakmi |
|-----------|---------------|
| REST API | Yo'q (stateless) |
| SSE stream | Ha (connection → server) |
| WebSocket | Ha (connection → server) |

**Yechim:** Load balancer IP hash yoki cookie-based stickiness.

---

## V5: Kubernetes

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-server
spec:
  replicas: 3
  template:
    spec:
      containers:
        - name: api
          image: agent-orchestrator/api:v1
          resources:
            requests:
              cpu: "500m"
              memory: "256Mi"
            limits:
              cpu: "1"
              memory: "512Mi"
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-hpa
spec:
  scaleTargetRef:
    name: api-server
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
```

---

## Scaling Metrics

| Metric | Alert threshold | Action |
|--------|----------------|--------|
| CPU usage (avg) | > 70% (5 min) | Scale up yoki optimize |
| Memory usage | > 80% | Scale up |
| Active sessions / capacity | > 80% | Add worker node |
| DB connection pool usage | > 80% | Increase pool yoki add replica |
| API response p95 | > 2s | Scale up API pods |

---

## Versiya

- v1.0
- Status: **APPROVED**
