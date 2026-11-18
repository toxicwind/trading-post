---
name: video-generation
version: '1.0.0'
description: Video generation, analysis, and scene detection — text-to-video, image-to-video, structured scene descriptions with RAG indexing, and general-purpose visual change detection.
author: Wunderland
namespace: wunderland
category: media
tags: [video, generation, analysis, scene-detection, RAG, multimodal, runway, replicate, fal]
requires_secrets: []
requires_tools: []
metadata:
  agentos:
    emoji: "\U0001F3AC"
---

# Video Generation, Analysis & Scene Detection

Use this skill when the user wants to create AI-generated videos, analyse existing video content for structured scene descriptions, or detect visual changes in live/recorded frame streams.

This skill covers three complementary APIs:

1. **generateVideo()** — Text-to-video and image-to-video generation
2. **analyzeVideo()** — Structured video analysis with scene descriptions, transcription, and optional RAG indexing
3. **detectScenes()** — Real-time or batch scene boundary detection from frame streams

## Video Generation

### Text-to-Video

Generate a video from a text prompt. The system auto-detects the best available provider from environment variables in priority order: `RUNWAY_API_KEY` (highest quality), `REPLICATE_API_TOKEN` (widest model variety), `FAL_API_KEY` (fast serverless GPU).

```typescript
import { generateVideo } from 'agentos';

const result = await generateVideo({
  prompt: 'A drone flying over a misty forest at sunrise, cinematic 4K',
  durationSec: 5,
  aspectRatio: '16:9',
});
console.log(result.videos[0].url);
```

### Image-to-Video

Animate a still image by providing it as a Buffer via `opts.image`. The prompt describes the desired motion rather than the scene itself.

```typescript
import { generateVideo } from 'agentos';
import { readFileSync } from 'fs';

const result = await generateVideo({
  prompt: 'Camera slowly zooms out, gentle wind moves the leaves',
  image: readFileSync('landscape.png'),
  provider: 'runway',
});
```

### Provider Selection

| Provider | Best For | Env Var |
|----------|----------|---------|
| **Runway** | Highest quality, cinematic output, image-to-video | `RUNWAY_API_KEY` |
| **Replicate** | Widest model variety (Kling, HunyuanVideo, MiniMax), open-source models | `REPLICATE_API_TOKEN` |
| **Fal** | Fast serverless GPU, cost-effective, Kling/CogVideo | `FAL_API_KEY` |

When multiple provider API keys are set, the system wraps the primary in a `FallbackVideoProxy` so a transient failure on one provider automatically retries on the next.

Use `providerPreferences` to reorder, block, or weight providers during auto-selection:

```typescript
const result = await generateVideo({
  prompt: 'A cat playing piano',
  timeoutMs: 180_000,
  onProgress: (event) => console.log(event.status, event.message),
  providerPreferences: {
    preferred: ['runway', 'replicate'],
    weights: { runway: 3, replicate: 1 },
    blocked: ['fal'],
  },
});
```

To force a specific provider:

```typescript
const result = await generateVideo({
  prompt: 'A cat playing piano',
  provider: 'replicate',
  model: 'klingai/kling-v1',
  apiKey: 'your-replicate-token',
});
```

### Prompt Tips for Video

- **Be specific about motion**: "camera pans left to right", "person walks toward camera", "time-lapse of clouds moving"
- **Specify style early**: "cinematic 4K", "hand-drawn animation", "vintage film grain"
- **Keep prompts concise**: Video models respond best to clear, focused descriptions (1-3 sentences)
- **Use negative prompts** to avoid unwanted artifacts: `negativePrompt: 'blurry, distorted faces, watermark'`

### Image-to-Video Motion Strength

When doing image-to-video, the prompt controls how much the image changes:

- **Gentle motion**: "subtle camera drift", "soft wind blowing through hair" — minimal departure from source
- **Moderate motion**: "person turns head and smiles", "camera orbits subject" — clear movement while preserving subject
- **Strong motion**: "explosion of confetti", "character runs toward camera" — significant scene change

The provider's motion strength interpretation varies. Runway tends to be conservative (good for preserving the source image), while Replicate/Fal models may be more aggressive. Start with gentle prompts and increase intensity.

## Video Analysis

### Structured Scene Analysis

