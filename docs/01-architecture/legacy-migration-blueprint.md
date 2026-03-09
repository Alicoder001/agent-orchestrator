# Legacy Migration Blueprint

## Purpose

Define a professional migration strategy from the archived legacy monorepo into a new, architecture-led platform without dragging forward historical coupling, unstable abstractions, or product confusion.

This document is downstream from:

- `docs/01-architecture/legacy-monorepo-analysis.md`

It should be used as a decision guide, not as a code migration checklist.

## Executive Position

The legacy monorepo should not be revived.

The correct strategy is:

1. preserve the legacy system as a reference archive
2. extract the strongest ideas and patterns intentionally
3. rebuild the new platform from first principles
4. migrate concepts before migrating code

This is not a "rewrite everything blindly" plan. It is a selective architectural salvage and redesign plan.

## Migration Goals

- preserve the strongest conceptual assets from legacy
- avoid carrying forward accidental complexity
- unify product, operator, and workspace experiences into one coherent platform
- turn legacy experiments into deliberate architecture decisions
- make the new monorepo the only active source of truth

## Non-Goals

- restore the legacy monorepo to active development
- copy packages wholesale into the new repo
- preserve backward compatibility with every legacy script or surface
- keep parallel active product surfaces without a clear ownership model
- migrate mock-driven UI shells as if they were production systems

## Source Classification

The legacy archive should be treated in four classes.

### Class A: Conceptual Gold

These should directly influence the new platform architecture.

- legacy core architecture
- plugin boundary model
- session lifecycle model
- attention-oriented dashboard model
- design briefs for dashboard and session investigation
- workspace shell ideas from `workspace-studio`

### Class B: Selective Reuse Candidates

These may be partially reused after re-evaluation.

- CLI command taxonomy
- web API route design
- shell and sidecar concepts from desktop
- testing patterns from integration tests
- selected plugin implementations

### Class C: Reference Only

These are useful for context but should not anchor the new system.

- historical scripts
- ad hoc operational shortcuts
- planning artifacts in `work-items`
- legacy docs with mixed authorship or outdated assumptions

### Class D: Do Not Carry Forward

These should remain archived unless a specific exception is approved.

- mixed root contract from the archive
- temporary bootstrap artifacts moved into legacy
- mock-first UI data models
- duplicated operational entrypoints with unclear ownership

## Strategic Architecture Direction

The new platform should synthesize three different legacy strengths.

### 1. Core Backbone

Take from legacy `core`:

- system contracts
- orchestration lifecycle
- state transitions
- explicit plugin slots
- metadata and session identity discipline

### 2. Operator Control Surface

Take from legacy `web`:

- attention zones
- merge and response prioritization
- session investigation model
- terminal-first debugging experience

### 3. Premium Workspace Shell

Take from `workspace-studio`:

- organization and project shell
- spatial 2D workspace framing
- docked chat interaction model
- stronger sense of team and agent presence

### Synthesis Rule

The future product should not be:

- only a dashboard
- only a CLI
- only a workspace shell

It should be:

- a workspace-native orchestrator platform
- with an operator dashboard at its core
- and an architecture backbone grounded in explicit contracts

## Preservation Strategy

### What We Preserve As-Is

Preserve in the archive only:

- legacy source tree
- design references
- historical plans
- old scripts
- old workflow files

Do not normalize the archive into the new standard. It is an archive, not an active subsystem.

### What We Translate Into New Docs

Translate from legacy into new documentation:

- architectural patterns
- product lessons
- UX principles
- migration decisions
- reasons for rejecting certain legacy approaches

### What We Rebuild Fresh

Rebuild in the new platform:

- root monorepo contract
- bounded context model
- package taxonomy
- app taxonomy
- configuration strategy
- release workflow
- ownership model
- runtime service composition

## Migration Workstreams

The migration should be executed in deliberate workstreams rather than package-by-package copying.

## Workstream 1: Foundations

### Objective

Define what the new platform is before defining its code shape.

### Deliverables

- vision
- scope
- business context
- product map
- domain map
- success criteria

### Exit Criteria

- product boundaries are written clearly
- v1 scope is bounded
- non-goals are explicit

## Workstream 2: Architecture

### Objective

Turn legacy lessons into new architectural boundaries.

### Deliverables

- system context
- bounded contexts
- application architecture
- business logic architecture
- data architecture
- integration architecture
- deployment architecture
- security architecture

### Exit Criteria

- core domains are separated from infra concerns
- deployable units are identified
- external integration boundaries are explicit

## Workstream 3: Product Shell

### Objective

Define the future product surface by combining dashboard and workspace-shell thinking.

