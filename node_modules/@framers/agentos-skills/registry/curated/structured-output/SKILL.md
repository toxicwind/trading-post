---
name: structured-output
description: Extract structured JSON data from text using Zod schemas
version: 1.0.0
tags: [structured-output, json, extraction, schema, zod]
tools_required: []
---

# Structured Output

Extract structured data from unstructured text using Zod schema validation. Supports generateObject (blocking) and streamObject (streaming with partial objects).

## Capabilities
- **Entity extraction**: Pull names, dates, amounts from text
- **Classification**: Categorize content into predefined types
- **Data transformation**: Convert prose into structured JSON
- **Streaming**: Get partial objects as they build up

## Example
"Extract all people, dates, and locations from this article"
"Classify this support ticket as billing/technical/account"
"Convert this meeting notes into structured action items"
