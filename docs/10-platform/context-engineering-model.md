# Context Engineering Model

## Maqsad

Ushbu hujjat agentga uzatiladigan context qanday yig'ilishi, qanday qatlamlarga bo'linishi va qanday boshqarilishi kerakligini belgilaydi.

## Asosiy prinsip

Context:

- `minimal but sufficient`
- `layered`
- `retrievable`
- `source-aware`
- `policy-filtered`

bo'lishi kerak.

## Context qatlamlari

### Static Core Context

Doimiy platforma qoidalari:

- ultra golden rules
- safety defaults
- tool usage discipline
- output discipline
- escalation policy

### Organizational Context

Barqaror organization-level bilim:

- organization policy
- team conventions
- project architecture
- domain vocabulary
- workflow expectations

### Task Context

Ayni ish uchun kerak bo'lgan kontekst:

- task goal
- acceptance criteria
- constraints
- dependencies
- relevant artifacts

### Operational Context

Joriy ishlash holati:

- active runtime
- active provider
- available tools
- workspace and branch
- permissions
- current session state

### Memory Context

Tarixiy va qayta foydalaniladigan bilim:

- working memory
- episodic memory
- semantic memory
- preference memory

## Context tanlash qoidasi

Har bir execution uchun maksimal emas, eng relevant context uzatiladi.

Tanlash mezonlari:

- task relevance
- freshness
- trust level
- policy allowance
- token budget impact

## Source attribution

Har bir kuchli context elementi manbaga ega bo'lishi kerak:

- docs source
- memory source
- session source
- tool output source
- human input source

## Filtering qoidalari

Pipeline quyidagilarni filtrlashi kerak:

- stale context
- conflicting context
- low-confidence context
- policy-restricted context
- irrelevant transcript noise

## Context budget management

Priority tartibi:

1. safety and core policy
2. active task constraints
3. critical architecture and domain facts
4. operational state
5. helpful but non-critical history

## Yakuniy hukm

Platforma contextni oddiy transcript emas, tartiblangan va policy-filtered knowledge package sifatida yig'adi.
