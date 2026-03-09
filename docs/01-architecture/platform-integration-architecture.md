# Platform Integration Architecture

## Maqsad

Ushbu hujjat platformaning turli clientlar, agent runtime'lar va model provider'lar bilan qanday integratsiya qilinishini belgilaydi.

Bu arxitektura platformaning eng muhim strategik qarorlaridan biri hisoblanadi.

## Asosiy prinsip

Platforma:

- `multi-surface`
- `multi-runtime`
- `multi-provider`

arxitektura asosida quriladi.

Bu degani tizim:

- bitta UI surface'ga bog'lanmaydi
- bitta LLM provider'ga bog'lanmaydi
- bitta agent runtime'ga bog'lanmaydi

## Integratsiya qatlamlari

Platforma integratsiyasi uchta alohida qatlamda ishlaydi:

### 1. Client surface layer

Bu qatlam foydalanuvchi bilan to'g'ridan-to'g'ri ishlaydigan clientlarni ifodalaydi:

- web
- desktop
- CLI
- VS Code extension
- mobile

### 2. Runtime adapter layer

Bu qatlam agentlarni amalda ishga tushiradigan yoki boshqaradigan execution adapterlarni ifodalaydi:

- Claude Code
- Codex
- Gemini CLI
- Qwen CLI
- local custom runners

### 3. Model provider layer

Bu qatlam model inference manbalarini ifodalaydi:

- OpenAI
- Anthropic
- Google
- OpenRouter
- Ollama
- LM Studio
- enterprise private model gateways

## Muhim ajratish

`Runtime` bilan `provider` bir narsa emas.

Masalan:

- `Claude Code` runtime hisoblanadi
- `Anthropic API` provider hisoblanadi
- `Ollama` provider yoki local inference gateway hisoblanadi
- `Codex CLI` runtime hisoblanadi

Bu ikki qatlamni aralashtirib yuborish platformani tez toraytiradi.

## Nega bu yondashuv tanlandi

Bizning platforma:

- faqat chat interface emas
- faqat desktop application emas
- faqat bitta provider wrapper emas
- faqat local agent manager emas

U haqiqiy orchestration platforma bo'lgani uchun turli execution yo'llari va turli access nuqtalarini qo'llab-quvvatlashi kerak.

## Arxitektura qoidalari

### Core never binds to one provider

Platforma core qatlami hech qachon faqat bitta provider mantiqiga bog'lanmaydi.

### Core never binds to one client

Platforma workflow va state modeli web yoki desktop ichiga qamalib qolmaydi.

### Runtime adapters are replaceable

Har bir agent runtime adapter orqali ulanadi va almashtirilishi mumkin bo'ladi.

### Providers are policy-controlled

Har bir provider platforma policy, auth, audit va capability qoidalari ichida ishlaydi.

## Clientlar qanday ulanadi

### Web

`Web` platforma backendiga to'g'ridan-to'g'ri ulanadi va shared state bilan ishlaydi.

### Desktop

`Desktop` ikki tomonlama rolga ega:

- platforma backendiga ulanadi
- local runtime capability beradi

### CLI

`CLI` platforma backendi bilan ham, kerak bo'lsa local runtime bilan ham ishlaydi.

### VS Code Extension

`VS Code extension` editor context va project awareness qatlamini qo'shadi.

U mustaqil backend bo'lmaydi. U platformaning yana bir client surface'i bo'ladi.

### Mobile

`Mobile` asosan observer va operator surface sifatida ishlaydi.

## Runtime adapter'lar qanday ishlaydi

Har bir runtime adapter quyidagi umumiy contractga mos keladi:

- launch
- stop
- session attach
- input send
- output stream
- tool capability declaration
- status reporting
- audit metadata

Shu sabab har bir runtime platforma ichida bir xil agent tushunchasiga map qilinadi.

## Provider integratsiyasi qanday ishlaydi

Provider integratsiyasi quyidagi common capability contract orqali boshqariladi:

- model identity
- auth method
- token or credential source
- inference capability
- tool-use support
- streaming support
- rate limit metadata
- cost metadata

Bu contract provider'larga mos umumiy policy qatlamini yaratadi.

## Local LLM yo'nalishi

Platforma local inference'ni birinchi sinf darajada ko'radi.

Qo'llab-quvvatlanadigan local integration misollari:

- `Ollama`
- `LM Studio`

Bu local yo'nalish quyidagilar uchun muhim:

- privacy-sensitive workflows
- offline yoki low-connectivity mode
- local experimentation
- developer workflows
- enterprise controlled environments

## Strategic value

Ushbu model platformaga quyidagi strategik afzalliklarni beradi:

- provider lock-in kamayadi
- client lock-in kamayadi
- runtime lock-in kamayadi
- enterprise integratsiyalar osonlashadi
- local va cloud execution bir tizimga tushadi

## Yakuniy hukm

Platforma bitta app emas.

U:

- ko'p surface'li
- ko'p runtime'li
- ko'p provider'li

AI operating platform sifatida quriladi.
