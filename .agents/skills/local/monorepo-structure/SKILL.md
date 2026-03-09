---
name: "monorepo-structure"
description: "Design and refine only the repository structure layer, including monorepo root layout, package taxonomy, app boundaries, tooling layout, and workspace rules. Use after foundation and system architecture are sufficiently stable and the team needs to turn decisions into folders, packages, and dependency boundaries. Do not use for product vision, bounded-context definition, or governance policy."
---

# Monorepo Structure

## Objective

Turn architecture into a clean repository layout.

## Core Outputs

- root directory strategy
- apps and packages taxonomy
- tooling layout
- workspace boundaries
- dependency direction rules

## Working Rules

- Do not create folders without a clear ownership model.
- Keep root shallow and intentional.
- Separate deployable apps from reusable packages.
- Reflect bounded contexts in package grouping.
- Assume architecture exists; this skill translates it into repo form.

## Placeholders To Fill

- root folders
- package classes
- app classes
- cross-cutting tooling
- boundary rules
