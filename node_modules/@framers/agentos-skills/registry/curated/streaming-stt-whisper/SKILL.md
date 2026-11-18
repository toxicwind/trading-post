---
name: streaming-stt-whisper
version: '1.0.0'
description: Chunked sliding-window streaming speech-to-text via OpenAI Whisper HTTP API — compatible with local Faster-Whisper, Groq, and OpenRouter endpoints.
author: Wunderland
namespace: wunderland
category: voice
tags: [voice, stt, speech-to-text, whisper, openai, streaming, local, offline-compatible]
requires_secrets: [openai.apiKey]
requires_tools: []
metadata:
  agentos:
    emoji: "\U0001F399\uFE0F"
    primaryEnv: OPENAI_API_KEY
    homepage: https://platform.openai.com/docs/guides/speech-to-text
---

# Whisper Chunked Streaming STT

Use this skill when OpenAI Whisper is the preferred STT provider, especially when a single API key should cover both LLM and speech. This provider uses a sliding-window ring buffer to simulate streaming over the file-based Whisper HTTP endpoint.

Prefer this over the Deepgram adapter when real-time WebSocket streaming is not required, when the user wants to route through a local Whisper-compatible server (e.g. Faster-Whisper, Groq), or when OpenAI is the only configured provider.

## Setup

Set `OPENAI_API_KEY` in the environment or agent secrets store. For local endpoints, override `baseUrl` in `providerOptions`.

## Configuration

```json
{
  "voice": {
    "stt": "whisper"
  }
}
```

For a local Faster-Whisper endpoint:

```json
{
  "voice": {
    "stt": "whisper",
    "providerOptions": {
      "model": "whisper-1",
      "language": "en",
      "baseUrl": "http://localhost:8000"
    }
  }
}
```

## Provider Rules

- Audio is accumulated in a 1 s sliding window with 200 ms overlap to avoid word boundary clipping.
- The previous chunk transcript is forwarded as `prompt` to the next request for cross-chunk continuity.
- On fetch failure the provider emits `error` and continues — no session crash.
- Use `language` to force a specific language code (BCP-47); omit for automatic detection.
- Compatible with any OpenAI `/v1/audio/transcriptions`-compatible server.

## Events

| Event                  | Description                                     |
|------------------------|-------------------------------------------------|
| `interim_transcript`   | Emitted after each chunk is transcribed         |
| `final_transcript`     | Emitted after flush() completes                 |
| `speech_start`         | RMS energy crossed threshold                    |
| `speech_end`           | RMS energy dropped below threshold              |
| `error`                | Fetch failure (session continues)               |
| `close`                | Session fully terminated                        |

## Examples

- "Use Whisper for live speech transcription during our voice session."
- "Transcribe my speech through a local Faster-Whisper server."
- "Use OpenAI for both the LLM and the STT provider."

## Constraints

- Requires `OPENAI_API_KEY` or a compatible local endpoint via `providerOptions.baseUrl`.
- Latency is higher than native WebSocket providers (Deepgram) due to HTTP chunking overhead.
- Speaker diarization is not natively supported; use the `diarization` extension for post-processing.
