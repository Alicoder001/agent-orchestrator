# ADR-002: Desktop App uchun Tauri tanlanadi

## Status
ACCEPTED

## Kontekst

Platforma local runtime capability talab qiladi:
- tmux/process orqali agent'larni local ishga tushirish
- Terminal stream'ini olish va ko'rsatish
- Filesystem va workspace access
- Offline yoki low-connectivity scenario'lar
- Native OS integration (notification, tray, shell)

Alternativlar: Electron, Tauri, NW.js.

## Qaror

Desktop app uchun **Tauri** (Rust + React) tanlanadi.

## Sabab

**Tauri tanlash sabablari:**
- Memory footprint: Tauri ~10MB vs Electron ~150MB (Chromium butun browser bundle qiladi)
- Security: Rust backend, minimal attack surface, no Node.js runtime
- Native capability: `tauri::command` orqali Rust va React'ni bog'lash toza
- Local process/shell execution Rust'da xavfsizroq va aniqroq
- Web UI React bilan yoziladi — web surface bilan kod ulashish mumkin

**Electron rad etilish sababi:**
- Bundle hajmi juda katta (150-300MB)
- Memory usage og'ir (Chromium + Node.js)
- Security model zaif — Node.js to'liq kirish huquqi
- Platform'imiz uchun Electron'ning afzalligi yo'q

## Oqibatlar

**Ijobiy:**
- Yengil, tez, kichik installer
- Local runtime orqali agent'lar internet'siz ishlaydi
- Rust orqali OS-level capability xavfsiz

**Salbiy:**
- Rust bilimi kerak (Tauri command'lar uchun)
- Tauri ekotizimi Electron'ga nisbatan kichikroq
- Ba'zi Electron plugin'lar Tauri'da mavjud emas

## Alternativlar ko'rib chiqildi

- Electron — rad etildi (yuqorida)
- Flutter — rad etildi (web UI bilan kod ulashish qiyin)
- Native (Swift/C++) — rad etildi (cross-platform qiyin)
