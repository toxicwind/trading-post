---
name: audio-generation
version: '1.0.0'
description: Music and sound effects generation — 8 providers with fallback chains, user-configurable preferences, local and cloud options.
author: Wunderland
namespace: wunderland
category: media
tags: [audio, music, sound-effects, sfx, generation, suno, elevenlabs, stable-audio, musicgen]
requires_secrets: []
requires_tools: []
metadata:
  agentos:
    emoji: "\U0001F3B5"
---

# Audio Generation (Music & Sound Effects)

Use this skill when the user wants to generate music compositions or sound effects from text descriptions. The system supports 8 provider backends with automatic fallback chains and user-configurable provider preferences.

This skill covers two complementary APIs:

1. **generateMusic()** — Full-length musical compositions from text prompts
2. **generateSFX()** — Short sound effects from text descriptions

## Music Generation

### Basic Usage

Generate music from a text prompt. The system auto-detects the best available provider from environment variables in priority order: `SUNO_API_KEY` (highest quality) -> `UDIO_API_KEY` -> `STABILITY_API_KEY` -> `REPLICATE_API_TOKEN` -> `FAL_API_KEY` -> local MusicGen (no key required).

```typescript
import { generateMusic } from 'agentos';

const result = await generateMusic({
  prompt: 'Upbeat lo-fi hip hop beat with vinyl crackle and mellow piano',
  durationSec: 60,
});
console.log(result.audio[0].url);
```

### Prompt Tips for Music

- **Specify genre and mood first**: "melancholic jazz ballad", "aggressive drum and bass", "peaceful ambient soundscape"
- **Include instrumentation**: "with acoustic guitar, soft brushed drums, and upright bass"
- **Mention tempo and energy**: "slow tempo, 70 BPM", "high energy, driving rhythm"
- **Add texture and production**: "lo-fi with vinyl crackle", "clean studio recording", "reverb-heavy shoegaze"
- **Reference eras or styles**: "1970s progressive rock", "modern trap production", "classical baroque harpsichord"
- **Use negative prompts** where supported: `negativePrompt: 'vocals, singing, lyrics'`

### Music Options

| Option | Default | Description |
|--------|---------|-------------|
| `prompt` | (required) | Text description of the desired music |
| `provider` | auto-detect | Provider ID (`"suno"`, `"udio"`, `"stable-audio"`, etc.) |
| `model` | provider default | Model identifier within the provider |
| `durationSec` | provider default | Output duration in seconds (Suno: up to ~240s, Stable Audio: ~47s) |
| `negativePrompt` | — | Musical elements to avoid (not all providers support this) |
| `outputFormat` | `"mp3"` | Output format: `"mp3"`, `"wav"`, `"flac"`, `"ogg"`, `"aac"` |
| `seed` | random | Seed for reproducible output (provider-dependent) |
| `n` | `1` | Number of clips to generate |
| `timeoutMs` | provider default | Max wait time before polling providers time out |
| `onProgress` | — | Best-effort callback for `queued` → `processing` → `complete` / `failed` |
| `providerPreferences` | — | Reorder, block, or weight providers for auto-selection and fallback |

## Sound Effect Generation

### Basic Usage

Generate a sound effect from a text description. The SFX detection order is: `ELEVENLABS_API_KEY` (highest quality) -> `STABILITY_API_KEY` -> `REPLICATE_API_TOKEN` -> `FAL_API_KEY` -> local AudioGen (no key required).

```typescript
import { generateSFX } from 'agentos';

const result = await generateSFX({
  prompt: 'Thunder crack followed by heavy rain on a tin roof',
  durationSec: 5,
});
console.log(result.audio[0].url);
```

### Prompt Tips for Sound Effects

- **Be specific about the sound**: "glass bottle shattering on concrete floor" rather than just "glass breaking"
- **Describe the environment**: "footsteps on gravel in an empty parking garage with echo"
- **Layer multiple sounds**: "busy city intersection with car horns, distant sirens, and pedestrian chatter"
- **Specify duration context**: short stingers (1-3s) vs ambient loops (10-15s)
- **Include physical properties**: "heavy wooden door creaking open slowly", "small metallic click of a light switch"

### SFX Options

| Option | Default | Description |
|--------|---------|-------------|
| `prompt` | (required) | Text description of the desired sound effect |
| `provider` | auto-detect | Provider ID (`"elevenlabs-sfx"`, `"stable-audio"`, etc.) |
| `model` | provider default | Model identifier within the provider |
| `durationSec` | provider default | Output duration in seconds (SFX is typically 1-15s) |
| `outputFormat` | `"mp3"` | Output format: `"mp3"`, `"wav"`, `"flac"`, `"ogg"`, `"aac"` |
| `seed` | random | Seed for reproducible output (provider-dependent) |
| `n` | `1` | Number of clips to generate |
| `timeoutMs` | provider default | Max wait time before polling providers time out |
| `onProgress` | — | Best-effort callback for `queued` → `processing` → `complete` / `failed` |
| `providerPreferences` | — | Reorder, block, or weight providers for auto-selection and fallback |

## Provider Selection Guide

### Music Providers

