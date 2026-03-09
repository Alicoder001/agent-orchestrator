# Runtime and Provider Adapter Model

## Maqsad

Ushbu hujjat agent runtime'lari va model provider'lari platformaga qanday ulanadigan texnik modelni belgilaydi.

## Asosiy qaror

Platforma adapter-based integration modelda quriladi.

Bu degani:

- har bir agent runtime adapter orqali ulanadi
- har bir model provider adapter orqali ulanadi
- platforma core qatlami umumiy contractlar bilan ishlaydi

## Runtime adapter modeli

Runtime adapter agentni amalda ishga tushirish yoki boshqarish qatlami hisoblanadi.

Misollar:

- `Claude Code`
- `Codex CLI`
- `Gemini CLI`
- `Qwen CLI`
- future internal runtime adapters

### Runtime adapter contract

Har bir runtime kamida quyidagilarni taqdim etadi:

- `start`
- `stop`
- `resume`
- `send_input`
- `stream_output`
- `declare_capabilities`
- `report_status`
- `emit_events`

### Runtime capability turlari

- interactive session
- streaming output
- tool use
- filesystem awareness
- branch or workspace awareness
- long-running execution
- approval handling

## Provider adapter modeli

Provider adapter model inference manbalariga ulanish qatlamidir.

Misollar:

- `OpenAI`
- `Anthropic`
- `Google`
- `OpenRouter`
- `Ollama`
- `LM Studio`

### Provider contract

Har bir provider adapter quyidagilarni taqdim etadi:

- `authenticate`
- `list_models`
- `invoke`
- `stream`
- `tool_support_metadata`
- `token_limit_metadata`
- `rate_limit_metadata`
- `cost_metadata`

## Local provider yo'nalishi

Local model provider'lar enterprise va privacy-sensitive yo'nalishlar uchun muhim.

Shu sabab quyidagilar first-class support sifatida qaraladi:

- `Ollama`
- `LM Studio`

Local provider support desktop experience bilan ayniqsa tabiiy integratsiyalashadi.

## Adapterlar nega kerak

Adapter modeli quyidagilarni ta'minlaydi:

- runtime almashtirish imkoniyati
- provider almashtirish imkoniyati
- unified audit va policy layer
- feature detection
- future enterprise customization

## Policy va security

Har bir adapter platformaning umumiy qoidalariga bo'ysunadi:

- auth
- RBAC
- audit
- execution policy
- workspace policy
- approval flow

Bu degani runtime yoki provider kuchli bo'lishi mumkin, lekin platforma nazoratidan tashqarida ishlamaydi.

## Desktop bilan bog'lanishi

Desktop qatlam quyidagilar uchun adapter host vazifasini bajarishi mumkin:

- local runtime adapters
- local provider adapters
- secure credential bridge
- local workspace-aware execution

Bu model `Tauri`ni global backendga aylantirmaydi. U local adapter execution host sifatida ishlaydi.

## Web bilan bog'lanishi

Web qatlam runtime yoki provider'ni to'g'ridan-to'g'ri host qilmaydi.

Web:

- platforma backend bilan ishlaydi
- capability metadata'ni ko'rsatadi
- workflow va state boshqaruvini taqdim etadi

## Yakuniy hukm

Platformaning kuchi bitta model yoki bitta agentdan kelmaydi.

Uning kuchi:

- runtime adapter modeli
- provider adapter modeli
- unified policy and orchestration layer

kombinatsiyasidan keladi.
