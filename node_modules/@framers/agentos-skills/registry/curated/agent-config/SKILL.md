---
name: agent-config
description: Export and import agent configurations for sharing and backup
version: 1.0.0
tags: [agent, config, export, import, yaml, json]
tools_required: []
---

# Agent Configuration

Export agent configurations as portable YAML/JSON files for sharing, backup, and migration. Import configurations to recreate agents.

## Capabilities
- **Export**: Save agent config with instructions, tools, personality, guardrails
- **Import**: Recreate agent from exported config
- **Secret redaction**: API keys automatically redacted on export
- **Round-trip**: Export -> edit -> import workflow

## Example
"Export my research agent to a file"
"Import this agent configuration"
"Share my agent config with the team"
