# Final Technology Stack

## Maqsad

Ushbu hujjat platformaning final texnologik yo'nalishini belgilaydi. Bu qarorlar:

- backend
- web
- desktop
- realtime
- data
- infra
- observability
- testing
- security

qatlamlari bo'yicha asosiy source of truth hisoblanadi.

## Asosiy qaror

Platformaning final target stacki quyidagicha:

- `Web frontend`: `Next.js`
- `Desktop app`: `Tauri`
- `Core platform backend`: `Go`
- `Database`: `PostgreSQL`
- `Cache, queue, ephemeral coordination`: `Redis`
- `Realtime gateway`: `Go`
- `Background workers`: `Go`
- `Contracts`: `OpenAPI` va kerak bo'lsa keyingi bosqichda `protobuf`

Bu qaror platformani:

- yengil
- tez
- kuchli
- xavfsiz
- scale-ready

holatda ushlash uchun qabul qilinadi.

Platformaning intelligence core qatlami ham first-class arxitektura elementi sifatida quriladi:

- prompt engineering architecture
- context engineering model
- memory architecture
- evaluation and policy loop

## Arxitektura tamoyili

Final tizim uch qatlamli mantiq asosida quriladi:

- `global truth` platforma backendda yashaydi
- `local power` desktop runtime qatlamida yashaydi
- `product experience` web va desktop clientlarda taqdim etiladi

Bu degani:

- global state va shared orchestration `Go` tarafda
- local native capability va local execution `Tauri` tarafda
- operator va workspace experience `Next.js` tarafda

Bu arxitektura multi-surface va multi-runtime model bilan birga ishlaydi:

- `web`
- `desktop`
- `CLI`
- `VS Code extension`
- `mobile`

surface'lari platformaga ulanadi.

Agent runtime qatlamida quyidagilar qo'llab-quvvatlanadi:

- `Claude Code`
- `Codex CLI`
- `Gemini CLI`
- `Qwen CLI`
- local custom runtime adapters

Provider qatlamida esa:

- remote API provider'lar
- `API token` based access
- `Ollama`
- `LM Studio`

yo'nalishlari first-class support sifatida qaraladi.

## Nega aynan shu stack

### Go

`Go` platformaning markaziy backend qatlami uchun tanlanadi, chunki u:

- yuqori performance beradi
- memory footprint jihatidan yengil
- long-running service va workerlar uchun juda qulay
- realtime va concurrent workload'larda barqaror
- deploy va operatsiya nuqtai nazaridan sodda

Bizning loyihadagi eng muhim platforma ehtiyojlari:

- orchestration
- workflow coordination
- event handling
- streaming
- realtime
- worker execution

shu sabab `Go` markazga qo'yiladi.

### Tauri

`Tauri` desktop qatlam uchun tanlanadi, chunki u:

- local runtime bilan ishlashga mos
- terminal va process orchestration uchun tabiiy
- filesystem va workspace access uchun qulay
- native OS capabilitylarni xavfsizroq beradi
- desktop shell sifatida yengil

`Tauri` global backend emas. U local native runtime qatlamidir.

### Next.js

`Next.js` web surface uchun tanlanadi, chunki u:

- product UI va operator dashboard uchun juda mos
- React ekotizimi bilan kuchli integratsiyaga ega
- app routing va server rendering imkoniyatlari bor
- keyinroq marketing, docs, dashboard va workspace surface'larni bir tizimda ushlashga yordam beradi

## Final backend stack

### Core backend

- `Language`: `Go`
- `HTTP framework`: `Gin` yoki `Fiber` emas, final tanlov sifatida `Chi`
- `Realtime`: native `WebSocket` layer in `Go`
- `Background processing`: `Go workers`
- `Scheduling`: `Go cron/worker layer`
- `Validation`: `go-playground/validator` yoki transport-level schema validation
- `Config`: `env-based config` + typed config loader

### Backend architecture style

- `modular monolith` bilan boshlanadi
- aniq domain boundary bilan yoziladi
- keyin kerak bo'lsa service extraction qilinadi

Initial backend domainlari:

- auth and identity
- organizations
- teams and departments
- projects
- workflows
- agent registry and orchestration metadata
- audit and policy
- notifications and coordination
- realtime session events

### NestJS statusi

`NestJS` final core stackning majburiy qismi emas.

U quyidagi holatda ishlatilishi mumkin:

- MVP tezroq ko'tarilishi kerak bo'lsa
- vaqtinchalik control-plane yoki admin backend kerak bo'lsa
- ayrim product-heavy orchestration API tez yozilishi kerak bo'lsa

Lekin final target arxitekturada markaziy backend `Go` bo'lib qoladi.

## Final desktop stack

- `Framework`: `Tauri`
- `Language`: `Rust` for native commands
- `Desktop UI`: `React` via shared frontend architecture
- `Capabilities`: filesystem, shell, process, terminal, notifications, secure local bridge

Desktop qatlam quyidagilar uchun javob beradi:

- local agent runtime
- local session lifecycle
- terminal bridge
- workspace va file access
- OS integration
- secure local capability layer

## Final web frontend stack

- `Framework`: `Next.js`
- `Language`: `TypeScript`
- `UI rendering`: `React`
- `Server state`: `TanStack Query`
- `Client/local state`: `Zustand`
- `Forms`: `React Hook Form`
- `Validation`: `Zod`
- `Data grids`: `TanStack Table`
- `Large list rendering`: `TanStack Virtual`
- `Component primitives`: `Radix UI`
- `Design system`: `custom design system`
- `Icons`: `Lucide` + future custom product icons
- `Motion`: `Framer Motion`
- `3D experience`: `React Three Fiber` + `drei`
- `Styling`: `Tailwind CSS` + CSS variables + custom tokens

