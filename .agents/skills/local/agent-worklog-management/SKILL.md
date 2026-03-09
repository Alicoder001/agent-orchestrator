---
name: "agent-worklog-management"
description: "Design and maintain lightweight worklog structures for multiple AI agents and workstreams, including status boards, per-agent logs, handoff notes, and update cadence. Use when a project needs traceable execution without noisy or conflicting shared logs. Do not use for governance policy, architecture decisions, or release process design."
---

# Agent Worklog Management

## Objective

Keep agent execution observable without creating log chaos.

## Core Outputs

- status board
- per-agent worklogs
- per-workstream logs
- handoff notes

## Working Rules

- Use one log per agent or workstream.
- Keep shared boards summary-only.
- Prefer append-only updates.
- Record blockers and handoffs explicitly.
- Treat worklogs as execution artifacts, not policy documents.

## Placeholders To Fill

- agent roster
- workstream roster
- update cadence
- blocker format
- handoff format
