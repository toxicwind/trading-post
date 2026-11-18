---
name: diarization
version: '1.0.0'
description: Speaker diarization — identifies and tracks who is speaking at each moment in an audio stream, using provider-delegated labels or local offline clustering.
author: Wunderland
namespace: wunderland
category: voice
tags: [voice, diarization, speaker-identification, multi-speaker, offline, deepgram]
requires_secrets: []
requires_tools: []
metadata:
  agentos:
    emoji: "\U0001F465"
    homepage: https://docs.wunderland.sh/guides/voice
---

# Speaker Diarization

Use this skill when the agent needs to track who is speaking across a multi-speaker audio stream. Supports two modes: provider-delegated (extracts speaker labels from Deepgram word-level results) and local clustering (spectral-centroid agglomerative clustering, fully offline).

Enable this when transcribing meetings, interviews, podcast recordings, or any scenario where knowing which speaker said what is important for downstream tasks (summaries, action items, CRM updates).

## Setup

No API key required for local mode. For provider-delegated mode, enable diarization on the STT provider:

```json
{
  "voice": {
    "stt": "deepgram",
    "diarization": "provider",
    "providerOptions": { "diarize": true }
  }
}
```

For fully offline local clustering:

```json
{
  "voice": {
    "diarization": "local"
  }
}
```

## Speaker Enrollment

Pre-register known speakers so the engine labels them by name instead of `Speaker_0`, `Speaker_1`:

```ts
await session.enrollSpeaker('Alice', aliceVoiceprintFloat32Array);
await session.enrollSpeaker('Bob', bobVoiceprintFloat32Array);
```

## Provider Rules

- Prefer provider-delegated mode with Deepgram when speaker accuracy is critical and `DEEPGRAM_API_KEY` is available. Word-level speaker labels are more reliable than local clustering.
- Use local mode when privacy, offline operation, or zero additional API cost is required.
- The local backend extracts 16-dimensional spectral feature vectors per 1.5 s window (0.5 s overlap) — suitable for clear audio. Replace with an ONNX x-vector model for noisy environments.
- Enroll known speakers when participant names are known in advance to get named labels instead of generic `Speaker_N` identifiers.

## Events

| Event                 | Description                                              |
|-----------------------|----------------------------------------------------------|
| `speaker_identified`  | Active speaker label has changed                         |
| `segment_ready`       | A labelled audio or transcript segment is ready          |
| `error`               | Unrecoverable diarization error                          |
| `close`               | Session fully terminated                                 |

## Examples

- "Transcribe this meeting and label each speaker's turns."
- "Use local diarization for a private interview recording."
- "Enable Deepgram diarization and label Alice and Bob by voice."

## Constraints

- Local mode accuracy depends on audio clarity and spectral separation between speakers.
- Provider mode requires `diarize: true` support on the active STT provider (currently Deepgram).
- Speaker enrollment voiceprints must be Float32Arrays computed from clean reference audio.
- The built-in feature extractor is intentionally lightweight; replace `extractSimpleEmbedding()` with an ONNX x-vector model for production-quality voiceprints.
