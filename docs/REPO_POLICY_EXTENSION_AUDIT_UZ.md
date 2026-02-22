# Agent Orchestrator: Siyosat Mosligi va VS Code Extension Texnik Audit (UZ)

## 1. Hujjat maqsadi

Bu hujjat 3 ta savolga javob beradi:

1. `pkarnal.com` maqolasidagi da'volar ushbu repodagi real holat bilan mosmi?
2. Fork egasi uchun qo'yilgan lokal siyosat (AGENTS.md) open-source ruhiga va repo modeliga to'g'ri keladimi?
3. Loyihani VS Code extension sifatida chiqarish texnik jihatdan mumkinmi, va qanday arxitektura toza bo'ladi?

Tekshiruv sanasi: **2026-02-22**.

## 2. Qisqa xulosa (Executive verdict)

Umumiy baho: **MOS (85-90%)**, lekin 2 ta muhim drift bor.

- Mos: loyiha ochiq manba, MIT litsenziya, plugin-agnostic arxitektura, agent slotlari, z.ai/GLM yo'nalishi.
- Drift: maqolada `ao.config.yaml` ishlatilgan, hozirgi repoda asosiy konfiguratsiya `agent-orchestrator.yaml`.
- Drift: maqoladagi plugin soni va hozirgi repo holati orasida versiya farqi bor (repo evolyutsiyasi).

## 3. Maqola va GitHub moslik auditi

### 3.1. Maqola bo'yicha tekshiruv

`Open-Sourcing Agent Orchestrator` maqolasida quyidagilar ko'rsatilgan:

- Dastlabki chop etilgan sana: **2025-09-15**.
- Yangilangan sana: **2026-02-20**.
- Ochiq manba e'lon konteksti va pluginli arxitektura yondashuvi.

### 3.2. GitHub (Alicoder001 fork) va local repo faktlari

- GitHub repo sahifasida litsenziya: **MIT**.
- Local `LICENSE` fayli ham MIT.
- README'da plugin slot modeli va agent alternativlari (`claude-code`, `codex`, `aider`, `opencode`, `zai`) berilgan.
- Local kodda `packages/plugins/agent-zai` mavjud.
- Misol konfiguratsiya: `examples/zai-glm.yaml` mavjud.

### 3.3. Moslik natijasi

Mos keladigan bandlar:

- Ochiq manbalilik modeli.
- Plugin orqali kengaytiriladigan arxitektura.
- Agentlarni almashish imkoniyati.
- z.ai/GLM agent yo'nalishi.

Aniqlangan driftlar:

- Konfiguratsiya nomi drifti:
  - maqolada: `ao.config.yaml`
  - hozir: `agent-orchestrator.yaml`
- Versiya drifti:
  - maqoladagi ba'zi metrikalar (masalan plugin soni) repodagi eng yangi holatdan farq qilishi mumkin.

Bu driftlar kritik emas; ular odatda loyihaning tez iteratsiyasi bilan izohlanadi.

## 4. Fork siyosati (AGENTS.md) bilan moslik

Lokal siyosat:

- Push faqat `origin` ga.
- `upstream` ga push taqiqlangan.
- Ichki kodni o'zgartirish uchun `@unlock-internal-edit` talab qilinadi.

Baholash:

- Bu qoidalar open-source MIT litsenziyasiga zid emas.
- Bu qoidalar legal cheklov emas, balki **operatsion governance** (jamoa ichki jarayon) hisoblanadi.
- Ya'ni fork uchun xavfsiz va boshqaruvga qulay model.

## 5. Extension bo'yicha chuqur texnik baho

### 5.1. Hozirgi loyiha interfeyslari

Loyihada extension integratsiyasi uchun tayyor nuqtalar allaqachon bor:

