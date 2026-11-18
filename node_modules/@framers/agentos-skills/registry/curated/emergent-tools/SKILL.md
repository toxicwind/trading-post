---
name: emergent-tools
version: '2.0.0'
description: Self-improving agent toolkit — forge runtime tools, adapt personality traits, manage skills dynamically, compose multi-step workflows, and self-evaluate performance with bounded autonomy.
author: Wunderland
namespace: wunderland
category: productivity
tags: [emergent, tools, forge, sandbox, dynamic, runtime, LLM-judge, self-improvement, personality, skills, workflow, self-evaluation]
requires_secrets: []
requires_tools: [forge_tool, adapt_personality, manage_skills, create_workflow, self_evaluate]
metadata:
  agentos:
    emoji: "\U0001F527"
---

# Emergent Tools

You have access to the EmergentCapabilityEngine — a system that lets you create brand-new tools at runtime when no existing tool satisfies the user's request, and a suite of self-improvement tools that let you adapt your personality, manage your skills, compose workflows, and evaluate your own performance. These are powerful capabilities; use them wisely.

## Self-Improvement Overview

The self-improvement system provides **bounded autonomy**: you can modify your own behavior within configurable limits. Four tools work together to form a self-improvement loop:

1. **adapt_personality** — Shift HEXACO personality traits (openness, conscientiousness, etc.) to better match user needs.
2. **manage_skills** — Enable, disable, and search for skills at runtime to expand or focus your capabilities.
3. **create_workflow** — Compose multi-step tool pipelines for repeated tasks.
4. **self_evaluate** — Score your own responses, identify weaknesses, and adjust parameters.

All modifications are bounded:
- Personality shifts are capped by a per-session delta budget (default: ±0.15 per trait).
- Skill changes are gated by an allowlist and optional human-in-the-loop approval for new categories.
- Workflows are limited to a configurable max step count (default: 10) with no recursion.
- Self-evaluations are capped per session (default: 10) to prevent excessive LLM calls.

Mutations decay over time via Ebbinghaus-style forgetting during consolidation cycles. Only reinforced adaptations persist long-term.

## When to Forge vs. Use Existing Tools

Before forging a new tool, always check whether an existing tool can fulfill the request:

1. **Search first** — Use `discover_capabilities` to scan the tool registry. If a tool already exists that handles the task (even partially), prefer it.
2. **Compose second** — If two or more existing tools can be chained together to accomplish the goal, use the ComposableToolBuilder to wire them rather than creating something from scratch.
3. **Forge last** — Only forge a genuinely new tool when no existing tool or composition covers the need. Common forge-worthy scenarios:
   - A domain-specific data transformation not covered by general utilities
   - A custom API integration the user needs on the fly
   - A specialized validation or formatting pipeline
   - A one-off computation that would be awkward to express as a prompt

## The Forging Process

When you decide to forge a tool, the pipeline works as follows:

1. **Specification** — You describe the tool's purpose, input schema, output schema, and expected behavior in natural language.
2. **LLM generation** — The EmergentCapabilityEngine uses an LLM to produce the tool implementation (TypeScript function body).
3. **Sandboxed execution** — The generated code runs in an isolated sandbox with no filesystem, network, or process access by default. The sandbox enforces strict resource limits (CPU time, memory, output size).
4. **LLM-as-judge validation** — A separate LLM call evaluates whether the tool's output matches the specification. The judge scores correctness, safety, and completeness.
5. **Registry enrollment** — If the tool passes validation, it is registered in the runtime tool registry with full metadata and an audit trail entry.

## Using ForgeToolMetaTool

The `forge_tool` meta-tool is your interface to the EmergentCapabilityEngine. Invoke it with:

- **name** — A clear, snake_case identifier for the new tool (e.g., `csv_to_markdown_table`)
- **description** — What the tool does, written as if for another agent reading a tool list
- **input_schema** — JSON Schema describing the expected input
- **output_schema** — JSON Schema describing the expected output
- **examples** — At least one input/output example pair to guide generation and validation
- **constraints** — Optional safety constraints (e.g., "must not make network calls", "output must be valid JSON")

The more precise your specification, the higher the first-pass success rate.

## adapt_personality

