---
name: openwakeword
version: '1.0.0'
description: Offline wake-word detection via OpenWakeWord ONNX models using onnxruntime-node — fully open-source, configurable threshold, any ONNX-compatible model supported.
author: Wunderland
namespace: wunderland
category: voice
tags: [voice, wake-word, hotword, openwakeword, onnx, offline, open-source, privacy]
requires_secrets: []
requires_tools: []
metadata:
  agentos:
    emoji: "\U0001F6A8"
    primaryEnv: OPENWAKEWORD_MODEL_PATH
    homepage: https://github.com/dscripka/openWakeWord
---

# OpenWakeWord

Use this skill to enable hands-free wake-word activation using open-source ONNX models. Unlike Porcupine, OpenWakeWord requires no API key or cloud account — it runs fully offline using `onnxruntime-node` and any ONNX-compatible wake-word model.

Prefer this over Porcupine when a fully open-source, zero-license solution is required, or when a custom ONNX wake-word model has been trained for a specific use case.

## Setup

1. Install `onnxruntime-node` as a dependency (the pack will attempt to load it dynamically).
2. Obtain or train an ONNX wake-word model. Community models are available at the OpenWakeWord repository.
3. Set `OPENWAKEWORD_MODEL_PATH` or configure via `providerOptions`.

Default model path: `~/.agentos/models/openwakeword/hey_mycroft.onnx`

## Configuration

```json
{
  "voice": {
    "wakeWord": "openwakeword"
  }
}
```

With a custom model and threshold:

```json
{
  "voice": {
    "wakeWord": "openwakeword",
    "wakeWordOptions": {
      "modelPath": "/opt/models/openwakeword/hey_assistant.onnx",
      "threshold": 0.6,
      "keyword": "hey assistant"
    }
  }
}
```

## Provider Rules

- `threshold` controls detection sensitivity (0–1). Default 0.5. Raise to reduce false positives; lower to reduce misses.
- Feature extraction uses RMS energy + zero-crossing rate from 80 ms audio frames — lightweight and CPU-friendly.
- Any ONNX model with the expected input/output shape is supported. Train custom models using the openWakeWord training utilities.
- No API key, no usage metering, no account required.

## Examples

- "Enable OpenWakeWord for fully open-source, keywordless wake-word detection."
- "Use my custom ONNX wake-word model for 'hey assistant'."
- "Set wake-word detection threshold to 0.7 to reduce false triggers."

## Constraints

- Requires `onnxruntime-node` to be installed.
- ONNX model must be pre-downloaded and accessible at the configured path.
- Feature extraction quality depends on audio clarity. Use in low-noise environments for best results.
- Custom model training requires the Python OpenWakeWord library and a GPU for reasonable training times.