- CLI: `ao` (`start`, `spawn`, `status`, `send`, `session`, `dashboard`).
- Web API (Next.js route'lar):
  - `POST /api/spawn`
  - `GET /api/sessions`
  - `POST /api/sessions/:id/send`
  - `GET /api/events` (SSE snapshotlar)
- Terminal oqimi: alohida WebSocket server (`direct-terminal-ws.ts`).

Natija: VS Code extension uchun backendni noldan yozish shart emas, mavjud AO runtime/APIga ulanib ishlash mumkin.

### 5.2. VS Code platforma cheklovlari va imkoniyatlari

Rasmiy VS Code API hujjatlariga ko'ra:

- Tree view provider (`registerTreeDataProvider`) bor.
- Webview panel (`createWebviewPanel`) bor.
- Webviewda CSP qo'yish tavsiya etiladi, user input sanitize qilinishi kerak.
- `localResourceRoots` bilan lokal fayl kirishini cheklash kerak.
- Browserdagi web extension Node.js API'larini ishlata olmaydi.

Demak AO uchun eng to'g'ri yo'l: **Desktop VS Code extension (Node extension host)**.

### 5.3. Tavsiya etilgan toza arxitektura (Recommended)

**Hybrid model (tavsiya):**

- Tree View: sessiyalar ro'yxati, status, attention level.
- Command Palette:
  - `AO: Start`
  - `AO: Spawn`
  - `AO: Send to Session`
  - `AO: Open Dashboard`
- Webview panel:
  - Session detail
  - Event stream (SSE)
  - Ixtiyoriy terminal embed (WS) yoki external browser fallback
- Service layer:
  - `AoProcessService` (CLI process lifecycle)
  - `AoApiClient` (HTTP + SSE)
  - `SessionStore` (state cache)

Afzalliklar:

- Existing AO komponentlarini qayta ishlatadi.
- Minimal coupling, testlash oson.
- Keyinchalik JetBrains yoki boshqa IDE uchun adapter yozish oson.

## 6. Rasmiy ro'yxatdan o'tkazish kerakmi?

Qisqa javob:

- Lokal yoki ichki foydalanish uchun: **shart emas**.
  - VS Code `Install from VSIX...` orqali o'rnatish mumkin.
- Marketplace'ga public chiqarish uchun: **ha, kerak**.
  - Publisher yaratish va extensionni marketplace'ga yuklash jarayoni bor.

## 7. Risklar va ehtiyot choralar

- Security: webview uchun qat'iy CSP, input sanitizatsiya, command injectiondan himoya.
- UX: terminal embed platformalar bo'yicha farq qilishi mumkin, fallback kerak.
- Operatsion: `ao start` lifecycle boshqaruvi aniq bo'lishi kerak (already running holatlari).

## 8. Yakuniy qaror

- Maqola va repo o'rtasida asosiy yo'nalish bo'yicha moslik yuqori.
- Fork siyosati amaliy va nazoratli; MIT modeliga zid emas.
- VS Code extension qilish texnik jihatdan to'liq mumkin.
- Eng yaxshi strategiya: mavjud AO CLI + Web API ustiga hybrid extension qurish.

## 9. Tavsiya etilgan keyingi bosqich (amaliy)

1. `docs/` ichida extension RFC ochish (`scope`, `MVP`, `security`, `release`).
2. Alohida package ochish: masalan `packages/vscode-extension`.
3. MVP: Tree + 4 command + sessions list + spawn/send flow.
4. So'ng webview session detail va SSE real-time update qo'shish.
5. Oxirida VSIX build va ichki pilot, keyin marketplace.

## 10. Manbalar

### Asosiy manbalar

- Maqola: https://pkarnal.com/blog/open-sourcing-agent-orchestrator
- Fork repo: https://github.com/Alicoder001/agent-orchestrator
- Upstream repo: https://github.com/ComposioHQ/agent-orchestrator

### VS Code rasmiy hujjatlari

- API reference: https://code.visualstudio.com/api/references/vscode-api
- Webview guide: https://code.visualstudio.com/api/extension-guides/webview
- Extension host: https://code.visualstudio.com/api/advanced-topics/extension-host
- Web extensions: https://code.visualstudio.com/api/extension-guides/web-extensions
- Publishing extension: https://code.visualstudio.com/api/working-with-extensions/publishing-extension
- Extension marketplace (VSIX install): https://code.visualstudio.com/docs/editor/extension-marketplace

### Local repo dalillari

- `README.md`
- `LICENSE`
- `AGENTS.md`
- `examples/zai-glm.yaml`
- `packages/plugins/agent-zai/src/index.ts`
- `packages/web/src/app/api/spawn/route.ts`
- `packages/web/src/app/api/events/route.ts`
- `packages/web/src/app/api/sessions/[id]/send/route.ts`
- `packages/web/server/direct-terminal-ws.ts`