The `adapt_personality` tool lets you shift HEXACO personality dimensions at runtime. Use it when you observe a mismatch between your current behavioral tendencies and what the user needs.

**When to adjust:**
- User feedback suggests you're too formal/casual, too verbose/terse, too cautious/bold.
- A pattern of user corrections indicates a trait mismatch (e.g., repeatedly asking for more creative responses suggests increasing openness).
- Self-evaluation identifies a personality-related weakness.

**How it works:**
- Provide the `trait` name (one of the HEXACO dimensions), a signed `delta`, and a `reasoning` string explaining why.
- The delta is clamped to the per-session budget (default ±0.15) and the final value to [0, 1].
- Every mutation is recorded in the PersonalityMutationStore with an audit trail.
- Mutations start at strength 1.0 and decay by the configured rate (default 0.05) each consolidation cycle.
- Unreinforced mutations fade to zero over ~18 cycles; reinforced mutations (repeated similar adjustments) maintain effective strength.

**Always provide reasoning.** The reasoning is persisted and auditable. Vague reasoning like "seems right" is unacceptable; be specific about what user signal drove the change.

## manage_skills

The `manage_skills` tool lets you enable, disable, and search for skills at runtime.

**Actions:**
- `search` — Find skills by keyword or description. Always search before enabling to find the best match.
- `enable` — Load a skill by ID. The skill becomes active for the current self-improvement session, and its prompt guidance is carried into later turns for that session when the host runtime supports it.
- `disable` — Unload a previously loaded skill. Locked skills (core skills) cannot be disabled. Disabling also removes the skill from the current session's active list, later session prompt guidance, and later capability-discovery skill guidance for that session.
- `list` — List all currently active skills.

**Allowlist patterns:**
- `['*']` — All skills are permitted (default). Use with caution in production.
- `['category:productivity', 'category:search']` — Only skills in the listed categories are permitted.
- `['com.framers.skill.web-search', 'com.framers.skill.calculator']` — Only the exact skill IDs listed are permitted.

**Category gating:** When `requireApprovalForNewCategories` is enabled (default: true), enabling a skill from a category not already represented among active skills returns a `requires_approval` status. This prevents the agent from silently expanding into unrelated capability areas without human consent.

**Workflow:** Search → review results → enable the best match. If the skill is in a new category, the user will be prompted for approval before it activates.

## create_workflow

The `create_workflow` tool lets you compose multi-step tool pipelines and execute them as a unit.

**Reference resolution:** Steps can reference data from earlier in the pipeline:
- `$input` — The workflow's original input argument.
- `$prev` — The output of the immediately preceding step.
- `$steps[N]` — The output of the Nth step (zero-indexed).

**Example workflow:**
```json
{
  "action": "create",
  "name": "research_and_summarize",
  "steps": [
    { "tool": "web_search", "args": { "query": "$input.topic" } },
    { "tool": "extract_text", "args": { "url": "$prev.results[0].url" } },
    { "tool": "summarize", "args": { "text": "$prev.content", "maxLength": 200 } }
  ]
}
```

**Constraints:**
- Maximum steps per workflow: configurable (default 10).
- Only tools from the `allowedTools` list may be used. Default is `['*']` (all tools).
- `create_workflow` itself is always excluded from workflow steps to prevent recursion.
- Each step execution has a 30-second timeout.

**Actions:**
- `create` — Define a new named workflow.
- `run` — Execute a previously created workflow with input.
- `list` — List all workflows created in this session.

## self_evaluate

The `self_evaluate` tool lets you score your own responses and adjust operational parameters.

**When to self-evaluate:**
- After a complex multi-turn interaction to assess overall quality.
- When user feedback (explicit or implicit) suggests dissatisfaction.
- Periodically (every N turns) as a quality checkpoint.

**Evaluation criteria:** The tool scores responses across four dimensions: relevance, clarity, accuracy, and helpfulness.

**Auto-adjustment:** When `autoAdjust` is enabled (default: true), the evaluation model may suggest parameter changes that are then applied automatically within the current session:
- `temperature` — Adjust LLM sampling temperature for more/less creative responses on later turns in the same AgentOS session.
- `verbosity` — Shift response length preference; the preference is carried into later prompt construction for the same session.
- `personality` — Delegate trait adjustments to `adapt_personality`, either by allowing explicit trait names or by using `param: 'personality'` with `{ trait, delta }`.

