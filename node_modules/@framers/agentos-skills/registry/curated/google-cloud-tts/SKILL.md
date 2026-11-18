---
name: google-cloud-tts
version: '1.0.0'
description: Text-to-speech synthesis via Google Cloud Text-to-Speech API — MP3 output, configurable language and voice, voice listing.
author: Wunderland
namespace: wunderland
category: voice
tags: [voice, tts, text-to-speech, google, cloud, neural]
requires_secrets: [google.cloudTtsCredentials]
requires_tools: []
metadata:
  agentos:
    emoji: "\U0001F50A"
    primaryEnv: GOOGLE_CLOUD_TTS_CREDENTIALS
    homepage: https://cloud.google.com/text-to-speech/docs
---

# Google Cloud TTS

Use this skill when Google Cloud Text-to-Speech is the preferred synthesis provider, particularly within a Google Cloud environment or when the user needs one of Google's Neural2 or WaveNet voices not available through other providers.

Prefer this over OpenAI TTS when the user already uses Google Cloud, needs a specific non-English language voice, or prefers Google's voice catalog.

## Setup

Set `GOOGLE_CLOUD_TTS_CREDENTIALS` in the environment or agent secrets store. Accepts either:
- An absolute path to a service-account JSON key file
- A raw JSON string with the service-account credentials

## Configuration

```json
{
  "voice": {
    "tts": "google-cloud-tts"
  }
}
```

With voice and language options:

```json
{
  "voice": {
    "tts": "google-cloud-tts",
    "providerOptions": {
      "languageCode": "en-GB",
      "voice": "en-GB-Neural2-A"
    }
  }
}
```

## Provider Rules

- Output is MP3 (audio/mpeg). Playback requires an MP3-capable audio pipeline.
- Language codes follow BCP-47 (e.g. `en-US`, `en-GB`, `de-DE`).
- Call `listAvailableVoices()` to enumerate all voices available on the account; useful for letting the user pick a voice.
- Neural2 and WaveNet voices require the respective API feature to be enabled on the Google Cloud project.

## Examples

- "Use Google Cloud TTS with a British English Neural2 voice."
- "List the available voices on my Google Cloud TTS account."
- "Synthesize this response using Google Cloud Text-to-Speech."

## Constraints

- Requires a Google Cloud service account with the `Text-to-Speech` API enabled.
- Credentials must be either a path to a valid JSON key file or inline JSON string.
- API costs apply per character synthesized.
