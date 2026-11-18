---
name: image-gen
version: '2.0.0'
description: Generate, edit, upscale, and variate images using the AgentOS multi-provider image pipeline with automatic fallback.
author: Wunderland
namespace: wunderland
category: creative
tags: [image-generation, ai-art, dall-e, stable-diffusion, flux, replicate, stability, fal, creative, visual]
requires_secrets: []
requires_tools: [generate_image]
metadata:
  agentos:
    emoji: "\U0001F3A8"
    primaryEnv: OPENAI_API_KEY
    homepage: https://platform.openai.com/docs/guides/images
---

# AI Image Generation Workflow

Use this skill when the user wants to create, edit, upscale, or create variations of images. AgentOS provides four high-level APIs that route to any configured provider with automatic fallback when multiple providers have credentials set.

## The Four High-Level APIs

1. **`generateImage()`** — Create new images from text prompts.
2. **`editImage()`** — Transform existing images via img2img, inpainting, or outpainting.
3. **`upscaleImage()`** — Increase resolution (2x or 4x super-resolution).
4. **`variateImage()`** — Generate visual variations of an existing image.

If the `generate_image` tool is not loaded, enable it with `extensions_enable image-generation`.

## Provider Selection Guide

Choose the provider based on the user's priority:

| Priority | Provider | Env Var | Best For |
|----------|----------|---------|----------|
| Quality | **OpenAI** (GPT-Image-1, DALL-E 3) | `OPENAI_API_KEY` | Highest fidelity, prompt adherence, text-in-image |
| Control | **Stability AI** (SDXL, SD3, Ultra) | `STABILITY_API_KEY` | Negative prompts, style presets, cfg/steps tuning |
| Speed | **BFL / Flux** (Flux Pro 1.1) | `BFL_API_KEY` | Fast generation with strong quality |
| Speed | **Fal** (Flux Dev) | `FAL_API_KEY` | Serverless Flux inference, low latency |
| Variety | **Replicate** (Flux, SDXL, community models) | `REPLICATE_API_TOKEN` | Access to thousands of community models |
| Cost | **OpenRouter** (routes to cheapest) | `OPENROUTER_API_KEY` | Provider-agnostic routing, best price |
| Privacy | **Local SD** (A1111 / ComfyUI) | `STABLE_DIFFUSION_LOCAL_BASE_URL` | Fully offline, no data leaves the machine |

When multiple providers are configured, AgentOS wraps them in a **FallbackImageProxy** — if the primary provider fails (rate limit, outage, etc.), the request automatically retries on the next available provider in priority order.

## Operation Decision Tree

Use this to pick the right API for the user's request:

- **"Generate / create / draw / imagine"** -> `generateImage()`
- **"Edit / change / modify / transform"** -> `editImage()` with `mode: 'img2img'`
- **"Remove / fill in / fix this area"** -> `editImage()` with `mode: 'inpaint'` + mask
- **"Extend / expand the borders"** -> `editImage()` with `mode: 'outpaint'`
- **"Make it higher resolution / sharper"** -> `upscaleImage()` with `scale: 2` or `4`
- **"Show me variations / alternatives"** -> `variateImage()` with `n: 3-4`

## Prompt Engineering Tips

A strong image prompt has five components:

1. **Subject** — What is in the image. Be specific: "a red panda sitting on a mossy branch" not "an animal."
2. **Style** — Artistic approach: photorealistic, watercolor, pixel art, oil painting, vector illustration, cinematic, anime.
3. **Composition** — Camera angle and framing: close-up portrait, wide establishing shot, overhead flat lay, isometric.
4. **Lighting and Color** — Mood through light: golden hour, dramatic side-lighting, neon glow, muted earth tones, high contrast.
5. **Atmosphere** — Emotional tone: serene, ominous, whimsical, nostalgic, futuristic.

Additional tips:
- Front-load the most important elements. Models weight earlier tokens more heavily.
- Use negative prompts (Stability, Local SD) to exclude unwanted elements: "no text, no watermark, no blurry."
- For text-in-image, OpenAI GPT-Image-1 is the most reliable. Other models struggle with legible text.
- Request `quality: 'hd'` for DALL-E 3 when detail matters (doubles cost).
- For consistent characters across multiple images, describe the character in detail each time or use img2img with a reference.

## Sizes and Aspect Ratios

| Provider | Supported Sizes | Aspect Ratio Support |
|----------|----------------|---------------------|
| OpenAI | 1024x1024, 1792x1024, 1024x1792 | Via size selection |
| Stability | Flexible | `1:1`, `16:9`, `9:16`, `4:3`, `3:4`, etc. |
| Replicate/Flux | Flexible | `aspectRatio` parameter |
| Local SD | Any (multiples of 64) | Via `width`/`height` |

## Examples

- "Generate a photorealistic image of a cozy cabin in the mountains at sunset."
- "Create a professional logo for a coffee shop called 'Bean There' — vector illustration style, clean lines."
- "Edit this photo: make the sky more dramatic with storm clouds." (img2img)
- "Remove the person from the background of this product photo." (inpaint + mask)
- "Upscale this thumbnail to 4x resolution for print."
- "Show me 3 variations of this hero image with different color palettes."
- "Generate a 16:9 cinematic landscape of a neon-lit Tokyo street at night in the rain."

## Provider Preferences

You can override the default fallback chain on a per-request basis using the `providerPreferences` field from the agent config (see `providerPreferences.image` in `agent.config.json`). This lets users pin preferred providers, weight them for probabilistic routing, or block specific providers entirely.

| Key | Type | Purpose |
|-----|------|---------|
| `preferred` | `string[]` | Ordered list of provider IDs to try first (e.g., `['stability', 'openai']`). |
| `weights` | `Record<string, number>` | Relative selection weights for probabilistic routing (e.g., `{ stability: 0.7, openai: 0.3 }`). |
| `blocked` | `string[]` | Provider IDs that must never be used (e.g., `['replicate']`). |

Example — passing preferences inline:

```ts
generateImage({
  prompt: 'A neon-lit Tokyo alley in the rain',
  providerPreferences: {
    preferred: ['stability', 'openai'],
    blocked: ['replicate'],
  },
});
```

Example — setting in `agent.config.json` so all image calls inherit the preference:

```jsonc
{
  "providerPreferences": {
    "image": {
      "preferred": ["stability", "bfl"],
      "weights": { "stability": 0.6, "bfl": 0.4 },
      "blocked": ["replicate"]
    }
  }
}
```

When `providerPreferences.image` is set in the agent config, the runtime merges it with any per-request overrides (per-request wins). Blocked providers are removed from the fallback chain before any attempt is made.

## Constraints

- Image generation costs API credits per request; inform the user of approximate costs when possible.
- Content policy restrictions apply per provider: no realistic faces of real people, no violent/explicit content.
- DALL-E 3 does not support native inpainting — use GPT-Image-1 or Stability for mask-based editing.
- Upscaling is not supported by OpenAI or OpenRouter — use Stability, Replicate, or Local SD.
- Generated images may not perfectly match the prompt; iterative refinement is expected.
- Maximum prompt length varies by model (DALL-E 3: 4,000 chars; Stability: 2,000 chars).
- Local SD requires a running A1111 or ComfyUI instance with the API enabled.
- The fallback chain only activates when the primary provider fails; it does not merge results from multiple providers.
