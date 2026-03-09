# Marketplace Model

## Maqsad

Ushbu hujjat platformadagi marketplace — agent definition'lar, prompt template'lar va workflow'larni almashish tizimini belgilaydi.

Bu hujjat `platform-thesis.md` (ecosystem thesis), `trust-and-reputation.md` va `template-economy.md` ga asoslanadi.

---

## Marketplace nima

Marketplace — foydalanuvchilar va uchinchi tomon ishlab chiquvchilar tomonidan yaratilgan agent definition'lar, prompt template'lar va workflow'larni topish, baholash va o'rnatish joyi.

---

## Marketplace Item turlari

| Tur | Tavsif | Misol |
|----|--------|-------|
| **Agent Definition** | Agent konfiguratsiyasi — model, tools, prompt | "Go Backend Agent", "React Frontend Agent" |
| **Prompt Template** | Qayta ishlatiladigan system prompt | "Code Review Prompt", "Bug Fix Prompt" |
| **Workflow Template** | Avtomatlashtirilgan pipeline | "PR Review + Auto-merge", "CI Fix + Retry" |
| **Integration Plugin** | Tashqi tool ulanish | "Slack Notifier", "Linear Sync" |

---

## Marketplace Phases

| Phase | Scope |
|-------|-------|
| V1 | Yo'q — faqat built-in agent definitions |
| V2 | Ichki marketplace — org ichida template sharing |
| V3 | Public marketplace — community contributions |
| V5 | Verified publishers, paid marketplace items |

---

## Listing Model (V3+)

```
MarketplaceListing {
  id:           UUID v7
  type:         "agent_def" | "prompt_template" | "workflow" | "plugin"
  name:         string
  slug:         string (unique)
  description:  string (markdown)
  version:      semver
  author_id:    → User / Organization
  visibility:   "public" | "org_only"
  pricing:      "free" | "paid"
  category:     string[]
  downloads:    int
  rating:       decimal (1-5)
  verified:     boolean
  created_at:   timestamp
}
```

---

## Quality Control

| Gate | Tavsif |
|------|--------|
| Schema validation | Listing format to'g'ri |
| Security scan | Prompt injection check, malicious tool access |
| Version policy | Semver, breaking change declaration |
| Report system | Community flag → review → remove |
| Verified badge | Platform team review va tasdiqlash |

---

## Versiya

- v1.0
- Status: **APPROVED**
