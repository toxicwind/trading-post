---
name: github
version: '2.0.0'
description: Full GitHub API integration — 26 tools for repos, issues, PRs, branches, commits, releases, Actions, files, gists, and codebase indexing.
author: Wunderland
namespace: wunderland
category: developer
tags: [github, git, repository, issues, pull-requests, code-review, ci-cd, releases, actions, api]
requires_secrets: [github.token]
requires_tools: [github_search, github_repo_list, github_repo_info, github_repo_create, github_repo_index, github_file_read, github_file_write, github_gist_create, github_issue_list, github_issue_create, github_issue_update, github_comment_list, github_pr_list, github_pr_create, github_pr_diff, github_pr_review, github_pr_merge, github_pr_comment_list, github_pr_comment_create, github_branch_list, github_branch_create, github_commit_list, github_release_list, github_release_create, github_actions_list, github_actions_trigger]
metadata:
  agentos:
    emoji: "\U0001F4BB"
---

# GitHub

You have **26 GitHub tools** that cover the full developer workflow: searching code, managing repositories, reading and writing files, triaging issues, reviewing and merging pull requests, creating releases, and orchestrating CI/CD pipelines. These tools call the GitHub REST API directly — no CLI binary required.

## Available Tools

| Tool | Description | Mode |
|------|-------------|------|
| `github_search` | Search repositories, code, issues, and users across GitHub | read |
| `github_repo_list` | List repositories for a user or organization | read |
| `github_repo_info` | Get detailed metadata for a single repository | read |
| `github_repo_create` | Create a new repository (public or private) | write |
| `github_repo_index` | Embed an entire repository into the knowledge base for RAG queries | write |
| `github_file_read` | Read a file or directory listing from a repo at a given ref | read |
| `github_file_write` | Create or update a file in a repository (commit directly) | write |
| `github_gist_create` | Create a new GitHub Gist (public or secret) | write |
| `github_issue_list` | List and filter issues by state, labels, assignee, milestone | read |
| `github_issue_create` | Open a new issue with title, body, labels, and assignees | write |
| `github_issue_update` | Update an issue's title, body, state, labels, or assignees | write |
| `github_comment_list` | List comments on an issue | read |
| `github_pr_list` | List pull requests filtered by state, head, base, or author | read |
| `github_pr_create` | Open a new pull request from a head branch to a base branch | write |
| `github_pr_diff` | Get the unified diff of a pull request | read |
| `github_pr_review` | Submit a review (approve, request changes, or comment) with inline comments | write |
| `github_pr_merge` | Merge a pull request (merge, squash, or rebase strategy) | write |
| `github_pr_comment_list` | List review comments on a pull request | read |
| `github_pr_comment_create` | Post a new review comment on a pull request diff | write |
| `github_branch_list` | List branches in a repository | read |
| `github_branch_create` | Create a new branch from a given SHA or ref | write |
| `github_commit_list` | List commits on a branch, path, or date range | read |
| `github_release_list` | List releases for a repository | read |
| `github_release_create` | Create a new release with tag, name, body, and asset uploads | write |
| `github_actions_list` | List workflow runs, filtered by workflow, branch, or status | read |
| `github_actions_trigger` | Trigger a workflow_dispatch event on a workflow | write |

## Workflow: Repository Exploration

Discover and navigate repositories step by step:

1. **List repos** — `github_repo_list` with an owner to see all their repositories.
2. **Get details** — `github_repo_info` for the target repo (description, default branch, language, open issues count, license).
3. **Browse the tree** — `github_file_read` with path `/` to get the root directory listing, then drill into subdirectories.
4. **Read specific files** — `github_file_read` with the full file path to read README, source files, configs, etc.

When exploring an unfamiliar project, start with the README and package manifests (package.json, Cargo.toml, pyproject.toml) to understand the stack before diving into source code.

## Workflow: Codebase Deep-Dive

For large repositories where you need to answer questions across many files:

1. **Index the repo** — `github_repo_index` embeds the entire codebase (or a filtered subset) into the knowledge base. This may take a moment for large repos.
2. **Ask questions** — Once indexed, answer questions using RAG retrieval against the embedded codebase. This is far more efficient than reading files one by one.

