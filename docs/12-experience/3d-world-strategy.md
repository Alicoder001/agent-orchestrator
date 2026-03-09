# 3D World Strategy

## Maqsad

Ushbu hujjat platformaning uzoq muddatli 3D immersive muhit strategiyasini belgilaydi — virtual ofis dunyosi sifatida.

Bu hujjat `digital-office-model.md` (office metaphor), `2d-workspace-patterns.md` va `vision.md` ga asoslanadi.

---

## Vision

> Foydalanuvchilar virtual 3D ofisga "kirib", agent'larni xuddi hamkasblarini ko'rgandek ko'radi. Agent ish stolida o'tirib ishlayapti, yig'ilish xonasida PR review bo'lyapti, qahvaxonada idle agent'lar kutib o'tiradi.

---

## 3D Muhit Elements (V5+)

### Spaces

| Space | Real-world analog | Function |
|-------|-------------------|----------|
| **Lobby** | Kirishgah | Org overview, quick stats |
| **Department floor** | Qavat | Department'ning barcha team'lari |
| **Team room** | Ish xonasi | Team agent'lari va ularning status'i |
| **Meeting room** | Yig'ilish xonasi | PR review, sprint planning |
| **Server room** | Server xonasi | Infra monitoring, deployment status |
| **Coffee area** | Qahvaxona | Idle agent'lar, pause'dagi session'lar |

### Agent Avatars

| Status | Avatar holati |
|--------|-------------|
| `working` | Stolda o'tirib yozmoqda (keyboard animation) |
| `waiting_for_input` | Stol oldida kutib o'tirib — savol bubble bor |
| `needs_response` | Qo'l ko'tarib turadi — diqqat so'raydi |
| `review_requested` | Yig'ilish xonasida — PR hujjat ko'rsatib turadi |
| `idle` | Qahvaxonada — kafe o'tiradi |
| `failed` | Stol oldida — ❌ belgisi bilan |

---

## Technology Stack (V5+)

| Component | Texnologiya |
|-----------|-------------|
| 3D Engine | Three.js + React Three Fiber |
| Physics | Rapier (lightweight) |
| Avatars | ReadyPlayerMe yoki custom |
| Environment | Blender → glTF export |
| Lighting | Baked + real-time mix |
| Audio (optional) | Spatial audio (Web Audio API) |
| Multiplayer | WebSocket (real-time position sync) |

---

## Implementation Roadmap

| Phase | Deliverable |
|-------|-------------|
| V2 | 2D workspace (React Flow) — ground work |
| V3 | Isometric 2.5D view — bridge between 2D va 3D |
| V4 | Basic 3D lobby + team room (Three.js prototype) |
| V5 | Full 3D office — barcha space'lar, avatar'lar, real-time |
| V5+ | VR support (WebXR) — ixtiyoriy |

---

## Performance Budget

| Metric | Target |
|--------|--------|
| Initial load | < 3s (low-poly model'lar) |
| FPS | ≥ 30fps (mobile), ≥ 60fps (desktop) |
| Memory | < 200MB GPU memory |
| Asset size | < 10MB (compressed, lazy-loaded) |

---

## Versiya

- v1.0
- Status: **DRAFT** (V5 strategiyasi — hozircha concept level)
