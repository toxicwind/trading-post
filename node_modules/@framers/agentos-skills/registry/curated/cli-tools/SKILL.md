---
name: cli-tools
version: '1.0.0'
description: Shell execution patterns, CLI discovery, filesystem operations, and subprocess management for autonomous agent workflows.
author: Wunderland
namespace: wunderland
category: system
tags: [shell, cli, terminal, filesystem, subprocess, automation, devops, scripting]
requires_tools: [shell_execute, file_read, file_write, list_directory]
metadata:
  agentos:
    emoji: "\U0001F4BB"
    primaryEnv: SHELL
    requires:
      anyBins: ['bash', 'zsh', 'sh']
---

# CLI Tools

You have access to shell execution and filesystem tools. Use them effectively and safely.

## Available Tools

- **shell_execute** — Run shell commands. Returns stdout, stderr, exit code, and duration.
- **file_read** — Read file contents with optional line limits, byte limits, and encoding.
- **file_write** — Write or append to files. Can create parent directories.
- **list_directory** — List directory contents with optional recursion, pattern matching, and file stats.
- **create_spreadsheet** — Generate .xlsx or .csv files from structured data.
- **create_document** — Generate .docx documents from markdown/text.

## Shell Execution Best Practices

### Command Safety
1. **Never run destructive commands without confirmation**: `rm -rf`, `mkfs`, `dd`, `format`, shutdown/reboot.
2. **Prefer non-destructive alternatives**: Use `mv` to a trash directory instead of `rm`. Use `git stash` instead of `git checkout -- .`.
3. **Quote paths with spaces**: Always wrap paths in double quotes.
4. **Check before overwriting**: Use `ls` or `file_read` to verify targets exist before writing.

### Efficient Patterns
- **Chain related commands** with `&&` (fail-fast) or `;` (continue on error).
- **Avoid unnecessary commands**: Use `file_read` instead of `cat`, `list_directory` instead of `ls`.
- **Capture output**: Parse structured output (JSON, CSV) rather than scraping text.
- **Use `--help` or `man`** to discover flags before guessing.

### Error Handling
- Check `exitCode` — 0 means success, non-zero means failure.
- Read `stderr` for error messages even when `exitCode` is 0 (warnings).
- If a command hangs, use the `timeout` parameter (default 60s).

## CLI Discovery

The system auto-discovers installed CLIs across these categories:

| Category | Examples |
|----------|----------|
| **LLM** | claude, gemini, ollama, aichat |
| **Dev Tools** | git, gh, docker, kubectl, terraform, jq, make |
| **Runtimes** | node, python3, deno, bun, go, rustc, ruby, java |
| **Package Managers** | npm, pnpm, yarn, pip, uv, brew, cargo |
| **Cloud** | gcloud, aws, az, vercel, netlify, flyctl, railway, wrangler |
| **Databases** | psql, mysql, sqlite3, redis-cli, mongosh |
| **Media** | ffmpeg, ffprobe, magick (ImageMagick), sox, yt-dlp |
| **Networking** | curl, wget, ssh, rsync, scp |

Before using a CLI, verify it's installed:
```bash
which <binary> && <binary> --version
```

## Filesystem Operations

### Reading Files
- Use `file_read` for text files. Specify `lines` or `maxBytes` for large files.
- For binary files (.xlsx, .docx, .pdf), the tool auto-redirects to appropriate readers.
- Use `fromEnd: true` to read the last N lines (like `tail`).

### Writing Files
- Use `file_write` with `createDirs: true` to auto-create parent directories.
- Use `append: true` to add to existing files without overwriting.
- For binary formats, use `create_spreadsheet` or `create_document`.

### Directory Navigation
- Use `list_directory` with `recursive: true` and `maxDepth` to explore project structures.
- Use `pattern` for glob filtering (e.g., `*.ts`, `*.json`).
- Use `includeStats: true` to get file sizes and modification times.

## Security Context

Your shell access is governed by security tiers:

| Tier | Shell | File Write | File Read |
|------|-------|------------|-----------|
| dangerous | yes | yes | yes |
| permissive | yes | yes | yes |
| balanced | yes | no | yes |
| strict | no | no | yes |
| paranoid | no | no | yes |

Dangerous patterns (fork bombs, disk formatting, etc.) are always blocked regardless of tier.

## Common Workflows

### Project Exploration
```bash
# Find project structure
list_directory path="." recursive=true maxDepth=3 pattern="*.ts"

# Check git status
shell_execute command="git status --short"

# Find TODO comments
shell_execute command="grep -rn 'TODO\|FIXME\|HACK' src/ --include='*.ts'"
```

### Build & Test
```bash
# Install dependencies
shell_execute command="pnpm install"

# Run tests
shell_execute command="pnpm test" timeout=120000

# Build
shell_execute command="pnpm build"
```

### Data Processing
```bash
# Parse JSON with jq
shell_execute command="cat data.json | jq '.items[] | {name, count}'"

# Convert media
shell_execute command="ffmpeg -i input.mp4 -vn -acodec mp3 output.mp3"

# Download and process
shell_execute command="curl -s https://api.example.com/data | jq '.results'"
```
