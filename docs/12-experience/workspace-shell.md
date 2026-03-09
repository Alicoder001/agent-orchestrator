# Workspace Shell

## Maqsad

Ushbu hujjat platformaning desktop (Tauri) va web uchun umumiy workspace qobig'i (shell) — navigation, layout va cross-surface dizaynini belgilaydi.

Bu hujjat `surface-and-access-model.md` (multi-surface), `operator-dashboard-model.md` va `ADR-002` (Tauri) ga asoslanadi.

---

## Shell nima

Shell — barcha surface'lar (web, desktop, mobile) uchun umumiy tarkibiy qobiq. Navigation, layout va theming'ni boshqaradi.

---

## Shell Architecture

```
┌──────────────────────────────────────┐
│              Shell                    │
│  ┌──────────┐  ┌──────────────────┐  │
│  │ Sidebar  │  │                  │  │
│  │          │  │   Page Content   │  │
│  │ Nav      │  │   (React Router) │  │
│  │ Org      │  │                  │  │
│  │ Switcher │  │                  │  │
│  └──────────┘  └──────────────────┘  │
│  ┌──────────────────────────────────┐│
│  │     Status Bar (optional)        ││
│  └──────────────────────────────────┘│
└──────────────────────────────────────┘
```

---

## Cross-Surface Adaptation

| Element | Web | Desktop (Tauri) | Mobile (V3+) |
|---------|-----|-----------------|---------------|
| Navigation | Top + Sidebar | Sidebar (native feel) | Bottom tab bar |
| Window controls | Browser tabs | Custom title bar | OS native |
| Notifications | Browser notification API | Native OS notification | Push notification |
| File access | Upload/download | Direct file system | Limited |
| Shortcuts | Web keyboard | OS-level + custom | Gesture |
| Offline | Service worker (limited) | Full offline support | Cached views |

---

## Shell Components

### Sidebar

```typescript
interface SidebarProps {
  currentOrg: Organization;
  navigation: NavItem[];
  collapsed: boolean;
}

// NavItem structure
interface NavItem {
  label: string;
  icon: IconComponent;
  path: string;
  badge?: number;        // unread/attention count
  attention?: AttentionZone; // color indicator
}
```

### Organization Switcher

```
┌─────────────────────┐
│  Acme Corp    ▾     │
├─────────────────────┤
│  ✓ Acme Corp        │
│    Personal Space    │
│    Client Project    │
├─────────────────────┤
│  + Create Org        │
└─────────────────────┘
```

### Command Palette

`Ctrl+K` / `Cmd+K` — global search va quick action:

```
┌─────────────────────────────────────┐
│  🔍 Search or jump to...            │
├─────────────────────────────────────┤
│  📁 Projects                        │
│     api-server                      │
│     web-dashboard                   │
│  ⚡ Sessions                        │
│     #42 Fix auth middleware         │
│  🎯 Actions                         │
│     Spawn new session               │
│     Create project                  │
└─────────────────────────────────────┘
```

---

## Theming

| Theme | Tavsif |
|-------|--------|
| Light | Default aydosh tema |
| Dark | Qorong'u tema (developer preference) |
| System | OS setting'ga mos |

### Design tokens

```css
:root {
  --color-primary: #6366f1;    /* Indigo */
  --color-success: #22c55e;    /* Green */
  --color-warning: #f59e0b;    /* Amber */
  --color-danger: #ef4444;     /* Red */
  --color-info: #3b82f6;       /* Blue */
  --radius: 8px;
  --font-sans: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

---

## Versiya

- v1.0
- Status: **APPROVED**
