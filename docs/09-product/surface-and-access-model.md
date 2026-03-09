# Surface and Access Model

## Maqsad

Ushbu hujjat platformaning foydalanuvchiga ko'rinadigan kirish nuqtalarini belgilaydi.

Platforma bitta client bilan cheklanmaydi. U bir nechta surface orqali ishlaydi va har bir surface bir xil platforma haqiqatiga ulanadi.

## Asosiy prinsip

Platforma:

- `surface-agnostic`
- `client-agnostic`
- `access-model-agnostic`

bo'lishi kerak.

Bu degani foydalanuvchi qayerdan kirishidan qat'i nazar, u bir xil organization, project, workflow va agent ekotizimiga ulanadi.

## Rasmiy qo'llab-quvvatlanadigan surface'lar

### Web

`Web` platformaning asosiy universal surface'i hisoblanadi.

U quyidagilar uchun ishlatiladi:

- operator dashboard
- project spaces
- team va department visibility
- workflow monitoring
- admin va governance surface

### Desktop

`Desktop` kuchli local-native surface hisoblanadi.

U quyidagilar uchun ishlatiladi:

- local runtime orchestration
- terminal va session control
- workspace access
- secure local integrations
- desktop-native workflow

### CLI

`CLI` professional operator va developer surface hisoblanadi.

U quyidagilar uchun kerak:

- automation
- scripting
- headless execution
- CI/CD integration
- terminal-native workflows

### VS Code Extension

`VS Code Extension` editor-native surface hisoblanadi.

U quyidagilar uchun kerak:

- editor ichidan agent workflow
- project context bilan ishlash
- file-aware orchestration
- in-editor collaboration

### Mobile

`Mobile` primary execution surface emas.

U secondary operational surface hisoblanadi va quyidagilar uchun ishlatiladi:

- monitoring
- approvals
- notifications
- intervention
- high-level visibility

## Access modellari

Platforma quyidagi access modellari bilan ishlaydi:

- authenticated web session
- desktop-authenticated session
- CLI-authenticated session
- API token access
- local runtime access

Bu access modellari bitta security va policy qatlamiga ulanadi.

## API token modeli

`API token` first-class integratsiya mexanizmi sifatida qo'llab-quvvatlanadi.

Bu quyidagilar uchun kerak:

- external integrations
- automation scripts
- headless clients
- partner tools
- custom enterprise connectors

API token access web yoki desktop sessiondan past darajadagi model emas. U alohida, nazoratli, audit qilinadigan kirish turi hisoblanadi.

## Product qoidasi

Hech bir surface:

- platformaning yagona haqiqati bo'lmaydi
- core workflow'ni o'z ichiga qamab qo'ymaydi
- boshqa surface'larni ikkinchi darajali qilib qo'ymaydi

Shu sabab:

- web ham birinchi sinf
- desktop ham birinchi sinf
- CLI ham strategik surface
- VS Code extension ham product ekotizimining tabiiy qismi

## Yakuniy hukm

Platforma bitta ilova emas.

U:

- `web platform`
- `desktop runtime shell`
- `CLI control surface`
- `editor extension layer`
- `mobile operations surface`

ko'rinishida ishlaydigan ko'p-surface mahsulot hisoblanadi.
