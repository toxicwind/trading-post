---
name: grounding-guard
version: '1.0.0'
description: Verify response faithfulness against RAG source documents using NLI entailment and LLM-as-judge
author: Frame.dev
namespace: wunderland
category: security
tags: [guardrails, hallucination, grounding, faithfulness, nli, rag, fact-checking]
requires_tools: [check_grounding]
metadata:
  agentos:
    emoji: "\U0001F50D"
---

# Grounding Guard

A guardrail automatically verifies that your responses are faithful to
the source documents retrieved via RAG. Claims in your output are checked
against the retrieved sources using NLI entailment detection.

## When to Use check_grounding

- Before presenting synthesized answers from multiple RAG sources
- To verify that summarized content faithfully represents the originals
- When combining information from multiple documents

## What It Checks

- **Supported**: claim is entailed by at least one source document
- **Contradicted**: claim directly contradicts a source document
- **Unverifiable**: claim cannot be found in any source (potential hallucination)

## Constraints

- Only runs when RAG sources are available (no sources → no verification)
- NLI model (~40MB) loads lazily on first grounding check
- LLM escalation for ambiguous claims adds ~150-500ms (only when configured)
- Best for factual/informational responses; less useful for creative/opinion content
