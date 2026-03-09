# Legacy Monorepo Analysis

## Purpose

Preserve a stable reference analysis of the archived legacy monorepo so future architecture and migration decisions can reuse the findings without re-discovery.

## Important Context

The archived repository contains two layers:

1. the original legacy Agent Orchestrator system
2. a later bootstrap of the new monorepo that was temporarily moved into the archive

Because of this, root-level files inside `legacy-monorepo/` are not a clean source of truth for the original system. The most reliable legacy references are:

- `legacy-monorepo/packages/`
- `legacy-monorepo/docs/`
- `legacy-monorepo/scripts/`
- `legacy-monorepo/.github/workflows/`
- `legacy-monorepo/work-items/`

## High-Level Assessment

The legacy monorepo is not just obsolete code. It is a strong reference system with valuable architecture, product, design, and workflow patterns.

### Key strengths

- plugin-oriented architecture
- strong core session lifecycle model
- serious CLI and dashboard surfaces
- integration-test mindset
- strong design thinking around operator workflows
- useful planning and operational artifacts

### Main weaknesses

- root-level archive state is historically mixed
- some product surfaces are only partially integrated
- static plugin wiring in web weakens parity with CLI
- scripts and tooling contain historical workflow coupling
- `workspace-studio` is visually valuable but mock-driven and not yet product-grounded

## Monorepo Shape

The legacy system includes:

- 8 main packages
- 18 plugin packages
- 14 docs files under `legacy-monorepo/docs/`
- 8 work-item planning files under `legacy-monorepo/work-items/`

### Main package groups

- `core`: domain contracts, config, lifecycle, metadata, paths, plugin registry
- `cli`: operational command surface
- `web`: dashboard and session UI
- `desktop`: shell and sidecar foundation
- `integration-tests`: real runtime validation
- `plugins`: adapters for agents, runtimes, trackers, terminals, notifications, workspaces
- `workspace-studio`: premium shell concept for workspace visualization
- `agent-orchestrator`: thin wrapper package for global CLI distribution

## What the Legacy System Really Is

The system is fundamentally an orchestration platform for parallel AI coding agents.

Its dominant model is:

- a central core defines contracts and lifecycle
- plugins adapt external tools and runtimes
- CLI acts as the operator surface
- web acts as the visual monitoring and action surface
- runtime state is stored in flat metadata and polled over time

## Core Layer Summary

`legacy-monorepo/packages/core` is the strongest and most reusable part of the legacy system.

### Why it matters

- it defines the source-of-truth interfaces
- it owns session lifecycle and orchestration state transitions
- it encodes the plugin system cleanly
- it contains the most reusable conceptual architecture for the new platform

### Most valuable concepts

- plugin slots as a first-class architecture boundary
- session manager as the core orchestration engine
- lifecycle manager as the reaction and state machine engine
- path and metadata strategy for runtime persistence
- config loading and validation as a central concern

### Recommendation

Treat legacy `core` as a conceptual reference model, not as code to copy blindly.

## CLI Layer Summary

`legacy-monorepo/packages/cli` is a practical operator surface.

### What it does well

- clear command decomposition
- strong orchestration affordances
- direct usability for power users
- operational shortcuts for spawning, sending, session control, and dashboard launch

### Recommendation

Use the CLI as a reference for operator workflows and command taxonomy, not as a final design for the new repo.

## Web Layer Summary

`legacy-monorepo/packages/web` is a serious dashboard surface, not a toy UI.

### What it does well

- attention-oriented dashboard model
- session detail and orchestrator detail flows
- API endpoints for session operations
- terminal integration
- good testing coverage around dashboard logic

### Main limitation

The web layer statically registers a narrowed plugin subset, which can create feature drift relative to the CLI and the broader plugin system.

### Recommendation

Keep the dashboard attention model and operational UX ideas. Rebuild the service wiring more cleanly in the new system.

## Desktop Layer Summary

`legacy-monorepo/packages/desktop` is a foundation package rather than a finished product surface.

### What it contributes

- shell profiles
- shell capability probing
- sidecar management
- Tauri-related execution groundwork

### Recommendation

