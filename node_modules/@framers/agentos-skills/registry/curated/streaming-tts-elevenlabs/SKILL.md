---
name: streaming-tts-elevenlabs
version: '1.0.0'
description: Real-time streaming text-to-speech via ElevenLabs WebSocket API — persistent connection, sentence-boundary flushing, turbo and multilingual models.
author: Wunderland
namespace: wunderland
category: voice
tags: [voice, tts, text-to-speech, elevenlabs, streaming, websocket, high-quality]
requires_secrets: [elevenlabs.apiKey]
requires_tools: []
metadata:
  agentos:
    emoji: "\U0001F50A"
    primaryEnv: ELEVENLABS_API_KEY
    homepage: https://elevenlabs.io/docs/api-reference/text-to-speech
---

# ElevenLabs Streaming TTS

Use this skill when voice quality or voice cloning is the highest priority. ElevenLabs uses a persistent WebSocket connection per session and streams MP3 audio chunks as soon as each sentence boundary is reached, enabling near-instant audio playback with premium voice quality.

Prefer this over OpenAI TTS when the user cares about expressiveness, accent accuracy, or has a custom cloned voice configured via a ElevenLabs voice ID.

## Setup

Set `ELEVENLABS_API_KEY` in the environment or agent secrets store.

## Configuration

```json
{
  "voice": {
    "tts": "elevenlabs"
  }
}
```

With a custom voice and model:

```json
{
  "voice": {
    "tts": "elevenlabs",
    "providerOptions": {
      "voiceId": "21m00Tcm4TlvDq8ikWAM",
      "modelId": "eleven_turbo_v2",
      "stability": 0.5,
      "similarityBoost": 0.75,
      "style": 0.0,
      "useSpeakerBoost": true
    }
  }
}
```

## Provider Rules

- Use `eleven_turbo_v2` for low-latency interactions; use `eleven_multilingual_v2` for highest quality or non-English speech.
- The WebSocket connection is kept alive for the duration of the session — no per-request handshake overhead.
- Sentence boundaries (`.`, `?`, `!`) trigger immediate audio flush; the provider does not wait for full LLM output.
- Voice settings (`stability`, `similarityBoost`, `style`) tune the expressiveness tradeoff. Higher stability = more consistent but less expressive.
- If no `voiceId` is provided, ElevenLabs uses the account's default voice.

## Events

| Event                | Description                                        |
|----------------------|----------------------------------------------------|
| `audio_chunk`        | MP3 audio buffer ready for playback                |
| `utterance_complete` | ElevenLabs signalled final audio generation done   |
| `cancelled`          | Session cancelled; remaining text not rendered     |
| `error`              | WebSocket or synthesis error                       |
| `close`              | Session fully terminated                           |

## Examples

- "Use ElevenLabs TTS with my custom cloned voice for this session."
- "Switch to ElevenLabs for higher-quality speech synthesis."
- "Use the turbo model for real-time low-latency voice responses."

## Constraints

- Requires `ELEVENLABS_API_KEY`. Free tier available at elevenlabs.io.
- Voice IDs are specific to the ElevenLabs account. Use the ElevenLabs dashboard or API to list available voices.
- MP3 output at 44.1 kHz / 128 kbps. Playback requires an MP3-capable audio pipeline.
