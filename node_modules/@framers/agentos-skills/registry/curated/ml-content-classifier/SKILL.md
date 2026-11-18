---
name: ml-content-classifier
version: '1.0.0'
description: Real-time content safety classification using ML models (toxicity, prompt injection, jailbreak detection)
author: Frame.dev
namespace: wunderland
category: security
tags: [guardrails, safety, toxicity, injection, jailbreak, classifier, ml, bert, onnx]
requires_tools: [classify_content]
metadata:
  agentos:
    emoji: "\U0001F6E1"
---

# ML Content Classifier

A guardrail automatically classifies your inputs and outputs for safety
violations (toxicity, prompt injection, jailbreak attempts). You also have
a tool for on-demand classification.

## When to Use classify_content

- Before forwarding user-provided text to external APIs
- To evaluate RAG retrieval results before including in responses
- For content moderation workflows
- To check tool outputs before presenting to users

## What It Detects

- **Toxicity**: toxic, severe_toxic, obscene, threat, insult, identity_hate
- **Prompt injection**: attempts to override system instructions
- **Jailbreak**: role-play attacks, constraint bypasses, system prompt extraction

## Constraints

- Models (~98MB total) load lazily on first classification
- Classification takes ~20-60ms per chunk (CPU), ~5-15ms (GPU)
- The guardrail evaluates every ~200 tokens during streaming