Treat this as infrastructure research and reusable shell/runtime knowledge, not as a v1 product anchor.

## Plugin Ecosystem Summary

The plugin ecosystem is one of the legacy system's strongest architectural ideas.

### Plugin categories

- agent
- runtime
- workspace
- tracker
- scm
- notifier
- terminal

### Strength

The system is intentionally extensible and testable because the contracts are defined centrally and adapters remain relatively thin.

### Tradeoff

The number of packages creates maintenance overhead and increases the chance of capability drift between surfaces.

### Recommendation

Keep plugin boundaries in the new system, but be stricter about which plugins are product-critical and which are optional extensions.

## Docs and Design Artifact Summary

The legacy documentation is valuable, especially the design briefs.

### Most useful artifacts

- `legacy-monorepo/docs/design/design-brief.md`
- `legacy-monorepo/docs/design/session-detail-design-brief.md`
- `legacy-monorepo/docs/design/orchestrator-terminal-design-brief.md`
- `legacy-monorepo/docs/DEVELOPMENT.md`
- `legacy-monorepo/docs/USER_GUIDE_UZ.md`
- `legacy-monorepo/ARCHITECTURE.md`

### What they provide

- product intent
- operator experience principles
- density-first dashboard thinking
- visual system references
- implementation deltas and audit notes

### Recommendation

These documents should inform the new docs-first architecture process, but not be copied as-is. Their ideas should be restructured into the new documentation tree.

## Workspace Studio Summary

`legacy-monorepo/packages/workspace-studio` is not a finished product, but it is strategically important.

### What it is

A premium workspace shell concept that combines:

- organization and project switching
- 2D office map
- 3D environment
- docked chat
- agent/team presence visualization

### What makes it valuable

- it reframes the product as a workspace shell, not just a dashboard
- it introduces stronger spatial and organizational UX
- it has a clear visual identity that feels more premium than a standard control panel

### Where the style comes from

Its minimal style is driven by:

- IBM Plex Sans and IBM Plex Mono
- warm light canvas backgrounds
- dark structured top bar
- soft border-based cards
- docked interaction surfaces
- restrained accent usage

### Product reality

The data model inside `workspace-studio` is mostly mock-driven. It is currently a design spike, not a reliable product implementation.

### Most reusable pieces

- 2D workspace shell
- docked chat interaction model
- organization and project switcher pattern
- team and agent presence framing

### Lower-priority pieces

- 3D environment
- fictitious company data model

### Recommendation

Do not ship `workspace-studio` as a separate parallel product. Instead, use it as the visual shell layer for the future orchestrator experience.

The preferred direction is:

- keep the 2D workspace shell
- keep the docked chat pattern
- integrate real orchestrator state into that shell
- treat 3D as optional or later-stage enhancement

## Operational Maturity Summary

The legacy system shows real operational intent.

### Signals of maturity

- CI workflows
- integration test workflow
- release workflow
- security workflow
- onboarding test workflow
- security documentation
- local scripts for repeated operator tasks

### Recommendation

Carry forward the discipline, not the exact implementation details. The new repo should rebuild these concerns with cleaner boundaries.

## What to Preserve

- core conceptual architecture
- plugin boundary model
- session lifecycle and reaction thinking
- dashboard attention model
- strong design briefs
- integration-test mindset
- workspace shell ideas from `workspace-studio`

## What to Rebuild

- root monorepo contract
- docs hierarchy
- web service wiring
- workspace-studio data model
- scripts and operational entrypoints
- product packaging and surface integration

## What to Avoid Repeating

- mixed root state that confuses source of truth
- capability drift between CLI and web
- mock-heavy UI shells without a real domain model
- carrying forward historical scripts that encode past constraints

## Final Conclusion

The legacy monorepo should be treated as a reference library of strong ideas, not as a codebase to revive.

The most important synthesis for the new system is:

- legacy `core` provides the architectural backbone
- legacy `web` provides the operator dashboard model
- legacy `workspace-studio` provides the premium shell and spatial UX direction

The best future direction is not to recreate the old system exactly, but to unify these three strengths into a cleaner, docs-first, architecture-led platform.
