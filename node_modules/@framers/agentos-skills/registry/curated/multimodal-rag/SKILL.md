---
name: multimodal-rag
version: '2.0.0'
description: Index and search across text, images, audio, video, and PDFs via the multimodal RAG pipeline and HTTP API.
author: Wunderland
namespace: wunderland
category: productivity
tags: [rag, multimodal, image, audio, video, pdf, search, indexing, memory]
requires_secrets: []
requires_tools: [vision-pipeline]
metadata:
  agentos:
    emoji: "\U0001F50D"
---

# Multimodal RAG

Use this skill when the user wants to index, search, or retrieve content across multiple modalities -- text, images, audio, video, and documents (PDF, DOCX, Markdown, CSV, JSON, XML). All non-text content is converted to a text representation (vision description, STT transcript, document parse) before embedding, so every modality is searchable with the same text query.

## Architecture

```
Image  --> Vision LLM --> description --> embed --> vector store
Audio  --> STT        --> transcript  --> embed --> vector store
Video  --> ffmpeg (frames + audio)   --> vision + STT --> vector store
PDF    --> text extraction + chunking --> embed --> vector store
```

When cognitive memory is enabled via `MultimodalMemoryBridge`, ingested content also creates memory traces so agents can recall multimodal content during conversation without an explicit search.

## Capabilities

- **Image indexing** — Vision LLM describes the image, description is embedded and searchable.
- **Audio indexing** — STT transcribes the audio, transcript is chunked and searchable.
- **Video indexing** — Frame extraction (vision) + audio transcription (STT), both indexed.
- **Document indexing** — PDF, DOCX, TXT, Markdown, CSV, JSON, XML text extracted and indexed.
- **Cross-modal search** — A single text query returns results from all modalities, ranked by relevance.
- **Query-by-image** — Upload an image to find similar indexed content.
- **Query-by-audio** — Upload audio to find related indexed content via transcript matching.

## HTTP API Routes

All routes are mounted under `/api/agentos/rag/multimodal`. Ingestion routes accept `multipart/form-data`.

### Ingest

| Method | Path | Field | Description |
|--------|------|-------|-------------|
| POST | `/images/ingest` | `image` | Ingest an image (max 15 MB). Vision LLM generates description. |
| POST | `/audio/ingest` | `audio` | Ingest audio (max 25 MB). STT generates transcript. |
| POST | `/documents/ingest` | `document` | Ingest a document (max 30 MB). Text extracted and chunked. |

Common form fields for all ingest routes:

| Field | Type | Description |
|-------|------|-------------|
| `collectionId` | string | Target collection (default: auto) |
| `assetId` | string | Optional custom ID for the asset |
| `category` | string | `conversation_memory`, `knowledge_base`, `user_notes`, `system`, `custom` |
| `tags` | string | Comma-separated or JSON array of tags |
| `metadata` | string | JSON object with arbitrary metadata |
| `storePayload` | boolean | Whether to store the raw binary (for later download) |
| `sourceUrl` | string | Original URL of the content |
| `textRepresentation` | string | Override auto-generated description/transcript |
| `userId` | string | Owner user ID |
| `agentId` | string | Owner agent ID |

### Query

| Method | Path | Body / Field | Description |
|--------|------|-------------|-------------|
| POST | `/query` | JSON body | Text query across all modalities |
| POST | `/images/query` | `image` field | Query by uploading an image |
| POST | `/audio/query` | `audio` field | Query by uploading audio |

Text query body:

```json
{
  "query": "quantum computing diagrams",
  "modalities": ["image", "audio", "document"],
  "collectionIds": ["knowledge-base"],
  "topK": 10,
  "includeMetadata": true
}
```

Image/audio query form fields:

| Field | Type | Description |
|-------|------|-------------|
| `modalities` | string | Comma-separated: `image`, `audio`, `document` |
| `collectionIds` | string | Comma-separated collection IDs to search |
| `topK` | number | Max results (default: 5) |
| `includeMetadata` | boolean | Include stored metadata in results |
| `retrievalMode` | string | `auto` (default), `text`, `native`, `hybrid` |

### Asset Management

| Method | Path | Description |
|--------|------|-------------|
| GET | `/assets/:assetId` | Get asset metadata |
| GET | `/assets/:assetId/content` | Download raw binary (if `storePayload` was true) |
| DELETE | `/assets/:assetId` | Delete asset and its embeddings |

## Retrieval Modes

- **`auto`** (default) — Text-first retrieval with native augmentation when available.
- **`text`** — Derive a caption/transcript and query the standard text pipeline only.
- **`native`** — Use modality-native embeddings (e.g. CLIP for images) when available.
- **`hybrid`** — Combine text and native retrieval, merge and re-rank results.

## Programmatic Usage

```typescript
import { MultimodalMemoryBridge } from 'agentos/rag/multimodal';

// Ingest an image
await bridge.ingestImage(imageBuffer, { source: 'upload', tags: ['product'] });

// Ingest audio
await bridge.ingestAudio(audioBuffer, { language: 'en' });

// Ingest video (requires ffmpeg)
await bridge.ingestVideo(videoBuffer, { extractFrames: true });

// Ingest PDF
await bridge.ingestPDF(pdfBuffer, { extractImages: true });

// Cross-modal search
const results = await indexer.search('quantum computing', {
  topK: 10,
  modalities: ['image', 'text', 'audio'],
});
```

## Examples

- "Index this product photo so I can find it by description later."
- "Ingest all the PDFs in this folder into my knowledge base."
- "Search my audio recordings for mentions of the quarterly budget."
- "Find images related to the network architecture diagram."
- "What does the chart on page 5 of the annual report show?"
- "Upload this meeting recording and make it searchable."

## Constraints

- Image uploads are capped at 15 MB, audio at 25 MB, documents at 30 MB.
- Supported audio formats: MP3, MP4, M4A, WAV, WebM, OGG (Whisper-compatible).
- Supported document formats: PDF, DOCX, TXT, Markdown, CSV, JSON, XML.
- Video ingestion requires ffmpeg installed on the system.
- Vision LLM and STT provider must be configured for image/audio indexing respectively.
- Cross-modal search ranks by cosine similarity of embedded text representations; it does not perform true multimodal embedding fusion unless `retrievalMode: 'native'` is used with a CLIP-like model.
