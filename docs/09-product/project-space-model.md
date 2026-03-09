# Project Space Model

## Maqsad

Ushbu hujjat Project entity'sining tuzilishi, task management, session bilan bog'lanishi va lifecycle'ini belgilaydi.

Bu hujjat `domain-model.md` (Project, Task), `bounded-contexts.md` (Project context) va `business-logic-architecture.md` (use cases) ga asoslanadi.

---

## Project nima

Project — Organization ichidagi bitta dasturiy loyiha. Real-world analogiyasi: GitHub repository. Har bir project bir yoki bir nechta repository'ga bog'langan bo'lishi mumkin.

---

## Project Entity

```
Project {
  id:           UUID v7
  org_id:       → Organization
  name:         string (2-100)
  slug:         string (3-50, unique per org)
  description:  string? (optional)
  repo_url:     string? (GitHub repo URL)
  status:       "active" | "archived"
  visibility:   "private" | "internal" | "public"
  settings:     JSONB
  created_by:   → User
  created_at:   timestamp
  updated_at:   timestamp
  deleted_at:   timestamp? (soft delete)
}
```

### Project settings

```json
{
  "default_branch": "main",
  "require_pr_review": true,
  "auto_merge": false,
  "max_parallel_sessions": 5,
  "workflow_stages": ["backlog", "in_progress", "review", "done"],
  "labels": ["bug", "feature", "refactor", "docs"]
}
```

---

## Task Model

Task — Project ichidagi bitta ish birligi. Agent session'lari task'ga bog'lanadi.

```
Task {
  id:           UUID v7
  project_id:   → Project
  title:        string (5-200)
  description:  string? (markdown)
  status:       "backlog" | "ready" | "in_progress" | "review" | "done" | "cancelled"
  priority:     "critical" | "high" | "medium" | "low"
  assignee_type: "agent" | "human" | null
  assignee_id:  UUID? (AgentSlot yoki User)
  labels:       string[] (tags)
  external_ref: string? (GitHub Issue #, Jira key)
  estimated_effort: string? ("small" | "medium" | "large")
  created_by:   → User
  created_at:   timestamp
  updated_at:   timestamp
}
```

### Task lifecycle

```
backlog → ready → in_progress → review → done
                      │                    ↑
                      └── cancelled        │
                                     (reopen mumkin)
```

### Task-Session munosabati

```
Task (1) ──→ Session (N, lekin faqat 1 ta aktiv)
```

- Bitta task uchun bir vaqtda faqat **bitta aktiv session** bo'lishi mumkin
- Avvalgi session fail yoki kill bo'lsa, yangi session spawn qilish mumkin
- Session tugaganda task status avtomatik yangilanishi mumkin (`done` yoki `review`)

---

## Workflow

V1 da sodda Kanban-style workflow:

```
┌─────────┐   ┌─────────┐   ┌───────────┐   ┌────────┐   ┌──────┐
│ Backlog │ → │  Ready  │ → │In Progress│ → │ Review │ → │ Done │
└─────────┘   └─────────┘   └───────────┘   └────────┘   └──────┘
                                   │
                                   ↓
                             ┌───────────┐
                             │ Cancelled │
                             └───────────┘
```

Phase 3+ da workflow engine bilan custom stage'lar va automation qo'shiladi (`workflow-engine.md`).

---

## Qoidalar

| Qoida | Tavsif |
|-------|--------|
| Project slug org ichida unique | DB unique (org_id, slug) |
| Arxivlangan project'da task yaratilmaydi | Service check |
| Arxivlangan project'da session spawn qilinmaydi | Orchestration check |
| Project o'chirilmaydi — faqat arxivlanadi | Hard delete yo'q |
| Task external_ref unique per project | DB unique (project_id, external_ref) |
| GitHub Issue sync — pull-only, platform master | Integration rule |

---

## Versiya

- v1.0
- Status: **APPROVED**
