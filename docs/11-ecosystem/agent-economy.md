# Agent Economy

## Maqsad

Ushbu hujjat platformadagi agent'larning iqtisodiy modeli — narxlash, resource sarflanishi va cost optimization'ni belgilaydi.

Bu hujjat `vision.md` (AI-native organizations), `platform-thesis.md` (ecosystem thesis) va `monetization-model.md` ga asoslanadi.

---

## Agent Cost Structure

### Cost components

| Component | Tavsif | O'lchov |
|-----------|--------|---------|
| **LLM token** | Provider API calls (GPT-4, Claude, etc.) | Token count (input + output) |
| **Compute** | CPU/RAM server resource sarfi | vCPU-min, MB-min |
| **Storage** | Workspace disk, git clone | GB-hour |
| **API calls** | GitHub API, external webhooks | Call count |
| **Network** | Git push/pull, API traffic | GB transfer |

### V1 Cost Tracking

```
SessionCost {
  session_id:     → Session
  llm_tokens:     int (total input + output)
  llm_cost_usd:   decimal (provider price * tokens)
  compute_minutes: int
  api_calls:      int
  calculated_at:  timestamp
}
```

---

## Agent Efficiency Metrics

| Metric | Formula | Target |
|--------|---------|--------|
| **Cost per PR** | total_session_cost / merged_PRs | Kamaytirish |
| **Token efficiency** | useful_output_lines / total_tokens | Oshirish |
| **Success rate** | done_sessions / total_sessions | > 80% |
| **Time to PR** | session_start → PR_created | Kamaytirish |
| **Rework rate** | PR_rejected / total_PRs | < 15% |

---

## Budget Controls

### Organization-level

```json
{
  "org_id": "...",
  "budget": {
    "monthly_limit_usd": 500,
    "alert_threshold_percent": 80,
    "hard_stop": true,
    "per_team_limit_usd": 100,
    "per_session_limit_usd": 10
  }
}
```

### Enforcement

| Trigger | Action |
|---------|--------|
| 80% budget consumed | Alert to admin |
| 100% budget consumed (hard_stop=true) | Block new session spawn |
| 100% budget consumed (hard_stop=false) | Alert, but allow continue |
| Per-session limit reached | Kill session + alert |

---

## Agent Value Attribution (V3+)

Qaysi agent qancha qiymat yaratayotganini o'lchash:

```
Agent ROI = (manual_estimate_hours * hourly_rate) / agent_cost
```

| Agent | Task type | Avg cost | Manual estimate | ROI |
|-------|----------|----------|----------------|-----|
| Backend Agent | CRUD endpoint | $2.50 | 2 hours * $50 = $100 | 40x |
| Test Agent | Unit tests | $1.00 | 1 hour * $50 = $50 | 50x |
| Docs Agent | Documentation | $0.50 | 30 min * $50 = $25 | 50x |
| Refactor Agent | Large refactor | $15.00 | 8 hours * $50 = $400 | 27x |

---

## Versiya

- v1.0
- Status: **APPROVED**
