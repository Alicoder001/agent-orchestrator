---
name: "system-architecture"
description: "Design only the system architecture layer for a platform, including system context, bounded contexts, application architecture, data architecture, integration architecture, security architecture, and deployment architecture. Use when foundation and product intent are already clear and the team needs stable technical boundaries before implementation. Do not use for monorepo folder design, governance, release process, or general product vision."
---

# System Architecture

## Objective

Translate product intent into stable architectural boundaries.

## Core Outputs

- system context
- bounded contexts
- application architecture
- data architecture
- integration architecture
- security architecture
- deployment architecture

## Working Rules

- Start from boundaries, not frameworks.
- Distinguish domain logic from infrastructure.
- Record constraints and tradeoffs.
- Keep each architecture document scoped to one concern.
- Do not turn architecture work into folder layout decisions inside this skill.

## Placeholders To Fill

- external systems
- context boundaries
- deployable units
- trust boundaries
- critical flows
