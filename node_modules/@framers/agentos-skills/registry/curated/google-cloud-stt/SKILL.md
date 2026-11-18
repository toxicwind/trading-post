---
name: google-cloud-stt
version: '1.0.0'
description: Batch speech-to-text via Google Cloud Speech-to-Text API — LINEAR16 PCM, configurable language, word-level confidence scores.
author: Wunderland
namespace: wunderland
category: voice
tags: [voice, stt, speech-to-text, google, cloud, batch]
requires_secrets: [google.cloudSttCredentials]
requires_tools: []
metadata:
  agentos:
    emoji: "\U0001F3A4"
    primaryEnv: GOOGLE_CLOUD_STT_CREDENTIALS
    homepage: https://cloud.google.com/speech-to-text/docs
---

# Google Cloud STT

Use this skill when Google Cloud Speech-to-Text is the preferred provider, particularly when the user's Google Cloud project is already configured or when multi-language support is required without switching providers.

Prefer this over Deepgram when the agent is already operating within a Google Cloud environment, or when the user specifically requests Google as the STT backend.

## Setup

Set `GOOGLE_CLOUD_STT_CREDENTIALS` in the environment or agent secrets store. Accepts either:
- An absolute path to a service-account JSON key file
- A raw JSON string with the service-account credentials

## Configuration

```json
{
  "voice": {
    "stt": "google-cloud-stt"
  }
}
```

With language override:

```json
{
  "voice": {
    "stt": "google-cloud-stt",
    "providerOptions": {
      "language": "fr-FR"
    }
  }
}
```

## Provider Rules

- Language codes follow BCP-47 format (e.g. `en-US`, `fr-FR`, `ja-JP`). Default is `en-US`.
- Audio input must be LINEAR16 PCM format. Convert other formats before sending.
- Confidence scores and word-level alternatives are included in the transcription result.
- Credentials are resolved at initialization; if the path is invalid or JSON is malformed, initialization will throw immediately.

## Examples

- "Transcribe this audio using Google Cloud Speech-to-Text."
- "Use Google STT with French language recognition."
- "Set up Google Cloud STT with my service account credentials."

## Constraints

- Requires a Google Cloud service account with the `Speech-to-Text` API enabled.
- Credentials must be either a path to a valid JSON key file or inline JSON string.
- This is a batch (non-streaming) provider. For real-time streaming, use Deepgram or Whisper instead.
- API costs apply per 15-second audio block.
