---
name: streaming-stt-deepgram
version: '1.0.0'
description: Real-time streaming speech-to-text via Deepgram WebSocket API — sub-300 ms latency, Nova-2 model, speaker diarization, auto-reconnect.
author: Wunderland
namespace: wunderland
category: voice
tags: [voice, stt, speech-to-text, deepgram, streaming, real-time, diarization]
requires_secrets: [deepgram.apiKey]
requires_tools: []
metadata:
  agentos:
    emoji: "\U0001F3A4"
    primaryEnv: DEEPGRAM_API_KEY
    homepage: https://developers.deepgram.com/docs/getting-started-with-live-streaming-audio
---

# Deepgram Streaming STT

Use this skill when the user needs real-time speech-to-text transcription with the lowest possible latency. Deepgram's WebSocket API provides sub-300 ms interim transcripts using the Nova-2 model.

Prefer this provider over file-based Whisper when the agent needs live voice input during a conversation, or when speaker identification (diarization) is required without a separate processing step.

## Setup

Set `DEEPGRAM_API_KEY` in the environment or agent secrets store before starting a voice session.

## Configuration

```json
{
  "voice": {
    "stt": "deepgram"
  }
}
```

To enable diarization and keyword boosting:

```json
{
  "voice": {
    "stt": "deepgram",
    "providerOptions": {
      "model": "nova-2",
      "diarize": true,
      "keywords": ["AgentOS:2"],
      "endpointing": 300
    }
  }
}
```

## Provider Rules

- Use `nova-2` as the default model — highest accuracy on Deepgram's current tier.
- Enable `diarize: true` when the conversation involves multiple speakers; word-level `speaker` labels are included in the transcript events.
- Tune `endpointing` (ms of silence before finalization) to balance responsiveness vs. over-splitting. Default 300 ms is suitable for most conversations.
- The provider auto-reconnects on WebSocket drops using exponential back-off (100 ms → 5 s cap).
- Use `providerOptions.keywords` to boost domain-specific terms (e.g. product names, abbreviations).

## Events

| Event                  | Description                                     |
|------------------------|-------------------------------------------------|
| `transcript`           | Every hypothesis (interim + final)              |
| `interim_transcript`   | Non-final hypothesis                            |
| `final_transcript`     | Stable, final hypothesis                        |
| `speech_start`         | First non-empty word in an utterance            |
| `speech_end`           | Deepgram `speech_final` flag raised             |
| `error`                | Unrecoverable provider error                    |
| `close`                | Session fully terminated                        |

## Examples

- "Start a live voice session using Deepgram for transcription."
- "Enable speaker diarization for this multi-person meeting transcription."
- "Use Deepgram with keyword boosting for AgentOS and Wunderland terms."

## Constraints

- Requires `DEEPGRAM_API_KEY`. Free tier available at console.deepgram.com.
- Audio must be streamed as PCM/WebSocket-compatible frames.
- Diarization adds slight latency; disable if single-speaker performance is the priority.