Analyse a video to extract structured scene descriptions, detected objects, on-screen text, and optional audio transcription.

```typescript
import { analyzeVideo } from 'agentos';

const analysis = await analyzeVideo({
  videoUrl: 'https://example.com/product-demo.mp4',
  prompt: 'Identify all products shown and their key features',
  transcribeAudio: true,
  descriptionDetail: 'detailed',
});

console.log(analysis.description);
for (const scene of analysis.scenes ?? []) {
  console.log(`[${scene.startSec}s - ${scene.endSec}s] ${scene.description}`);
}
```

### RAG Integration

Enable `indexForRAG: true` to automatically index scene descriptions and transcripts into the vector store for later retrieval. This is especially useful for building searchable video libraries.

```typescript
const analysis = await analyzeVideo({
  videoBuffer: videoData,
  indexForRAG: true,
  descriptionDetail: 'detailed',
  transcribeAudio: true,
});

// Scene descriptions and transcripts are now searchable via RAG
console.log(`Indexed ${analysis.ragChunkIds?.length ?? 0} chunks`);
```

Each scene description becomes a separate vector chunk with metadata including timestamps, scene index, and cut type. This enables queries like "find the part where the presenter shows the pricing slide" to return precise timestamp ranges.

### Analysis Options

| Option | Default | Description |
|--------|---------|-------------|
| `sceneThreshold` | `0.3` | Scene change sensitivity (0-1, lower = more scenes) |
| `transcribeAudio` | `true` | Transcribe audio via configured STT provider |
| `descriptionDetail` | `'detailed'` | `'brief'`, `'detailed'`, or `'exhaustive'` |
| `maxScenes` | `100` | Cap on detected scenes (prevents runaway on long videos) |
| `indexForRAG` | `false` | Index results into RAG vector store |

## Scene Detection

### Live Stream / Batch Detection

Use `detectScenes()` for real-time visual change detection on frame streams. Returns an AsyncGenerator that yields `SceneBoundary` objects as visual discontinuities are detected.

```typescript
import { detectScenes } from 'agentos';

// From a pre-recorded video (frames extracted via ffmpeg)
for await (const boundary of detectScenes({ frames: extractedFrameStream })) {
  console.log(`Scene ${boundary.index} at ${boundary.startTimeSec}s`);
  console.log(`  Type: ${boundary.cutType}, Confidence: ${boundary.confidence}`);
}
```

### Use Cases

- **Webcam / security camera**: Detect motion or scene changes in real-time surveillance feeds
- **Screen recording**: Identify slide transitions in presentations, page changes in demos
- **Video editing**: Automatically segment raw footage at cut points
- **Content moderation**: Flag rapid scene changes that may indicate problematic content

### Configuration

```typescript
for await (const boundary of detectScenes({
  frames: webcamStream,
  hardCutThreshold: 0.4,     // Less sensitive to hard cuts
  gradualThreshold: 0.15,    // Standard sensitivity for dissolves/fades
  minSceneDurationSec: 2.0,  // Suppress very short scenes
  methods: ['histogram'],     // Fast histogram-only detection
})) {
  handleSceneChange(boundary);
}
```

### Cut Type Classification

The detector classifies each scene boundary:

| Cut Type | Description |
|----------|-------------|
| `hard-cut` | Abrupt frame-to-frame change (most common) |
| `dissolve` | Cross-dissolve / superimposition transition |
| `fade` | Fade from/to black or white |
| `gradual` | Other gradual visual change |

## Prerequisites

- At least one video provider API key for generation (`RUNWAY_API_KEY`, `REPLICATE_API_TOKEN`, or `FAL_API_KEY`)
- **ffmpeg** on PATH for video analysis (frame extraction and audio demuxing)
- A vision-capable LLM (`OPENAI_API_KEY` or equivalent) for scene description
- An STT provider for audio transcription (when `transcribeAudio` is enabled)

Scene detection (`detectScenes()`) has zero external dependencies — it works purely on RGB pixel buffers.

## Examples

- "Generate a 5-second cinematic video of a sunset over the ocean"
- "Turn this product photo into a video with a slow camera orbit"
- "Analyse this tutorial video and index it for search"
- "Detect scene changes in this security camera feed"
- "Extract structured scenes from this presentation recording"
- "Create a video from this image with gentle parallax motion"