## Frontend architecture tamoyili

Frontend quyidagi qatlamlarga bo'linadi:

- `server state` uchun `TanStack Query`
- `local interaction state` uchun `Zustand`
- `product primitives` uchun `Radix`
- `product identity` uchun custom design system

Muhim qoidalar:

- server data `Zustand`ga tiqilmaydi
- local UI state `TanStack Query`ga tiqilmaydi
- `shadcn/ui` final design system emas
- `Radix + custom` asosiy yo'nalish bo'ladi

## Nega RTK tanlanmadi

`RTK` kuchli vosita, lekin bizning platforma uchun asosiy murakkablik server state va realtime coordination tarafda.

Shu sabab:

- `TanStack Query` server-state-heavy product uchun tabiiyroq
- `Zustand` local state uchun yengilroq
- umumiy frontend complexity kamayadi

## Nega shadcn tanlanmadi

`shadcn/ui` foydali starter bo'lishi mumkin, lekin final product layer uchun yetarli emas.

Bizning loyiha:

- oddiy CRUD dashboard emas
- workspace shell
- operator dashboard
- desktop/web hybrid experience
- kelajakda 2D va 3D surface

shu sabab `Radix + custom design system` tanlanadi.

## Final data stack

- `Primary database`: `PostgreSQL`
- `Cache and coordination`: `Redis`
- `Blob/object storage`: `S3-compatible storage`

`PostgreSQL` quyidagilar uchun ishlatiladi:

- users
- organizations
- teams
- departments
- projects
- workflows
- audit
- policy
- orchestration metadata

`Redis` quyidagilar uchun ishlatiladi:

- ephemeral coordination
- queue buffering
- distributed locks
- short-lived presence state
- realtime fanout support

## Final realtime stack

Realtime platformaning asosiy qismi hisoblanadi.

Final yondashuv:

- realtime gateway `Go`da
- `WebSocket` primary channel
- `SSE` fallback yoki read-heavy streams uchun
- event translation layer frontend query cache bilan ishlaydi

Realtime event turlari:

- agent state changes
- workflow transitions
- terminal/session activity
- notifications
- presence
- attention and intervention signals

## Final auth and security stack

- `Primary auth model`: platform-managed auth service
- `Session management`: secure http-only sessions yoki token-based hybrid
- `RBAC`: first-class platform layer
- `Audit logging`: mandatory
- `Secrets`: environment isolation + secure local desktop bridge

Future enterprise yo'nalish sifatida:

- `Ory`
- `Keycloak`

ko'rib chiqilishi mumkin.

Lekin initial platform architecture auth logicni tashqi providerga bog'lab qo'ymasdan quradi.

## Final observability stack

- `Tracing`: `OpenTelemetry`
- `Metrics`: `Prometheus`
- `Dashboards`: `Grafana`
- `Logs`: structured logs + centralized aggregation
- `Error tracking`: `Sentry`

Katta platformada kuzatuv optional emas. Quyidagilar observability'da birinchi sinf bo'ladi:

- request tracing
- workflow tracing
- agent execution tracing
- worker metrics
- realtime transport health
- queue lag

## Final infra stack

### Development

- `Docker Compose`
- local `PostgreSQL`
- local `Redis`
- local service orchestration

### Production

- `Docker`
- `Kubernetes` keyingi bosqichda
- reverse proxy va edge gateway
- managed database va storage

Initial bosqichda ortiqcha infra complexity qo'shilmaydi. Lekin arxitektura keyinchalik container-native scale uchun tayyor yoziladi.

## Final testing stack

### Backend

- `Go test`
- integration tests with real services
- contract tests for APIs and events

### Frontend

- `Vitest`
- `React Testing Library`
- `Playwright`

### Desktop

- Tauri command tests
- desktop integration smoke flows

## Final contract strategy

Initial bosqichda:

- `OpenAPI` + generated types

Keyingi bosqichda kerak bo'lsa:

- `protobuf` for service-to-service contracts

Muhim prinsip:

- contractlar koddan keyin emas, kod bilan birga yuradi
- frontend, backend va desktop bitta shared schema intizomida ishlaydi

## MVP strategy

Final target stack `Go` markazida quriladi.

Lekin MVP tezlashishi uchun ayrim boshqaruv yoki admin qatlamlari vaqtincha `NestJS`da yozilishi mumkin. Bu faqat quyidagi shartlarda:

- domain logic frameworkdan ajratilgan bo'lsa
- transport contractlar qat'iy bo'lsa
- keyingi extraction uchun boundary oldindan belgilangan bo'lsa

Bu degani `NestJS` transition tool bo'lishi mumkin, lekin final platform core emas.

## Qat'iy tanlovlar

- `Core backend`: `Go`
- `Desktop runtime`: `Tauri`
- `Web framework`: `Next.js`
- `Server state`: `TanStack Query`
- `Local UI state`: `Zustand`
- `UI primitives`: `Radix UI`
- `Design system`: `custom`
- `Icons`: `Lucide`
- `Motion`: `Framer Motion`
- `3D`: `React Three Fiber`
- `Database`: `PostgreSQL`
- `Coordination cache`: `Redis`
- `Observability`: `OpenTelemetry + Prometheus + Grafana + Sentry`

## Yakuniy hukm

Platformaning final professional stacki:

`Go + Tauri + Next.js + PostgreSQL + Redis`

Frontend qatlamida:

`TanStack Query + Zustand + Radix + custom design system`

Bu tanlov bizga quyidagilarni bir vaqtning o'zida beradi:

- yuqori performance
- yengil runtime
- kuchli scale potensiali
- desktop va web uyg'unligi
- product identity uchun yetarli erkinlik
- kelajakdagi katta platforma va organization-level complexity uchun tayyor poydevor
