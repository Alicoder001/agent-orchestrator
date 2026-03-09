# ADR-005: Frontend State Management uchun TanStack Query + Zustand

## Status

ACCEPTED

## Kontekst

Platformaning frontend qatlami server-state-heavy: session'lar, project'lar, workflow'lar, team'lar — barchasi backend'dan keladi va real-time yangilanadi. Shuningdek UI-local state ham bor: modal holatlari, filter tanlash, attention zone toggle.

Alternativlar ko'rib chiqildi: Redux Toolkit + RTK Query, TanStack Query + Zustand.

## Qaror

- **Server state** uchun — **TanStack Query** (v5)
- **Local/UI state** uchun — **Zustand**
- **UI primitives** uchun — **Radix UI** (shadcn/ui rad etildi)
- **Design system** — **Custom** (Radix + Tailwind + CSS variables)

## Sabab

**TanStack Query tanlash sabablari:**
- Cache invalidation, background refetch, optimistic updates — built-in
- Server-state-heavy product uchun RTK Query'dan tabiiyroq
- WebSocket event'lar bilan cache invalidation oson (queryClient.invalidateQueries)
- Stale-while-revalidate pattern operator dashboard uchun ideal
- DevTools kuchli — cache holati vizual ko'rinadi

**Zustand tanlash sabablari:**
- Yengil (~1KB) — Redux'ning 10x kichik
- Boilerplate kam — action, reducer, slice tushunchalari yo'q
- React hook sifatida ishlatiladi — komponentga tabiiy
- Local UI state uchun ideal: modal, sidebar, filter, theme

**RTK rad etilish sababi:**
- Bizning use-case'da server data dominant — RTK'ning action/reducer/slice overhead ortiqcha
- RTK Query TanStack Query'ga o'xshash, lekin Redux ecosystem'ga bog'liq
- Zustand + TanStack Query kombinatsiyasi kamroq boilerplate beradi

**shadcn/ui rad etilish sababi:**
- shadcn/ui Tailwind + Radix wrapper — foydali starter, lekin:
  - platformaning workspace shell, operator dashboard, 2D/3D surface ehtiyojlari uchun yetarli emas
  - copy-paste model katta tizimda boshqarib bo'lmaydi
  - custom design language kerak — generic dashboard ko'rinishi emas
- Qaror: Radix primitives + custom design system (design tokens, CSS variables)

## State ajratish qoidasi

| State turi | Tool | Misol |
|-----------|------|-------|
| Server data (fetch, cache) | TanStack Query | Sessions list, project details, team members |
| Realtime updates | TanStack Query + WS | Session status change → invalidateQueries |
| UI interaction state | Zustand | Sidebar open/close, active filter, modal state |
| Form state | React Hook Form + Zod | Create project form, spawn session form |
| URL state | Next.js router | Active page, query params |

**Qat'iy taqiq:**
- Server data Zustand'ga tiqilmaydi
- Local UI state TanStack Query'ga tiqilmaydi
- Form state alohida boshqariladi (React Hook Form)

## Oqibatlar

**Ijobiy:**
- Frontend complexity sezilarli kamayadi
- Server state va UI state aniq ajratiladi
- WebSocket + TanStack Query integratsiyasi tabiiy
- Bundle size kichik (Zustand ~1KB + TanStack Query ~12KB vs Redux ~15KB + RTK Query ~15KB)

**Salbiy:**
- Redux dev ecosystem'idan foydalanib bo'lmaydi (Redux DevTools, middleware)
- Zustand'da time-travel debugging yo'q (lekin bizga kerak emas)
- TanStack Query learning curve bor (cache lifecycle tushunish kerak)

## Alternativlar ko'rib chiqildi

- **Redux Toolkit + RTK Query** — rad etildi (yuqorida)
- **Jotai** — rad etildi (atomic model bizning use-case uchun ortiqcha granular)
- **Recoil** — rad etildi (Meta deprecated, community kichik)
- **MobX** — rad etildi (observable pattern React ecosystem'da kamroq qo'llaniladi)
