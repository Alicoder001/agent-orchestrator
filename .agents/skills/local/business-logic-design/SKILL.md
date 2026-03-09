---
name: "business-logic-design"
description: "Design business logic boundaries, use cases, domain services, validation rules, and workflow behavior for a product domain. Use when product and domain intent are known and the team needs to formalize how core business behavior should work before service or API implementation. Do not use for platform infrastructure, repo structure, or release/governance design."
---

# Business Logic Design

## Objective

Make business behavior explicit and implementation-ready.

## Core Outputs

- use case map
- business rule model
- domain services
- workflow rules
- validation model

## Working Rules

- Model business intent before technical handlers.
- Keep invariants explicit.
- Separate policy from transport and persistence.
- Describe happy path and failure path.
- Stay inside domain behavior, not infra topology.

## Placeholders To Fill

- key use cases
- business invariants
- domain services
- approval rules
- failure handling
