---
name: code-safety
version: '1.0.0'
description: Scan LLM-generated code for security vulnerabilities using language-aware pattern rules
author: Frame.dev
namespace: wunderland
category: security
tags: [guardrails, code-safety, security, injection, xss, owasp, static-analysis]
requires_tools: [scan_code]
metadata:
  agentos:
    emoji: "\U0001F6E1"
---

# Code Safety Scanner

A guardrail automatically scans code in your responses for security
vulnerabilities. You also have a tool for on-demand code scanning.

## When to Use scan_code

- Before writing code to files via write_file or create_file
- Before executing code via shell_execute
- When reviewing user-submitted code for security issues
- Before presenting code examples that handle user input

## What It Detects

- **Injection**: eval(), exec(), os.system(), command injection
- **SQL Injection**: string concatenation in SQL queries
- **XSS**: innerHTML, document.write, dangerouslySetInnerHTML
- **Path Traversal**: unsanitized ../ in file paths
- **Hardcoded Secrets**: API keys, passwords, tokens in code
- **Weak Crypto**: MD5/SHA1 for passwords, Math.random for security
- **Insecure Deserialization**: pickle.loads, yaml.load without SafeLoader
- **SSRF**: unvalidated URL construction from user input

## Constraints

- Regex-based detection — may have false positives on safe code patterns
- Language detection from code fence tags or heuristics
- Does not perform deep AST analysis
