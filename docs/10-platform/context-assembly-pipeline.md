# Context Assembly Pipeline

## Maqsad

Ushbu hujjat agent execution oldidan final context qanday yig'ilishini belgilaydi.

## Pipeline bosqichlari

### 1. Request intake

Qabul qilinadi:

- user request
- triggering event
- active workflow state
- execution mode

### 2. Policy loading

Yuklanadi:

- ultra golden rules
- security policy
- org policy
- workspace policy

### 3. Relevant artifact retrieval

Tanlab olinadi:

- docs
- project files
- task artifacts
- workflow definitions
- linked references

### 4. Memory retrieval

Olinadi:

- working memory
- episodic memory
- semantic memory
- preference memory

### 5. Operational state attachment

Qo'shiladi:

- runtime
- provider
- available tools
- permissions
- active workspace and branch

### 6. Prompt composition

Prompt architecture qatlamlari bilan context birlashtiriladi.

### 7. Budget pruning

Token budget va relevance asosida keraksiz elementlar qisqartiriladi.

### 8. Final validation

Tekshiriladi:

- policy compliance
- required facts presence
- conflict flags
- missing critical context

## Qat'iy qoidalar

- context yig'ish deterministik bo'lishi kerak
- transcript to'liq ko'chirilmaydi
- source attribution saqlanadi
- low-confidence memory dominant contextga chiqmaydi

## Yakuniy hukm

Context assembly policy, relevance, memory, runtime va prompt compositionni birlashtiradigan boshqariladigan pipeline hisoblanadi.
