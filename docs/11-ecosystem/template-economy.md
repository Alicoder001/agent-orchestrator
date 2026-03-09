# Template Economy

## Maqsad

Ushbu hujjat qayta ishlatiladigan template'lar — agent definition, prompt, workflow template'larning ekotizimini belgilaydi.

Bu hujjat `marketplace-model.md`, `prompt-engineering-architecture.md` va `context-engineering-model.md` ga asoslanadi.

---

## Template turlari

### Agent Definition Template

Agent'ni sozlash uchun qayta ishlatiladigan konfiguratsiya:

```yaml
name: "Go Backend Agent"
description: "Go backend development uchun optimallashtirilgan agent"
base_model: "gpt-4o"
tools:
  - file_edit
  - terminal
  - git
system_prompt: |
  You are a Go backend developer.
  Follow the project's coding-standards.md and naming-conventions.md.
  Always write tests for new code.
workspace_template: "go-backend"
recommended_config:
  temperature: 0.2
  max_tokens: 8192
  timeout_minutes: 120
```

### Prompt Template

Muayyan vazifa uchun qayta ishlatiladigan prompt:

```yaml
name: "Bug Fix Prompt"
category: "debugging"
variables:
  - name: "error_description"
    type: "string"
    required: true
  - name: "relevant_files"
    type: "string[]"
    required: false
template: |
  ## Bug Fix Task

  **Error:** {{error_description}}

  **Relevant files:** {{relevant_files}}

  Please:
  1. Reproduce the error
  2. Identify root cause
  3. Fix the bug
  4. Add regression test
  5. Update documentation if behavior changed
```

### Workflow Template

Avtomatlashtirilgan pipeline:

```yaml
name: "Standard PR Flow"
trigger: "session.pr_created"
steps:
  - run_ci
  - auto_review
  - notify_operator
  - wait_approval
  - merge
```

---

## Template Sharing Model

| Level | Scope | Misol |
|-------|-------|-------|
| **Personal** | Faqat yaratuvchi | Draft template'lar |
| **Organization** | Org ichidagi barcha team'lar | Kompaniya standart agent setup |
| **Public** | Platformadagi barcha foydalanuvchilar | Community template (marketplace) |

---

## Template Versioning

```
template-slug@1.0.0  → Stable
template-slug@1.1.0  → New feature (backward compatible)
template-slug@2.0.0  → Breaking change
```

Org'lar template version'ni pin qilishi mumkin — auto-update yoki manual update.

---

## Versiya

- v1.0
- Status: **APPROVED**
