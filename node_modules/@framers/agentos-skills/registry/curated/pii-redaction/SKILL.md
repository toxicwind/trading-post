---
name: pii-redaction
version: '1.0.0'
description: Detect and redact personally identifiable information (PII) from text using a four-tier pipeline (regex + NLP + NER + LLM-as-judge)
author: Frame.dev
namespace: wunderland
category: security
tags: [pii, privacy, redaction, gdpr, hipaa, compliance, security, ner]
requires_tools: [pii_scan, pii_redact]
metadata:
  agentos:
    emoji: "\U0001F6E1"
    primaryEnv: PII_LLM_API_KEY
---

# PII Redaction

You have access to PII detection and redaction capabilities. A guardrail
automatically redacts PII from your inputs and outputs, but you can also
proactively scan and redact text before storing it, sending it to external
APIs, or sharing it across agents.

## When to Use

- Before storing user-provided text in memory or database
- Before sending text to third-party APIs or external tools
- Before sharing content across agents in multi-agent systems
- When a user asks you to anonymize or de-identify text
- When handling medical, financial, or legal documents

## Available Tools

### pii_scan
Scan text and return detected PII entities with type, confidence, and location.
Use this to audit text without modifying it.

### pii_redact
Redact PII from text and return the sanitized version. Supports styles:
- placeholder: [PERSON], [EMAIL], [SSN]
- mask: J*** S****, ***@***.com
- hash: [PERSON:a1b2c3d4e5] (deterministic, correlatable)
- category-tag: <PII type="PERSON">REDACTED</PII>

## Best Practices

- Scan before store: always run pii_scan before writing user data to memory
- Use placeholder style for human-readable output
- Use hash style when you need to correlate redacted entities across documents
- If a user explicitly asks you to include their name/email, respect that —
  the guardrail handles involuntary leakage, not intentional sharing

## Constraints

- NER model (~110MB) loads lazily on first detection of name-like tokens
- LLM judge calls cost tokens — only invoked for ambiguous cases
- Regex patterns cover 50+ countries for government IDs
