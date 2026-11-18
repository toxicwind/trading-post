---
name: git
version: '1.0.0'
description: Work with Git repositories from the command line.
author: Wunderland
namespace: wunderland
category: developer-tools
tags: [git, version-control, vcs, branching, commits]
requires_secrets: []
requires_tools: [filesystem]
metadata:
  agentos:
    emoji: '🧰'
    requires:
      bins: ['git']
    install:
      - id: brew
        kind: brew
        formula: git
        bins: ['git']
        label: 'Install git (brew)'
      - id: apt
        kind: apt
        package: git
        bins: ['git']
        os: ['linux']
        label: 'Install git (apt)'
---

# Git

Use `git` to inspect history, create branches, commit changes, and resolve conflicts.

## Common workflows

- Check status: `git status`
- Create a branch: `git checkout -b my-branch`
- Stage + commit: `git add -A && git commit -m "message"`
- Rebase: `git rebase -i origin/main`

## GitHub Integration

After making local commits with git, use the GitHub tools to push your work upstream and open pull requests:

- **Create a remote branch** — Use `github_branch_create` to create a branch on the remote from a given SHA. Get the SHA from your local HEAD with `git rev-parse HEAD`, then create the matching remote branch.
- **Open a pull request** — Use `github_pr_create` to open a PR from your feature branch to the default branch, with a clear title and description summarizing the changes.
- **Full GitHub API operations** — The `github` skill provides 26 tools covering PR review, merge, issue triage, release management, Actions CI/CD, and more. Reference it for anything beyond local git operations.

**Division of responsibility:** Use `git` for local operations (staging, committing, branching, rebasing, diffing, log inspection) and the `github_*` tools for remote API operations (creating PRs, reviewing code, managing issues, triggering workflows). The two complement each other — git handles your local working copy while the GitHub tools interact with the hosted platform.