### Deliverables

- unified UX direction
- shell layout model
- dashboard placement model
- chat interaction model
- terminal interaction model
- role-based operator flows

### Exit Criteria

- it is clear how `workspace-studio` concepts will be integrated
- it is clear what remains experimental
- a v1 UX shell is selected

## Workstream 4: Monorepo Structure

### Objective

Map architecture into packages, apps, tooling, and repo rules.

### Deliverables

- root folder strategy
- package classes
- app classes
- dependency direction rules
- repo-local skills and docs placement

### Exit Criteria

- no folder exists without a reason
- package boundaries reflect domain and product decisions
- the repo can scale without structural ambiguity

## Workstream 5: Implementation Readiness

### Objective

Prepare the new repo for real implementation without importing legacy chaos.

### Deliverables

- base tooling config
- code generation or templates where needed
- release and changelog policy
- testing strategy
- worklog model
- governance model

### Exit Criteria

- the new repo is operable before feature work starts
- contributors and agents can work from clear rules

## Workspace Studio Integration Policy

This is the most important product-facing migration decision.

### Decision

`workspace-studio` should be treated as a shell concept, not as an independent application to preserve.

### Keep

- 2D workspace model
- project and organization switchers
- docked chat pattern
- visual language around presence and team zones

### Defer

- 3D environment
- immersive scene work
- mock corporate storytelling layer

### Reject

- carrying over mock entities as foundational domain objects
- shipping the studio as a separate product track with no operator grounding

### Implication

The new system should absorb the studio's strongest UX ideas into the main orchestrator experience, not branch into a second unrelated interface direction.

## Plugin Migration Policy

The new system should keep plugin thinking, but not all legacy plugins deserve first-class status in v1.

### Preserve Conceptually

- agent plugins
- runtime plugins
- workspace plugins
- tracker plugins
- notifier plugins
- terminal plugins

### Re-evaluate Operationally

For each plugin class, decide:

- is it needed in v1
- is it strategic or optional
- does it belong in the core repo or as an extension
- does it have test coverage worth preserving

### Rule

Plugin extensibility stays. Plugin sprawl does not.

## UI Migration Policy

There are two different valuable UI directions in legacy:

- the operational dashboard
- the workspace shell

The new platform should merge them through hierarchy, not through compromise.

### Proposed hierarchy

- top layer: workspace shell
- primary working layer: operator dashboard
- deep inspection layer: session detail and orchestrator terminal

### Anti-pattern to avoid

Do not create two separate primary products:

- one dashboard product
- one workspace product

That would recreate legacy fragmentation in a more polished form.

## Operational Migration Policy

Legacy workflows prove that operational discipline matters. The new platform should re-establish these concerns from scratch.

### Carry forward in principle

- CI rigor
- security checks
- integration testing
- release discipline
- onboarding discipline

### Rebuild cleanly

- workflow names
- validation stages
- release flow
- local development process
- internal governance hooks

## Decision Gates

The migration should pause for explicit review at these gates.

### Gate 1: Foundation Approved

Before architecture docs are finalized.

### Gate 2: Architecture Approved

Before repo structure or package layout is committed.

### Gate 3: Product Shell Approved

Before UI implementation starts.

### Gate 4: Monorepo Structure Approved

Before creating long-lived app and package skeletons.

### Gate 5: Implementation Readiness Approved

Before feature work begins.

## Main Risks

### Risk 1: Copying code too early

If code migration starts before documentation and boundaries stabilize, legacy complexity will simply be renamed and preserved.

### Risk 2: Over-romanticizing legacy

Some parts of legacy are strong references, but not everything old is strategically useful.

### Risk 3: Splitting the UI into two products

If dashboard and workspace shell are treated as parallel primary surfaces, the new system will inherit fragmentation.

### Risk 4: Plugin sprawl

If all legacy plugins are treated as equally important, v1 will become structurally bloated.

### Risk 5: Mock-first thinking

If `workspace-studio` mock entities are treated as real product modeling, the new domain design will become theatrical instead of operational.

## Recommended Order of Execution

1. finish foundation docs
2. finish architecture docs
3. define workspace-shell plus dashboard synthesis
4. define monorepo structure
5. define governance and operational rules
6. create minimal app and package skeletons
7. start implementation from core platform slices

## Final Recommendation

The correct migration is selective, documentation-led, and architecture-first.

The archive should remain intact.

The new platform should intentionally combine:

- the discipline of legacy `core`
- the operator power of legacy `web`
- the premium shell language of `workspace-studio`

The team should migrate decisions, patterns, and principles first.

Only after those are stable should implementation begin.
