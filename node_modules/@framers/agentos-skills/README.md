<p align="center">
  <a href="https://agentos.sh"><img src="logos/agentos-primary-no-tagline-transparent-2x.png" alt="AgentOS" height="56" /></a>
  &nbsp;&nbsp;&nbsp;
  <a href="https://frame.dev"><img src="logos/frame-logo-green-no-tagline.svg" alt="Frame.dev" height="36" /></a>
</p>

# @framers/agentos-skills

**Curated SKILL.md prompt modules for AgentOS** — 72 staff-verified skills with a machine-readable registry index.

[![npm](https://img.shields.io/npm/v/@framers/agentos-skills?logo=npm&color=cb3837)](https://www.npmjs.com/package/@framers/agentos-skills)

```bash
npm install @framers/agentos-skills
```

> **This is the content package.** It contains 72 curated SKILL.md files and
> the auto-generated `registry.json` index — no runtime code, no dependencies.
>
> For the **catalog SDK** (query helpers, lazy loading, factory functions), see
> [`@framers/agentos-skills-registry`](https://github.com/framersai/agentos-skills-registry).
>
> For the **runtime engine** (SkillLoader, SkillRegistry, path utilities), see
> [`@framers/agentos`](https://github.com/framersai/agentos) (`@framers/agentos/skills`).

## What's Inside

This package bundles **72 curated SKILL.md files** organized under `registry/curated/`:

| Category       | Skills                                                                 |
| -------------- | ---------------------------------------------------------------------- |
| Developer      | `github`, `git`, `coding-agent`, `code-safety`, `structured-output`    |
| Social         | `twitter-bot`, `instagram-bot`, `linkedin-bot`, `facebook-bot`, `threads-bot`, `bluesky-bot`, `mastodon-bot`, `youtube-bot`, `tiktok-bot`, `pinterest-bot`, `reddit-bot`, `blog-publisher`, `social-broadcast` |
| Research       | `web-search`, `web-scraper`, `deep-research`, `summarize`, `company-research` |
| Productivity   | `notion`, `obsidian`, `trello`, `apple-notes`, `apple-reminders`, `spotify-player` |
| Communication  | `slack-helper`, `discord-helper`, `email-intelligence`                 |
| Voice          | `voice-conversation`, `whisper-transcribe`, `streaming-stt-*`, `streaming-tts-*`, `vosk`, `piper`, `porcupine`, `openwakeword`, `diarization` |
| Creative       | `image-gen`, `image-editing`, `audio-generation`, `video-generation`, `content-creator` |
| AI/ML          | `vision-ocr`, `multimodal-rag`, `ml-content-classifier`, `endpoint-semantic`, `grounding-guard`, `topicality`, `emergent-tools`, `pii-redaction` |
| Infrastructure | `cloud-ops`, `site-deploy`, `healthcheck`                              |
| Security       | `1password`                                                            |
| Other          | `memory-manager`, `account-manager`, `agent-config`, `seo-campaign`, `weather` |

Each skill is a Markdown file with YAML frontmatter:

```yaml
---
name: github
version: '2.0.0'
description: Full GitHub API integration
author: Wunderland
category: developer
tags: [github, git, repository]
requires_secrets: [github.token]
requires_tools: [github_search, github_repo_list]
metadata:
  agentos:
    emoji: "🐙"
    primaryEnv: GITHUB_TOKEN
    requires:
      bins: ['gh']
    install:
      - id: brew-gh
        kind: brew
        formula: gh
        bins: [gh]
---

# GitHub

[Markdown instructions for the agent...]
```

## Ecosystem

```
@framers/agentos/skills               ← Engine (SkillLoader, SkillRegistry, path utils)
@framers/agentos-skills               ← Content (you are here — 72 SKILL.md files + registry.json)
@framers/agentos-skills-registry      ← Catalog SDK (SKILLS_CATALOG, query helpers, factories)
```

| Package                              | Role            | What                                                    | Runtime Code |
| ------------------------------------ | --------------- | ------------------------------------------------------- | :----------: |
| **@framers/agentos/skills**          | **Engine**      | SkillLoader, SkillRegistry, path utils                  |     Yes      |
| **@framers/agentos-skills**          | **Content**     | 72 SKILL.md files + registry.json index                 |      No      |
| **@framers/agentos-skills-registry** | **Catalog SDK** | SKILLS_CATALOG, query helpers, lazy loaders, factories  |     Yes      |

> This layout mirrors the extensions ecosystem:
> `@framers/agentos-extensions` (content) + `@framers/agentos-extensions-registry` (SDK).

## Usage

### Direct JSON import

```typescript
import registry from '@framers/agentos-skills/registry.json';

console.log(`${registry.stats.totalSkills} skills available`);
for (const skill of registry.skills.curated) {
  console.log(`  ${skill.metadata?.emoji ?? '📦'} ${skill.name} — ${skill.description}`);
}
```

### Via the catalog SDK (recommended)

```typescript
import { searchSkills, loadSkillByName } from '@framers/agentos-skills-registry';

const matches = searchSkills('github');
const skill = await loadSkillByName('github');
console.log(skill?.content); // SKILL.md body ready for prompt injection
```

### Via the runtime engine

```typescript
import { SkillRegistry } from '@framers/agentos/skills';

const registry = new SkillRegistry();
await registry.loadFromDirs(['/path/to/agentos-skills/registry/curated']);
const snapshot = registry.buildSnapshot({ platform: 'darwin', strict: true });
console.log(snapshot.prompt);
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on adding new skills.

## License

MIT
