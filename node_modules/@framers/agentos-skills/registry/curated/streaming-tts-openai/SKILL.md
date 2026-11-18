---
name: streaming-tts-openai
version: '1.0.0'
description: Low-latency streaming text-to-speech via OpenAI TTS API — adaptive sentence chunking, concurrent fetch pipelining, six voices.
author: Wunderland
namespace: wunderland
category: voice
tags: [voice, tts, text-to-speech, openai, streaming, low-latency]
requires_secrets: [openai.apiKey]
requires_tools: []
metadata:
  agentos:
    emoji: "\U0001F50A"
    primaryEnv: OPENAI_API_KEY
    homepage: https://platform.openai.com/docs/guides/text-to-speech
---

# OpenAI Streaming TTS

Use this skill when the agent needs to synthesize speech from LLM output with low latency using OpenAI's TTS API. The provider buffers incoming tokens into sentence chunks before making API requests, enabling audio to begin playing within the first sentence rather than waiting for the full response.

Prefer this provider when a single `OPENAI_API_KEY` should cover both LLM and TTS, or when voice quality is important but ElevenLabs is not configured.

## Setup

Set `OPENAI_API_KEY` in the environment or agent secrets store.

## Configuration

```json
{
  "voice": {
    "tts": "openai"
  }
}
```

With voice and model options:

```json
{
  "voice": {
    "tts": "openai",
    "providerOptions": {
      "model": "tts-1",
      "voice": "nova",
      "format": "opus",
      "maxBufferMs": 2000
    }
  }
}
```

## Provider Rules

- Prefer `tts-1` for real-time interactions; use `tts-1-hd` when audio quality matters more than latency.
- Default voice is `nova`. Available voices: `alloy`, `echo`, `fable`, `onyx`, `nova`, `shimmer`.
- The provider fetches the next sentence concurrently while the current one plays to minimize gaps.
- All in-flight requests use `AbortController` for cancellation when the session is interrupted.
- Use `maxBufferMs` to tune the fallback flush timer for fragments without terminal punctuation.

## Events

| Event                | Description                                        |
|----------------------|----------------------------------------------------|
| `utterance_start`    | Sentence chunk dispatched for synthesis            |
| `audio_chunk`        | Synthesized audio buffer ready for playback        |
| `utterance_complete` | Synthesis complete for a sentence chunk            |
| `cancelled`          | Session cancelled; remaining text not rendered     |
| `error`              | Synthesis request failed                           |
| `close`              | Session fully terminated                           |

## Examples

- "Use OpenAI TTS with the nova voice for this conversation."
- "Switch to the HD model for a podcast recording."
- "Start a voice session where OpenAI handles both LLM and speech synthesis."

## Constraints

- Requires `OPENAI_API_KEY`.
- Latency is bounded by the first sentence chunk — longer sentence fragments before a punctuation mark will delay audio start.
- `tts-1-hd` has higher latency than `tts-1`.
