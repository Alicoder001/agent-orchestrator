# ADR-001: Core Backend uchun Go tanlanadi

## Status
ACCEPTED

## Kontekst

Platforma quyidagi asosiy talablarga ega backend kerak:
- Ko'p parallel agent session'larni boshqarish (100+ simultaneous)
- Realtime event oqimi (WebSocket/SSE)
- Uzoq muddatli background worker'lar
- Low memory footprint (server'da ko'p instance)
- Tez deploy va restart

Alternativlar ko'rib chiqildi: NestJS (Node.js/TypeScript), FastAPI (Python), Go.

## Qaror

Core platform backend uchun **Go** tanlanadi. HTTP framework sifatida **Chi** ishlatiladi.

## Sabab

**Go tanlash sabablari:**
- Goroutine modeli 1000+ parallel session uchun Node.js event loop'dan samaraliroq
- Memory footprint kichik — agent session boshiga ~2MB vs Node ~20MB
- Binary deploy — container'da runtime dependency yo'q
- `net/http` + `chi` production-grade, battle-tested
- Concurrent workload uchun type system xavfsizroq

**NestJS rad etilish sababi:**
- Node.js single-threaded — CPU-bound orchestration task'lar uchun zaiflashadi
- Memory leakage long-running service'larda tez-tez uchraydi
- Dependency injection overhead oddiy HTTP handler uchun keraksiz murakkablik
- NestJS MVP uchun qolishi mumkin (admin panel kabi), lekin core uchun emas

**FastAPI rad etilish sababi:**
- GIL orqali haqiqiy parallelizm cheklangan
- Python memory model Go'dan og'irroq
- Async/await orqali Go goroutine'ga yetib bo'lmaydi

**Chi framework tanlanish sababi:**
- Minimal, kompozisiya-based, net/http bilan 100% mos
- Gin/Fiber'ga nisbatan kamroq "magic" — kodni tushunish osonroq
- Middleware chain aniq va testlanadigan

## Oqibatlar

**Ijobiy:**
- Long-running worker'lar Go'da tabiiy
- Realtime gateway ham Go'da — transport va domain logic bir tilda
- Single binary deploy — DevOps sodda

**Salbiy:**
- Jamoa Go bilishi kerak (TypeScript background bo'lsa onboarding kerak)
- Type system TypeScript'ga nisbatan verbose
- Generics hali Go ekotizimida yetarli qo'llab-quvvatlanmaydi (ba'zi yerlarda)

**NestJS istisnosi:**
Admin dashboard yoki MVP control-plane uchun NestJS vaqtincha ishlatilishi mumkin, lekin faqat bu shartlarda:
- Domain logic framework'dan ajratilgan
- Transport contract qat'iy (OpenAPI)
- Keyinroq Go'ga extraction uchun boundary oldindan belgilangan

## Alternativlar ko'rib chiqildi

- NestJS — rad etildi (yuqorida)
- FastAPI — rad etildi (yuqorida)
- Rust — rad etildi (ekotizim va developer velocity muammosi)
- Elixir — rad etildi (jamoa tajribasi yo'q, ekotizim kichik)
