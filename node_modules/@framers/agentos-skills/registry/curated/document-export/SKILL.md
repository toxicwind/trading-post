---
name: document-export
version: '1.0.0'
description: Export research, reports, and analysis to PDF, DOCX, PPTX, CSV, and XLSX with professional formatting, charts, and theming.
author: Wunderland
namespace: wunderland
category: productivity
tags: [document, export, pdf, docx, pptx, csv, xlsx, report, slides, charts, spreadsheet, presentation]
requires_secrets: []
requires_tools: [document_export, document_suggest]
metadata:
  agentos:
    emoji: "\U0001F4C4"
    homepage: https://wunderland.sh
---

# Document Export

You can export your responses, research, and analysis to professional documents in five formats: PDF, DOCX, PPTX, CSV, and XLSX.

## Tools

### `document_export`

Generate a document from structured content. Accepts a format, structured content with sections, and optional configuration.

**Formats**: `pdf`, `docx`, `pptx`, `csv`, `xlsx`

**Content structure**:
- `title` (required) -- document title for cover pages and metadata
- `subtitle` -- shown below the title on cover pages
- `author` -- embedded in document metadata
- `date` -- ISO 8601 date string
- `theme` -- visual preset: `dark`, `light`, `corporate`, `creative`, `minimal`
- `sections[]` -- ordered content sections, each containing any combination of:
  - `heading` + `level` (1/2/3)
  - `paragraphs[]` -- body text with inline markdown (`**bold**`, `*italic*`, `[link](url)`)
  - `table` -- `{ headers: string[], rows: string[][] }`
  - `chart` -- `{ type: bar|line|pie|doughnut|area|scatter, data: [...], title? }`
  - `list` -- `{ items: string[], ordered?: boolean }`
  - `keyValues` -- `[{ key, value }]` rendered as definition tables
  - `image` -- `{ url?, base64?, caption?, width? }`
  - `speakerNotes` -- PPTX only, attached as slide notes
  - `layout` -- PPTX hint: `title`, `content`, `two-column`, `image-left`, `image-right`, `chart-full`, `comparison`

**Options**: `filename`, `pageSize` (letter/a4/legal), `orientation` (portrait/landscape), `coverPage`, `pageNumbers`

**Output**: `{ filePath, downloadUrl, previewUrl, format, sizeBytes, filename }`

### `document_suggest`

Check whether a response should offer document export. Pure heuristic, no LLM call.

**Input**: `responseText`, `wordCount`, `hasTableData`, `hasSections`, `isAnalytical`

**Rules**:
- 500+ words -> suggest PDF, DOCX
- Tabular data -> suggest CSV, XLSX
- Distinct sections -> suggest PPTX
- Analytical/quantitative -> reinforce PDF, XLSX
- Minimum 200 words before any suggestion

**Output**: `{ shouldOffer, suggestedFormats[], offerText }`

## When to Offer Export

After generating substantive responses, use `document_suggest` to check if you should offer export:
- Long responses (500+ words) -> offer PDF or DOCX
- Data-heavy responses with tables -> offer CSV or XLSX
- Multi-section analysis -> offer PPTX slide deck
- Short conversational responses -> don't offer

## How to Export

When the user requests an export (or accepts your offer):
1. Structure your response content into DocumentContent format
2. Choose the right format based on what the user asked for
3. Call `document_export` with the structured content
4. Share the download link with the user

## Format Guide

### PDF Reports

Best for long-form research, analysis, and formal reports.

- Use level-1 heading for title, level-2 for major sections, level-3 for subsections
- Include tables for comparative data
- Add charts where numeric data is present (bar for comparisons, line for trends, pie for composition)
- Cover page generated automatically with title, subtitle, author, date
- Page numbers and headers included by default
- Supports inline markdown: **bold**, *italic*, [links](url)
- Images embedded from URLs or base64

### DOCX Word Documents

Same content capabilities as PDF but editable.

- Users who say "I need to edit it" or "send me a Word doc" -> DOCX
- All section types supported: headings, paragraphs, tables, charts (as data tables), images, lists
- Inline formatting preserved: bold, italic, hyperlinks
- Cover page, headers, footers with page numbers

### PPTX Slide Decks

Each section maps to one slide. Best for presentations and visual summaries.

- Keep text concise on slides -- move detail to `speakerNotes`
- Use `layout` hints: `title` for opener, `content` for standard, `chart-full` for data slides
- Native chart rendering (bar, line, pie, doughnut, area, scatter via pptxgenjs)
- Images automatically fetched and embedded
- Slide numbers in bottom-right

**Themes**:
- `corporate` -- business presentations, quarterly reviews (navy/grey, Arial)
- `dark` -- conference talks, tech demos (navy background, cyan accent)
- `light` -- general purpose, academic (white background, blue accent) [default]
- `creative` -- marketing, workshops (warm amber, gold accent, Georgia titles)
- `minimal` -- data-focused, research (monochrome, generous whitespace)

### CSV

Tabular data only. Each table section becomes a block of rows; multiple tables separated by blank rows.

- Best for data exports the user wants to import elsewhere
- Key-value pairs rendered as two-column tables
- Throws an error if no tabular data found (suggest PDF/DOCX instead)

### XLSX Spreadsheets

Multi-sheet Excel workbooks with formatting.

- Each table section becomes its own worksheet
- Header rows styled with accent colour and white bold text
- Auto-detected numeric columns get number formatting and SUM formulas
- Frozen header row for easy scrolling
- Auto-sized column widths

## Example Workflows

### Research -> PDF Report

1. User asks a research question
2. You conduct deep research, compile findings
3. `document_suggest` detects long analytical response -> `shouldOffer: true`
4. You offer: "I can export this analysis as a PDF or Word document. Want me to?"
5. User says "PDF please"
6. You call `document_export` with `format: "pdf"`, structured sections, charts for data
7. Share the download link

### Data Analysis -> Spreadsheet

1. User provides data or asks for analysis
2. You analyze, produce tables and charts
3. `document_suggest` detects tabular data -> suggests CSV, XLSX
4. User requests XLSX
5. You call `document_export` with tables as sections
6. Each table becomes a formatted worksheet with SUM formulas

### Presentation -> PPTX

1. User asks you to prepare a presentation
2. You organize content into distinct sections (intro, body, conclusion)
3. Use `layout: "title"` for opener, `"content"` for body, `"chart-full"` for data
4. Set `theme: "corporate"` for business contexts
5. Add `speakerNotes` with talking points
6. Call `document_export` with `format: "pptx"`

## Multi-Format

If the user says "export this" without specifying format, offer the most relevant options:
- Research/analysis -> PDF + DOCX
- Data-heavy -> XLSX + CSV
- Structured overview -> PPTX
- General long content -> PDF (most universally useful)