| Provider | ID | Best For | Env Var | Key Required |
|----------|-----|----------|---------|-------------|
| **Suno** | `suno` | Highest quality vocals + instrumentals, full songs | `SUNO_API_KEY` | Yes |
| **Udio** | `udio` | High quality music, alternative to Suno | `UDIO_API_KEY` | Yes |
| **Stable Audio** | `stable-audio` | Instrumentals, loops, ambient, fast generation | `STABILITY_API_KEY` | Yes |
| **Replicate** | `replicate-audio` | Open-source models (MusicGen), pay-per-use | `REPLICATE_API_TOKEN` | Yes |
| **Fal** | `fal-audio` | Fast serverless GPU, cost-effective | `FAL_API_KEY` | Yes |
| **MusicGen Local** | `musicgen-local` | Offline generation, no API key needed, privacy | — | No |

### SFX Providers

| Provider | ID | Best For | Env Var | Key Required |
|----------|-----|----------|---------|-------------|
| **ElevenLabs** | `elevenlabs-sfx` | Highest quality SFX, fast turnaround | `ELEVENLABS_API_KEY` | Yes |
| **Stable Audio** | `stable-audio` | Good SFX + music in one provider | `STABILITY_API_KEY` | Yes |
| **Replicate** | `replicate-audio` | Open-source AudioGen model, pay-per-use | `REPLICATE_API_TOKEN` | Yes |
| **Fal** | `fal-audio` | Fast serverless GPU | `FAL_API_KEY` | Yes |
| **AudioGen Local** | `audiogen-local` | Offline SFX generation, no API key needed | — | No |

### Forcing a Specific Provider

```typescript
const result = await generateMusic({
  prompt: 'Chill synthwave with arpeggiated synths',
  provider: 'stable-audio',
  apiKey: 'your-stability-key',
  durationSec: 30,
});
```

## Provider Preferences

Use `providerPreferences` to control both auto-selection and fallback ordering without hardcoding a single provider. This is useful for load balancing, cost optimization, or respecting user preferences.

```typescript
import { generateMusic } from 'agentos';

// Prefer Suno, fall back to Stable Audio, never use Udio
const result = await generateMusic({
  prompt: 'Orchestral film score with dramatic strings',
  providerPreferences: {
    preferred: ['suno', 'stable-audio'],
    blocked: ['udio'],
  },
});
```

### Preference Fields

| Field | Description |
|-------|-------------|
| `preferred` | Ordered list of provider IDs to try first. Providers not in this list are excluded. |
| `blocked` | Provider IDs to unconditionally exclude from the chain. |
| `weights` | Weight map for weighted primary selection after filtering/reordering (useful for A/B testing or load balancing). |

Provider preferences work identically across `generateMusic()`, `generateSFX()`, `generateImage()`, and `generateVideo()`.

## When to Use Music vs SFX vs TTS

| Need | API | Why |
|------|-----|-----|
| Background music, songs, jingles | `generateMusic()` | Optimized for musical compositions with melody, harmony, rhythm |
| Sound effects, foley, ambient sounds | `generateSFX()` | Optimized for short, non-musical audio (impacts, nature, UI sounds) |
| Speech, narration, voice cloning | TTS (speech subsystem) | Use the speech/TTS APIs instead — audio generation is for non-speech |
| Podcast intros with music + voice | Combine both | Generate music with `generateMusic()`, speech with TTS, mix externally |

## Combining Audio

The audio generation APIs return URLs or base64 data that can be combined in downstream workflows:

1. **Generate background music**: `generateMusic({ prompt: 'Gentle ambient pad' })`
2. **Generate SFX stingers**: `generateSFX({ prompt: 'Notification chime' })`
3. **Generate speech**: Use the TTS subsystem for narration
4. **Mix**: Use ffmpeg or a Web Audio API pipeline to layer the tracks

```typescript
import { generateMusic, generateSFX } from 'agentos';

// Generate assets in parallel
const [music, sfx] = await Promise.all([
  generateMusic({ prompt: 'Calm podcast background music', durationSec: 120 }),
  generateSFX({ prompt: 'Soft transition whoosh', durationSec: 2 }),
]);

// Use the URLs/base64 data in your mixing pipeline
console.log('Music:', music.audio[0].url);
console.log('SFX:', sfx.audio[0].url);
```

## Local Providers (No API Key)

Both MusicGen and AudioGen can run locally without any API keys using HuggingFace Transformers.js. The models are downloaded on first use and cached locally.

**Requirements:**
- `@huggingface/transformers` must be installed as a peer dependency
- Sufficient RAM for model inference (MusicGen Small ~1GB, AudioGen Medium ~2GB)

```typescript
// Explicitly use local generation
const result = await generateMusic({
  prompt: 'Simple piano melody',
  provider: 'musicgen-local',
});
```

Local providers are automatically used as the last fallback when no cloud API keys are configured.

## Prerequisites

- At least one audio provider API key for cloud generation, OR `@huggingface/transformers` for local generation
- For music: `SUNO_API_KEY`, `UDIO_API_KEY`, `STABILITY_API_KEY`, `REPLICATE_API_TOKEN`, or `FAL_API_KEY`
- For SFX: `ELEVENLABS_API_KEY`, `STABILITY_API_KEY`, `REPLICATE_API_TOKEN`, or `FAL_API_KEY`

## Examples

- "Generate a 60-second lo-fi hip hop beat for a study playlist"
- "Create a thunder and rain sound effect for my podcast intro"
- "Make upbeat electronic music for a product demo video"
- "Generate a notification chime sound effect"
- "Create ambient forest sounds with birds and a gentle stream"
- "Generate a dramatic orchestral score for a trailer"
- "Make a retro 8-bit video game soundtrack"
- "Create footstep sounds on different surfaces — wood, gravel, snow"
