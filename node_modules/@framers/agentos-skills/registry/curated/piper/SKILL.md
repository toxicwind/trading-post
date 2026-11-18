---
name: piper
version: '1.0.0'
description: Fully offline text-to-speech by spawning the Piper binary — ONNX model, WAV output, zero npm dependencies, no network required.
author: Wunderland
namespace: wunderland
category: voice
tags: [voice, tts, text-to-speech, piper, offline, local, privacy, onnx]
requires_secrets: []
requires_tools: []
metadata:
  agentos:
    emoji: "\U0001F50A"
    homepage: https://github.com/rhasspy/piper
---

# Piper Offline TTS

Use this skill when the agent must synthesize speech without internet connectivity, or when user privacy requirements prohibit sending text to external TTS APIs. Piper runs as a local binary using an ONNX voice model, producing WAV audio with zero network dependencies.

Prefer this over cloud TTS providers when operating in air-gapped environments, on-premise deployments, or Raspberry Pi / edge hardware. Piper is particularly well-suited for home automation and embedded agent scenarios.

## Setup

1. Install the Piper binary from https://github.com/rhasspy/piper/releases
2. Download an ONNX voice model (e.g. `en_US-lessac-medium.onnx`) and its `.json` config
3. Set `PIPER_BIN` and `PIPER_MODEL_PATH` environment variables, or configure via `providerOptions`

## Configuration

```json
{
  "voice": {
    "tts": "piper"
  }
}
```

With explicit paths:

```json
{
  "voice": {
    "tts": "piper",
    "providerOptions": {
      "binaryPath": "/usr/local/bin/piper",
      "modelPath": "/opt/models/piper/en_US-lessac-medium.onnx"
    }
  }
}
```

## Provider Rules

- `PIPER_BIN` (or `providerOptions.binaryPath`) must point to the Piper executable. Falls back to `piper` on `$PATH`.
- `PIPER_MODEL_PATH` (or `providerOptions.modelPath`) must point to the `.onnx` model file. The corresponding `.onnx.json` config must exist in the same directory.
- Output is WAV (audio/wav). Playback requires a WAV-capable audio pipeline.
- Cost is always 0 — no API calls, no tokens, no metering.
- Increase `maxBufferBytes` if synthesizing very long passages (default 10 MB).

## Examples

- "Use Piper TTS for offline speech synthesis on this edge device."
- "Synthesize this message locally without any cloud API calls."
- "Configure Piper with the high-quality lessac model."

## Constraints

- Requires the Piper binary to be installed and accessible. Install via GitHub releases.
- The ONNX model and its `.json` config file must both be present in the same directory.
- Piper voice models range from ~30 MB (low quality) to ~250 MB (high quality).
- Synthesis speed depends on CPU performance. GPU acceleration is not supported via this pack.
