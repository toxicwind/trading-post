---
name: topicality
version: '1.0.0'
description: Enforce allowed and forbidden conversation topics using semantic embedding similarity with session-aware drift detection
author: Frame.dev
namespace: wunderland
category: security
tags: [guardrails, topics, topicality, off-topic, embeddings, drift-detection]
requires_tools: [check_topic]
metadata:
  agentos:
    emoji: "\U0001F3AF"
---

# Topicality

A guardrail automatically enforces conversation topic boundaries. Messages
matching forbidden topics are blocked. Messages outside allowed topics are
flagged. Gradual off-topic drift across multiple turns is detected.

## When to Use check_topic

- To verify if RAG retrieval results are relevant to allowed topics
- Before presenting user-submitted content to the agent
- In content moderation workflows

## What It Enforces

- **Allowed topics**: messages must be semantically related to at least one allowed topic
- **Forbidden topics**: messages matching a forbidden topic are blocked
- **Drift detection**: gradual off-topic steering across multiple turns is caught

## Constraints

- Requires an embedding provider (OpenAI, etc.) to be configured
- Topic embeddings are computed lazily on first evaluation
- Drift detection tracks per-session state (cleaned up after 1 hour of inactivity)
