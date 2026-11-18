---
name: vosk
version: '1.0.0'
description: Fully offline speech-to-text via the Vosk library — streaming recognition, 16 kHz PCM, no network required after model download.
author: Wunderland
namespace: wunderland
category: voice
tags: [voice, stt, speech-to-text, vosk, offline, local, privacy]
requires_secrets: []
requires_tools: []
metadata:
  agentos:
    emoji: "\U0001F3A4"
    homepage: https://alphacephei.com/vosk/
---

# Vosk Offline STT

Use this skill when the agent must operate without internet connectivity, or when user privacy requirements prohibit sending audio to external APIs. Vosk provides fully offline speech recognition after the model is downloaded once.

Prefer this over cloud STT providers when operating in air-gapped environments, on-premise deployments, or when the user explicitly requests zero-cloud voice processing.

## Setup

Download a Vosk model and place it at `~/.agentos/models/vosk/` (default), or set `modelPath` in `providerOptions`.

```sh
# Example: download the small English model
wget https://alphacephei.com/vosk/models/vosk-model-small-en-us-0.15.zip
unzip vosk-model-small-en-us-0.15.zip -d ~/.agentos/models/vosk/
```

## Configuration

```json
{
  "voice": {
    "stt": "vosk"
  }
}
```

With a custom model path:

```json
{
  "voice": {
    "stt": "vosk",
    "providerOptions": {
      "modelPath": "/opt/models/vosk-model-en"
    }
  }
}
```

## Provider Rules

- Audio input must be 16 kHz LINEAR16 PCM. Resample other formats before streaming.
- Model quality scales with model size. Use `vosk-model-en-us-0.22` for best English accuracy; use small models on constrained hardware.
- No API key required. The only requirement is a pre-downloaded model directory.
- Streaming recognition is natively supported by the Vosk recognizer.

## Examples

- "Use offline Vosk STT for this air-gapped deployment."
- "Transcribe my voice locally without sending audio to the cloud."
- "Configure Vosk with the large English model for best accuracy."

## Constraints

- Requires the Vosk npm package and a pre-downloaded model directory.
- Accuracy is lower than cloud providers, especially for accented speech and domain-specific vocabulary.
- Audio must be 16 kHz mono LINEAR16 PCM. Other sample rates or formats require conversion.
- Model download size ranges from ~40 MB (small) to ~1.8 GB (large en-us).
