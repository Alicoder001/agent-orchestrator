---
"@composio/ao-plugin-agent-zai": minor
"@composio/ao-core": minor
"@composio/ao-cli": minor
---

Add a built-in `zai` agent plugin to run z.ai GLM models through the Claude-compatible API.

This includes:
- new `@composio/ao-plugin-agent-zai` package
- plugin registration in core and CLI/Web integration points
- typed project config fields for z.ai (`zaiApiKeyEnv`, `zaiBaseUrl`, `zaiModel`)
- setup/docs/examples updates for configuring `agent: zai`