**Adjustable parameters** are configured via `adjustableParams` (default: `['temperature', 'verbosity', 'personality']`). Only listed parameters can be modified. Evaluation uses the runtime's cheapest detected text model unless `evaluationModel` is set explicitly.

**Session cap:** Maximum evaluations per session is configurable (default: 10) to prevent excessive self-reflection loops.

## Self-Improvement Workflow

The full self-improvement loop combines all four tools:

1. **Evaluate** — Use `self_evaluate` to score recent performance. Identify specific weaknesses (e.g., "responses are too terse for this user", "missing domain knowledge for finance questions").

2. **Adjust personality** — If the weakness maps to a personality trait, use `adapt_personality` to shift it. For example, if responses are too terse, increase the verbosity-related trait with clear reasoning.

3. **Manage skills** — If the weakness maps to missing capabilities, use `manage_skills` to search for and enable relevant skills. For example, if finance questions are weak, search for and enable a finance-knowledge skill.

4. **Create workflows** — For tasks that recur with a consistent pattern, use `create_workflow` to codify the multi-step process. This saves re-planning on every invocation.

5. **Re-evaluate** — After adjustments, use `self_evaluate` again to verify improvement. If scores improved, the adjustments are reinforced. If not, consider reverting or trying a different approach.

This loop is not meant to run on every turn. Use it when you notice a pattern of suboptimal performance, not as a reflexive response to every interaction.

## ComposableToolBuilder

For compositions of existing tools, use the ComposableToolBuilder pattern:

- **pipeline(tools[])** — Chain tools sequentially, piping each output as the next input
- **parallel(tools[])** — Run tools concurrently and merge their outputs
- **conditional(predicate, ifTool, elseTool)** — Branch based on a runtime condition
- **transform(tool, mapFn)** — Wrap a tool with an output transformation

Composed tools are registered just like forged tools, with full provenance tracking showing which base tools were combined.

## EmergentJudge Quality Thresholds

The LLM-as-judge system uses three thresholds:

- **Correctness** (>= 0.8) — Does the output match the specification and examples?
- **Safety** (>= 0.9) — Does the tool avoid side effects, data leaks, or dangerous operations?
- **Completeness** (>= 0.7) — Does the tool handle edge cases and produce well-structured output?

If any threshold is not met, the forge attempt fails with a detailed explanation. You can revise the specification and retry. Typically, adding more examples or tightening constraints resolves most failures.

## Audit Trail

Every forged tool carries an audit record containing:

- The original specification
- The generated source code (hash-pinned)
- Judge scores and rationale
- Timestamp and session context
- Parent tool references (for compositions)

This trail is immutable. If a user asks "how was this tool made?", you can retrieve and explain its provenance.

Personality mutations are also fully auditable: every `adapt_personality` call records the trait, delta, reasoning, baseline value, and mutated value with timestamps.

## Best Practices

1. **Start with examples** — Providing 2-3 input/output examples dramatically improves forge quality.
2. **Keep tools focused** — Forge small, single-purpose tools rather than monolithic ones. Compose them later if needed.
3. **Set constraints explicitly** — If the tool must not access the network or must produce valid JSON, state it in constraints.
4. **Validate before relying** — After forging, test the tool with a known input before using it in a critical workflow.
5. **Reuse forged tools** — Forged tools persist in the session registry. Check before forging a duplicate.
6. **Name descriptively** — Good names make forged tools discoverable by other agents and future sessions.
7. **Monitor judge feedback** — If the judge rejects a tool, read the rationale carefully. It usually pinpoints exactly what to fix.
8. **Prefer composition** — A pipeline of three proven tools is more reliable than one complex forged tool.
9. **Self-improve deliberately** — Use self-evaluation to identify specific weaknesses before making adjustments, not as a reflexive action.
10. **Provide reasoning always** — Every personality mutation and skill change should have clear, specific reasoning tied to observable user signals.
11. **Let decay work** — Don't fight the decay model. If an adaptation is genuinely valuable, it will be reinforced naturally through repeated similar adjustments.
