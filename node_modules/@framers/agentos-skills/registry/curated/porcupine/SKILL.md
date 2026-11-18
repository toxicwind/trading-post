---
name: porcupine
version: '1.0.0'
description: On-device wake-word detection via Picovoice Porcupine — privacy-preserving, configurable built-in keywords, per-keyword sensitivity tuning.
author: Wunderland
namespace: wunderland
category: voice
tags: [voice, wake-word, hotword, porcupine, picovoice, offline, privacy, hands-free]
requires_secrets: [picovoice.accessKey]
requires_tools: []
metadata:
  agentos:
    emoji: "\U0001F6A8"
    primaryEnv: PORCUPINE_ACCESS_KEY
    homepage: https://picovoice.ai/platform/porcupine/
---

# Porcupine Wake Word

Use this skill to enable hands-free wake-word activation for a voice agent. The agent listens passively for a configured keyword (e.g. "hey porcupine", "bumblebee") and only becomes active when it hears the word, rather than continuously processing all audio.

Prefer this over always-on voice sessions when power consumption, privacy, or user preference for explicit activation matters. Porcupine runs entirely on-device — no audio is ever sent to Picovoice servers.

## Setup

Obtain a free access key from https://console.picovoice.ai/ and set it as `PORCUPINE_ACCESS_KEY` or configure via agent secrets.

## Configuration

```json
{
  "voice": {
    "wakeWord": "porcupine",
    "wakeWordOptions": {
      "keywords": ["porcupine"],
      "sensitivities": [0.5]
    }
  }
}
```

With multiple keywords and custom sensitivity:

```json
{
  "voice": {
    "wakeWord": "porcupine",
    "wakeWordOptions": {
      "keywords": ["porcupine", "bumblebee"],
      "sensitivities": [0.5, 0.7]
    }
  }
}
```

## Provider Rules

- Sensitivity ranges from 0 (least sensitive, fewer false positives) to 1 (most sensitive, fewer misses). Default is 0.5 per keyword.
- Built-in keyword names include: `porcupine`, `bumblebee`, `blueberry`, `hey google`, `ok google`, `hey siri`, `jarvis`, `alexa`, and others. Check the Picovoice console for the full list.
- Processing is stateless and per-frame — the detector returns a keyword index or -1 for no detection.
- A free Picovoice account provides a limited number of wake-word detections per month. Check usage at console.picovoice.ai.

## Examples

- "Start the agent only when I say 'hey porcupine'."
- "Set up hands-free wake-word detection with bumblebee."
- "Use two wake words at different sensitivity levels."

## Constraints

- Requires a Picovoice access key (free tier available at console.picovoice.ai).
- Audio must be 16 kHz mono LINEAR16 PCM frames of exactly 512 samples.
- Custom wake words (non-built-in keywords) require a paid Picovoice subscription and a compiled `.ppn` model file.
- Detection happens per-frame; integrate with the VAD pipeline to avoid processing silence frames.
