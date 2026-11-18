<p align="center">
  <a href="https://agentos.sh"><img src="logos/agentos-primary-no-tagline-transparent-2x.png" alt="AgentOS" height="56" /></a>
  &nbsp;&nbsp;&nbsp;
  <a href="https://frame.dev"><img src="logos/frame-logo-green-no-tagline.svg" alt="Frame.dev" height="36" /></a>
</p>

# @framers/agentos-extensions-registry

Extension catalog for AgentOS — metadata, query helpers, and `createCuratedManifest()` factory.

[![npm](https://img.shields.io/npm/v/@framers/agentos-extensions-registry?logo=npm&color=cb3837)](https://www.npmjs.com/package/@framers/agentos-extensions-registry)

## What this package is

This is the **catalog and SDK** for AgentOS extensions. It does not contain extension source code — it provides:

- **Static metadata catalogs** (`CHANNEL_CATALOG`, `TOOL_CATALOG`, `PROVIDER_CATALOG`) describing every known extension: its name, package, SDK, required secrets, and capabilities.
- **Query helpers** (`getChannelEntry()`, `getToolEntry()`, `getProviderEntry()`) for looking up catalog entries at runtime.
- **Dynamic loader** (`createCuratedManifest()`) that resolves which extension packages are actually installed, then builds an `ExtensionManifest` the AgentOS runtime can consume.

## Architecture: catalog vs. source code

| Package | Role |
|---|---|
| `@framers/agentos-extensions` | **Source code** — the actual channel adapters, tool implementations, and extension packs |
| **`@framers/agentos-extensions-registry`** (this) | **Catalog/SDK** — indexes the extensions above, stores metadata, and dynamically loads whichever packages are installed |
| `@framers/agentos` | **Runtime** — provides `ITool`, `IChannelAdapter`, `ExtensionManifest`, and the agent kernel that consumes the manifest |

**Dependency direction:** this package depends on `@framers/agentos` for runtime types (peer dep) and references extension packages from `@framers/agentos-extensions` as optional dependencies. Only installed extensions are loaded; missing packages are silently skipped.

## Lazy and optional by design

The catalog and the runtime are decoupled on purpose. The four DI layers below operate independently, so a host pays for exactly what it installs and uses.

### Layer 1: optional `peerDependenciesMeta` per extension

Every catalog entry in `CHANNEL_CATALOG`, `TOOL_CATALOG`, and `PROVIDER_CATALOG` references its npm package by name only. This package does not import them eagerly. `peerDependenciesMeta.optional: true` keeps `npm install` from pulling extension source unless the host explicitly adds the package to its own `package.json`.

### Layer 2: `import.meta.resolve()` skips uninstalled packages at manifest build

`createCuratedManifest()` walks the requested filter (`tools: 'all' | string[] | 'none'`, `channels: ...`) and calls `import.meta.resolve(packageName)` per entry. Failures are swallowed; the entry is dropped from the output manifest. The runtime never sees an unresolvable pack. `getAvailableExtensions()` and `getAvailableChannels()` expose this resolution state for hosts that want to surface installed extensions in their own UI or logs.

### Layer 3: per-extension `requiredSecrets` in catalog metadata

`CHANNEL_CATALOG` and `TOOL_CATALOG` entries declare which secret keys an extension expects (mapped to environment variables via `SECRET_ENV_MAP`). When the runtime activates a descriptor, it consults `requiredSecrets` and skips activation if a non-optional secret is unresolvable. Optional secrets unlock optional features (the LLM judge in pii-redaction, the LLM fallback in topicality and ml-classifiers) without making them required.

### Layer 4: heavy resources defer to `SharedServiceRegistry`

The runtime's `ExtensionLifecycleContext.services` exposes a `getOrCreate(key, factory)` API. Packs register factories at activation; the factory only runs on the first call that asks for the key. Subsequent calls (other tools in the same pack, the streaming guardrail, supervisor agents) share the cached instance. The 110MB BERT NER model in pii-redaction, the ONNX classifier orchestrator in ml-classifiers, the NLI entailment pipeline in grounding-guard, and the embedding model in topicality all lazy-load this way.

### What this looks like end-to-end

```typescript
// 1. Host installs the registry SDK + only the extensions it wants.
//    npm install @framers/agentos @framers/agentos-extensions-registry
//                @framers/agentos-ext-pii-redaction

import { AgentOS } from '@framers/agentos';
import { createCuratedManifest } from '@framers/agentos-extensions-registry';

// 2. Manifest build resolves only what's installed.
const manifest = await createCuratedManifest({ tools: 'all' });
// → manifest.packs.length === 1 (only the PII redaction pack made it).

// 3. AgentOS activates the pack. The 110MB NER model is NOT loaded yet —
//    SharedServiceRegistry just registered a factory under 'pii:ner-model'.
const agent = new AgentOS();
await agent.initialize({ extensionManifest: manifest });

// 4. First user message hits the input pipeline. The PII guardrail's
//    evaluateInput() fires. NER model loads. Subsequent calls hit the cache.
//    The streaming output guardrail reuses the same cached model on every
//    TEXT_DELTA chunk.
```

For dispatcher mechanics (Phase 1 sequential sanitizers, Phase 2 parallel classifiers, worst-action aggregation, mid-stream override), see [Guardrails](https://docs.agentos.sh/features/guardrails). For the full lifecycle, see [Extension Loading](https://docs.agentos.sh/architecture/extension-loading) and [Auto-Loading Extensions](https://docs.agentos.sh/extensions/auto-loading).

## Installation

```bash
pnpm add @framers/agentos-extensions-registry
```

Then install whichever extension packages you need (e.g. `@framers/agentos-ext-telegram`). Only installed packages will be loaded by `createCuratedManifest()`.

## Main exports

| Export | Description |
|---|---|
| `createCuratedManifest(options?)` | Builds an `ExtensionManifest` from installed extensions. Accepts channel/tool filters, secrets, and per-extension overrides. |
| `CHANNEL_CATALOG` | Static catalog of all 37 channel platform entries (platform, package, SDK, required secrets) |
| `TOOL_CATALOG` | Static catalog of tool extensions (web search, CLI executor, image search, etc.) |
| `PROVIDER_CATALOG` | Static catalog of 21 LLM provider entries (provider name, models, base URLs) |
| `getAvailableExtensions()` | Returns only extensions whose npm packages are resolvable in the current environment |
| `getAvailableChannels()` | Returns only channel adapters whose packages are installed |
| `SECRET_ENV_MAP` | Maps secret keys (e.g. `telegram.botToken`) to environment variable names |

## Usage

```typescript
import { createCuratedManifest } from '@framers/agentos-extensions-registry';

// Load all installed extensions
const manifest = await createCuratedManifest({ channels: 'all', tools: 'all' });

// Or selectively enable specific channels
const manifest = await createCuratedManifest({
  channels: ['telegram', 'discord', 'slack'],
  tools: 'all',
  secrets: {
    'telegram.botToken': process.env.TELEGRAM_BOT_TOKEN,
    'discord.botToken': process.env.DISCORD_BOT_TOKEN,
    'slack.botToken': process.env.SLACK_BOT_TOKEN,
  },
});

// Pass to AgentOS runtime
const agent = new AgentOS();
await agent.initialize({ extensionManifest: manifest });
```

### `createCuratedManifest(options?)`

| Parameter | Type | Default | Description |
|---|---|---|---|
| `channels` | `string[] \| 'all' \| 'none'` | `'all'` | Which channel platforms to enable |
| `tools` | `string[] \| 'all' \| 'none'` | `'all'` | Which tool extensions to enable |
| `secrets` | `Record<string, string>` | `{}` | Secrets map (falls back to env vars) |
| `basePriority` | `number` | `0` | Base priority for all extensions |
| `overrides` | `Record<string, Override>` | `{}` | Per-extension overrides: `{ enabled?, priority?, options? }` |

## License

Apache 2.0 — see [LICENSE](LICENSE).
