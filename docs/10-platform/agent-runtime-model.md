# Agent Runtime Model

## Maqsad

Ushbu hujjat AI agent'larning platformada qanday ishga tushirilishi, boshqarilishi va izolatsiya qilinishini belgilaydi.

Bu hujjat `platform-integration-architecture.md` (multi-runtime), `runtime-and-provider-adapter-model.md` (adapter contracts) va `ADR-003` (modular monolith) ga asoslanadi.

---

## Runtime nima

Runtime — agent session'ini bajaradigan execution muhit. Agent kodi runtime ichida ishlaydi.

---

## Runtime Adapters

### V1: tmux/process

| Xususiyat | Qiymat |
|-----------|--------|
| Isolation | OS process level |
| Resource | Shared host resources |
| Startup vaqt | < 2 soniya |
| Persistent | Ha (tmux session saqlanadi) |
| Max parallel | Host resurslariga bog'liq (~50-100) |

**Arxitektura:**
```
Platform API
  └── RuntimeAdapter interface
      └── TmuxRuntime implementation
          ├── tmux new-session -d -s {session_id}
          ├── tmux send-keys "agent start command" Enter
          ├── tmux capture-pane -t {session_id}
          └── tmux kill-session -t {session_id}
```

### V2: Container (Docker)

| Xususiyat | Qiymat |
|-----------|--------|
| Isolation | Container level (rootless) |
| Resource | CPU/memory limit per container |
| Startup vaqt | 5-15 soniya |
| Persistent | Volume mount orqali |
| Max parallel | Server/cluster resurslariga bog'liq |

### V5: Kubernetes (Cloud)

| Xususiyat | Qiymat |
|-----------|--------|
| Isolation | Pod level |
| Resource | ResourceQuota per namespace |
| Startup vaqt | 10-30 soniya |
| Auto-scaling | HPA orqali |
| Max parallel | Cluster darajasida |

---

## RuntimeAdapter Interface

```go
type RuntimeAdapter interface {
    // Session yaratish va ishga tushirish
    Start(ctx context.Context, config SessionConfig) (RuntimeHandle, error)

    // Session to'xtatish
    Stop(ctx context.Context, handle RuntimeHandle) error

    // Session holati olish
    Status(ctx context.Context, handle RuntimeHandle) (RuntimeStatus, error)

    // Terminal output stream
    Output(ctx context.Context, handle RuntimeHandle) (io.ReadCloser, error)

    // Session'ga input yuborish
    SendInput(ctx context.Context, handle RuntimeHandle, input string) error
}

type SessionConfig struct {
    SessionID     string
    AgentCommand  string            // "cursor", "aider", "claude"
    WorkDir       string            // workspace path
    EnvVars       map[string]string // agent-specific env
    ResourceLimit ResourceLimit     // CPU, memory limits (V2+)
}

type RuntimeStatus struct {
    State     string    // "running", "stopped", "crashed"
    PID       int       // OS process ID
    StartedAt time.Time
    ExitCode  *int      // null if still running
}
```

---

## Workspace Management

Har bir session o'z workspace'iga ega:

```
/workspaces/{session_id}/
├── repo/              ← git clone of project repo
├── .agent/            ← agent-specific config
│   ├── context.json   ← assembled context
│   └── instructions   ← system prompt
└── output/            ← agent output artifacts
```

### Workspace lifecycle

```
1. Session spawn → workspace dir yaratiladi
2. Git repo clone qilinadi (yoki mavjud branch checkout)
3. Agent-specific config yoziladi
4. Agent ishga tushiriladi
5. Session done/kill → workspace cleanup (configurable)
```

### Cleanup policy

| Status | Workspace | Vaqt |
|--------|-----------|------|
| `done` (merged) | O'chiriladi | Darhol |
| `done` (not merged) | Saqlanadi | 7 kun keyin o'chiriladi |
| `failed` | Saqlanadi (debug uchun) | 3 kun keyin o'chiriladi |
| `killed` | O'chiriladi | Darhol |

---

## Security Sandboxing

| Level | V1 | V2+ |
|-------|-----|-----|
| File access | Workspace dir only | Container volume mount |
| Network | Host network (V1) | Network policy per container |
| Secrets | Env var orqali (limited) | Secret mount (read-only) |
| System calls | Unrestricted (V1) | seccomp profile (V2) |

**V1 trust model:** Agent faqat workspace ichida ishlaydi. Platform agent output'ini **to'g'ridan execute qilmaydi** (`system-context.md` L165) — agent o'zi terminal'da ishlatadi.

---

## Versiya

- v1.0
- Status: **APPROVED**