Use this workflow when the user asks broad questions like "how does authentication work in this project?" or "find all usages of the database connection pool."

## Workflow: Code Contribution

Make changes to a repository through the API:

1. **Create a branch** — `github_branch_create` from the default branch HEAD (get the SHA from `github_repo_info` or `github_commit_list`).
2. **Write files** — `github_file_write` to create or update files on the new branch. Each call creates a commit. For multiple file changes, make sequential writes to the same branch.
3. **Open a PR** — `github_pr_create` with a clear title, detailed body describing the changes, and the head/base branches.

Always create feature branches rather than committing directly to the default branch.

## Workflow: PR Review

Review pull requests with specific, actionable feedback:

1. **Read the diff** — `github_pr_diff` to get the full unified diff of the PR.
2. **Read changed files** — `github_file_read` for files that need full context beyond the diff hunks.
3. **Submit a review** — `github_pr_review` with an event (APPROVE, REQUEST_CHANGES, or COMMENT) and inline comments referencing specific lines in the diff.

When reviewing, focus on correctness, security implications, test coverage, and adherence to project conventions. Reference specific line numbers in your inline comments.

## Workflow: Issue Triage

Organize and manage the issue backlog:

1. **List issues** — `github_issue_list` filtered by state, labels, or milestone to see what needs attention.
2. **Read context** — `github_comment_list` on an issue to understand the full discussion.
3. **Update issues** — `github_issue_update` to add labels (bug, enhancement, priority), assign team members, link to milestones, or close resolved issues.
4. **Create issues** — `github_issue_create` when you identify new work items, bugs, or feature requests.

When triaging, check for duplicate issues first using `github_search` before creating new ones.

## Workflow: Release Management

Cut releases with proper versioning and changelogs:

1. **Review commits** — `github_commit_list` to see what has landed since the last release.
2. **Create the release** — `github_release_create` with a semantic version tag, a descriptive name, and release notes summarizing the changes.

Use conventional commit messages or the auto-generated notes feature to build changelogs. Tag format should follow the project's convention (e.g., `v1.2.0` or `1.2.0`).

## Workflow: CI/CD

Monitor and trigger GitHub Actions workflows:

1. **List runs** — `github_actions_list` filtered by workflow name, branch, or status to check the current state of CI.
2. **Trigger a workflow** — `github_actions_trigger` to kick off a workflow_dispatch event, optionally passing input parameters.
3. **Poll for completion** — `github_actions_list` again after triggering, filtering by the run ID or branch, to monitor progress until the run completes.

When a workflow fails, use `github_actions_list` to identify the failing run, then investigate the related commits and PR for debugging context.

## Safety Rules

- **Confirm before write operations** — Always confirm with the user before creating repos, writing files, merging PRs, creating releases, or triggering workflows.
- **Check branch protection** — Before writing files or merging, be aware that protected branches may reject direct pushes. Use feature branches and PRs instead.
- **Never force-push** — These tools do not support force-push, and you should never attempt destructive history rewrites through the API.
- **Rate limit awareness** — Authenticated requests are limited to 5,000/hour. For bulk operations (indexing, large searches), be mindful of consumption. The tools will return rate limit headers when approaching the threshold.
- **Destructive actions are irreversible** — Deleting branches, closing issues, and merging PRs cannot be undone through these tools. Double-check before proceeding.

## Authentication

The GitHub tools authenticate using a personal access token from one of these sources, checked in order:

1. `GITHUB_TOKEN` environment variable
2. `GH_TOKEN` environment variable
3. `gh auth token` CLI fallback (if `gh` is installed and authenticated)

**Required scopes:**
- `repo` — full access to private repositories (read/write code, issues, PRs, releases, Actions)
- `public_repo` — sufficient if you only work with public repositories
- `gist` — needed for `github_gist_create`

To create a token, visit [github.com/settings/tokens](https://github.com/settings/tokens) and select the scopes above. Fine-grained tokens scoped to specific repositories are recommended for production use.
