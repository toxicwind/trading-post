---
name: endpoint-semantic
version: '1.0.0'
description: Semantic endpoint detection — uses an LLM to classify whether the user's utterance is a complete thought, reducing false turn boundaries on mid-sentence pauses.
author: Wunderland
namespace: wunderland
category: voice
tags: [voice, endpointing, turn-detection, semantic, llm, vad, silence]
requires_secrets: []
requires_tools: []
metadata:
  agentos:
    emoji: "\U0001F4AC"
    homepage: https://docs.wunderland.sh/guides/voice
---

# Semantic Endpoint Detector

Use this skill when the agent's default silence-based turn detection is causing false positives — triggering agent responses mid-sentence when the user pauses to think. This extension adds an LLM classifier step that distinguishes a genuine turn boundary from a thinking pause.

Prefer this over pure VAD/silence endpointing in conversational contexts where users speak with frequent mid-thought pauses, or when the user repeatedly complains that the agent "interrupts" them.

## How It Works

1. If the final transcript ends with `.`, `?`, or `!`, the turn ends immediately (punctuation path).
2. Short acknowledgement phrases (`"uh huh"`, `"yeah"`, `"right"`) are classified as backchannels and suppressed.
3. On silence without terminal punctuation, after `minSilenceBeforeCheckMs` (default 500 ms), an LLM is queried: "Is this utterance a complete thought?" Results are LRU-cached.
   - `COMPLETE` → turn ends, reason `semantic_model`.
   - `INCOMPLETE` → waiting continues; eventual silence timeout acts as final fallback.
   - `TIMEOUT` → falls back to silence timeout.

## Configuration

```json
{
  "voice": {
    "endpointing": "semantic",
    "endpointingOptions": {
      "model": "gpt-4o-mini",
      "timeoutMs": 500,
      "minSilenceBeforeCheckMs": 500,
      "silenceTimeoutMs": 2000
    }
  }
}
```

## Provider Rules

- Use `gpt-4o-mini` (or equivalent cheap small model) for the classifier — latency matters more than quality for this binary decision.
- Keep `timeoutMs` under 600 ms to avoid adding noticeable lag to the turn boundary.
- Increase `silenceTimeoutMs` for users who speak slowly or pause frequently.
- Reduce `minSilenceBeforeCheckMs` to 300 ms for faster-paced conversations.

## Events

| Event                  | Description                                                              |
|------------------------|--------------------------------------------------------------------------|
| `turn_complete`        | User turn ended; `reason` is `punctuation`, `semantic_model`, or `silence_timeout` |
| `backchannel_detected` | A backchannel phrase was recognised; accumulation suppressed             |

## Examples

- "Use semantic endpoint detection to avoid cutting me off mid-thought."
- "Enable smarter turn detection for this conversational voice session."
- "Configure the endpoint detector to wait longer before deciding I'm done speaking."

## Constraints

- Requires an LLM provider to be configured in the runtime for the classifier calls.
- LLM calls add latency at turn boundaries. Use a small, fast model to minimize this.
- The LRU cache (keyed on first 100 characters) reduces repeated LLM calls for identical short utterances.
