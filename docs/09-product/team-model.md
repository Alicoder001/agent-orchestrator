# Team Model

## Maqsad

Ushbu hujjat Team entity'sining tuzilishi, agent slot'lar bilan munosabati va boshqarish qoidalarini belgilaydi.

Bu hujjat `domain-model.md` (Team, AgentSlot), `department-model.md` va `organization-model.md` ga asoslanadi.

---

## Team nima

Team — Department ichidagi ishchi guruh. Agent'lar Team darajasida tayinlanadi (AgentSlot orqali). Haqiqiy dunyo analogiyasi: "Backend Team", "AI Agents Team".

```
Department
└── Team
    ├── Human members (observer role)
    └── AgentSlot'lar
        ├── AgentSlot: "Cursor Agent" (backend tasks)
        ├── AgentSlot: "Copilot Agent" (frontend tasks)
        └── AgentSlot: "Test Agent" (QA tasks)
```

---

## Team Entity

```
Team {
  id:           UUID v7
  org_id:       → Organization
  department_id: → Department
  name:         string (2-100)
  slug:         string (3-50, unique per org)
  description:  string? (optional)
  lead_id:      → User? (team lead, optional)
  max_agents:   int (default: 10)
  is_active:    boolean (default: true)
  created_at:   timestamp
  updated_at:   timestamp
  deleted_at:   timestamp? (soft delete)
}
```

---

## AgentSlot Model

AgentSlot — Team'dagi bitta "o'rin" agent uchun. Agent definition'ga ulanadi va konfiguratsiya saqlanadi.

```
AgentSlot {
  id:              UUID v7
  team_id:         → Team
  agent_def_id:    → AgentDefinition
  display_name:    string ("Backend Cursor", "QA Claude")
  config:          JSONB (agent-specific sozlamalar)
  max_parallel:    int (default: 3)
  status:          "active" | "paused" | "retired"
  created_at:      timestamp
  updated_at:      timestamp
}
```

### AgentSlot config misoli

```json
{
  "model": "gpt-4o",
  "temperature": 0.2,
  "max_tokens": 8192,
  "system_prompt_override": null,
  "allowed_tools": ["file_edit", "terminal", "browser"],
  "workspace_template": "go-backend",
  "timeout_minutes": 120
}
```

---

## Qoidalar

| Qoida | Tavsif |
|-------|--------|
| Team slug org ichida unique | DB unique (org_id, slug) |
| Team AgentSlot soni `max_agents` dan oshmaydi | Service check |
| Team o'chirilsa — AgentSlot'lar deactivate | Cascade |
| AgentSlot o'chirilsa — aktiv session'lar kill | Orchestration event |
| Bitta AgentSlot uchun aktiv session soni `max_parallel` dan oshmasligi | Orchestration check |
| Paused AgentSlot — yangi session spawn qilinmaydi | Service check |

---

## Team-Project Assignment

Team project'larga assign qilinadi:

```
TeamAssignment {
  id:          UUID v7
  team_id:     → Team
  project_id:  → Project
  assigned_at: timestamp
  assigned_by: → User
}
```

Bitta team ko'p project'ga, bitta project ko'p team'ga assign bo'lishi mumkin (many-to-many).

---

## Versiya

- v1.0
- Status: **APPROVED**
