---
name: vision-ocr
version: '1.1.0'
description: Extract text from images using OCR and vision AI with the performOCR() high-level API or the full VisionPipeline.
author: Wunderland
namespace: wunderland
category: vision
tags: [vision, ocr, text-extraction, document, handwriting]
requires_secrets: []
requires_tools: [vision-pipeline]
---

# Vision & OCR

Extract text from images, documents, and handwritten notes using a progressive 3-tier pipeline: local OCR (PaddleOCR / Tesseract) -> local vision models (TrOCR, Florence-2) -> cloud vision LLM (GPT-4o, Claude, Gemini).

## High-Level API: `performOCR()`

For one-shot text extraction, use the top-level `performOCR()` function. It handles input resolution, pipeline lifecycle, and cleanup automatically.

```typescript
import { performOCR } from '@framers/agentos';

const result = await performOCR({
  image: '/path/to/receipt.png',   // file path, URL, base64, or Buffer
  strategy: 'progressive',         // 'progressive' | 'local-only' | 'cloud-only'
  confidenceThreshold: 0.7,        // min confidence before escalating tier
});

console.log(result.text);       // extracted text
console.log(result.confidence); // 0–1 score
console.log(result.tier);       // 'ocr' | 'handwriting' | 'document-ai' | 'cloud-vision'
console.log(result.provider);   // 'paddle' | 'tesseract' | 'openai' | etc.
console.log(result.regions);    // bounding boxes (when available)
```

## When to use `performOCR()` vs `VisionPipeline`

| Use case | Recommendation |
|----------|---------------|
| One-shot text extraction from a single image | `performOCR()` — simplest API |
| Batch processing many images | `VisionPipeline` — create once, reuse, dispose when done |
| Need CLIP embeddings or document layout | `VisionPipeline` — richer result shape |
| Quick scripts and integrations | `performOCR()` — zero boilerplate |

## Progressive Tier System

The pipeline tries the cheapest/fastest tier first and only escalates when confidence is below threshold:

1. **Tier 1 — Local OCR** (PaddleOCR or Tesseract.js): Fast, free, offline. Handles printed text in documents, receipts, screenshots.
2. **Tier 2 — Local Vision Models** (TrOCR / Florence-2): Still offline. Handles handwritten notes, complex document layouts with tables and figures.
3. **Tier 3 — Cloud Vision LLM** (GPT-4o / Claude / Gemini): Best quality. Handles photographs, diagrams, mixed content, anything the local tiers can't confidently read.

## Strategy Selection

- **`'progressive'`** (default): Start local, escalate only if needed. Best cost/quality balance for most use cases.
- **`'local-only'`**: Never call cloud APIs. Use for air-gapped environments, privacy-sensitive data (medical records, financial docs), or when no API keys are available.
- **`'cloud-only'`**: Skip local tiers entirely, send straight to a cloud vision LLM. Use when you need the highest quality output and cost is not a concern.

## Input Formats

`performOCR()` accepts four input types:

- **File path**: `'/tmp/scan.png'` — reads from disk
- **URL**: `'https://example.com/receipt.jpg'` — fetches via HTTP
- **Base64 string**: Raw base64 or `data:image/png;base64,...` data URIs — decoded in-memory
- **Buffer**: Raw image bytes — passed directly to the pipeline

## Capabilities

- **Printed text OCR**: Extract text from documents, receipts, screenshots, PDFs
- **Handwriting recognition**: Read handwritten notes and forms via TrOCR
- **Document layout understanding**: Parse tables, figures, headings via Florence-2
- **Bounding box regions**: Spatial text locations for overlay rendering
- **Image embeddings**: Generate CLIP vectors for semantic image search (via `VisionPipeline` only)

## Examples

- "Read the text from this receipt"
- "What does this handwritten note say?"
- "Extract the table data from this PDF page"
- "OCR this screenshot and return the error message"
