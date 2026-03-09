# Agent Orchestrator

This repository has been reset for a new, production-grade monorepo build.

## Structure

- `legacy-monorepo/`: archived previous implementation kept for reference only
- `apps/`: deployable applications
- `packages/`: shared libraries and domain modules
- `tooling/`: reusable internal tooling and configs

## Principles

- Keep the new monorepo clean and explicit.
- Do not wire `legacy-monorepo/` into workspace tooling.
- Build from stable boundaries first: apps, packages, tooling, docs.
