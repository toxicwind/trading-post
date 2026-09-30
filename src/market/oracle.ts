/**
 * @fileoverview Oracle intake triage for the emergent task economy.
 *
 * The oracle is the one persistent identity in the market. It triages raw
 * intake text into exactly one of: a biddable task (with a contract),
 * a governance debate (open question), a direct assignment (urgent, named
 * agent), or a rejection with a reason.
 *
 * LLM wiring: the constructor takes an optional `generateText` hook — the
 * same injection pattern agentos's EmergentAgentJudge uses. The real
 * deployment wires a model here; without it (or on any LLM failure) the
 * heuristic fallback runs. Triage never throws: it always returns an
 * IntakeVerdict.
 *
 * @module agentos/market/oracle
 */

import type {
  IntakeVerdict,
  TaskContract,
  TaskPriority,
} from './types.js';

/** LLM text hook, injected by the deployment. */
export type GenerateText = (prompt: string) => Promise<string>;

/** Shaped contract fields the LLM is asked to produce. */
export interface ShapedContract {
  goal: string;
  tags: string[];
  accept: string[];
  priority: TaskPriority;
}

/**
 * Builds the final TaskContract from shaped fields (LLM or heuristic).
 * Override via the Oracle constructor for domain-specific construction.
 */
export type ContractBuilder = (shaped: ShapedContract) => TaskContract;

const DEFAULT_WORKDIR_ROOT = '/home/toxic/sovereign/hatch/emergent-market/work';

/** The acceptance marker for heuristic contracts that need refinement. */
export const TBD_ACCEPT = 'TBD by oracle — refine before market';

/** Keyword → capability tag guesses for heuristic contracts. */
const TAG_KEYWORDS: Array<[RegExp, string]> = [
  [/deploy|rollout|release|infra|ops/i, 'ops'],
  [/test|spec|coverage|qa/i, 'qa'],
  [/\bbug\b|fix|patch|hotfix/i, 'bugfix'],
  [/audit|review|inspect/i, 'review'],
  [/doc|readme|changelog/i, 'docs'],
  [/model|embed|llm|token|prompt/i, 'ml'],
  [/ui|css|feed|frontend|component/i, 'ui'],
  [/sql|database|db|query/i, 'db'],
  [/governance|petition|debate/i, 'governance'],
  [/git|commit|merge|branch/i, 'git'],
];

/**
 * Guess capability tags from raw text. Always returns at least
 * `['general']` so bidders have an eligibility hook.
 */
export function guessTags(raw: string): string[] {
  const tags = new Set<string>();
  for (const [re, tag] of TAG_KEYWORDS) {
    if (re.test(raw)) tags.add(tag);
  }
  if (tags.size === 0) tags.add('general');
  return [...tags];
}

/**
 * Guess a task priority from urgency language. Urgent without a named
 * agent stays in the market (priority escalates, mechanism stays).
 */
export function guessPriority(raw: string): TaskPriority {
  if (/\burgent\b|emergency|critical/i.test(raw)) return 'urgent';
  if (/\bhigh\b|important/i.test(raw)) return 'high';
  if (/\blow\b|whenever|someday/i.test(raw)) return 'low';
  return 'normal';
}

/** Slugify goal text into a task id. */
export function slugify(goal: string): string {
  const slug = goal
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
  return slug || 'untitled-task';
}

/** Default contract builder: deterministic, bounded, market-ready. */
export function defaultContractBuilder(shaped: ShapedContract): TaskContract {
  const task = slugify(shaped.goal);
  return {
    task,
    goal: shaped.goal,
    tags: shaped.tags.length > 0 ? shaped.tags : ['general'],
    accept: shaped.accept.length > 0 ? shaped.accept : [TBD_ACCEPT],
    workdir: `${DEFAULT_WORKDIR_ROOT}/${task}`,
    priority: shaped.priority,
  };
}

const DEBATE_SIGNALS = [
  /\?/,
  /\bshould we\b/i,
  /\bwhether\b/i,
  /\bwhich (?:one|option|approach)\b/i,
  /\bpros and cons\b/i,
  /\bdecide between\b/i,
];

const URGENT_SIGNALS = /\burgent\b|\basap\b|\bright now\b|\bimmediately\b/i;

/** Extract a named agent: `@name` or `assign ... to <name>`. */
export function extractAssignee(raw: string): string | null {
  const at = raw.match(/@([a-zA-Z][\w.-]*)/);
  if (at) return at[1];
  const assign = raw.match(/assign(?:ed|ing)?\s+(?:it\s+)?to\s+([a-zA-Z][\w.-]*)/i);
  if (assign) return assign[1];
  return null;
}

/** A deterministic, no-LLM triage pass. Always returns a verdict. */
export function heuristicTriage(raw: string, build: ContractBuilder): IntakeVerdict {
  const trimmed = raw.trim();

  if (trimmed.length === 0) {
    return { kind: 'reject', reason: 'empty intake: nothing to triage' };
  }
  if (!/[a-zA-Z]/.test(trimmed)) {
    return { kind: 'reject', reason: 'gibberish intake: no readable words found' };
  }

  if (DEBATE_SIGNALS.some((re) => re.test(trimmed))) {
    return { kind: 'debate', question: trimmed, context: 'open question from intake' };
  }

  if (URGENT_SIGNALS.test(trimmed)) {
    const assignee = extractAssignee(trimmed);
    if (assignee) {
      return {
        kind: 'direct',
        assignee,
        reason: `urgent intake naming ${assignee} — direct assignment, bypassing market`,
      };
    }
    // Urgent but no named agent: escalate priority, keep the market.
    return {
      kind: 'task',
      contract: build({
        goal: trimmed,
        tags: guessTags(trimmed),
        accept: [TBD_ACCEPT],
        priority: 'urgent',
      }),
    };
  }

  return {
    kind: 'task',
    contract: build({
      goal: trimmed,
      tags: guessTags(trimmed),
      accept: [TBD_ACCEPT],
      priority: guessPriority(trimmed),
    }),
  };
}

/** Prompt the LLM to shape intake into a contract. JSON out. */
function llmPrompt(raw: string): string {
  return [
    'You are the oracle triaging intake for an agent task market.',
    'Shape the request into a task contract. Reply with ONLY this JSON object:',
    '{"goal": "...", "tags": ["..."], "accept": ["..."], "priority": "low|normal|high|urgent"}',
    '- goal: what done looks like, one or two sentences',
    '- tags: capability tags bidders match against (ops, qa, bugfix, review, docs, ml, ui, db, governance, git, general)',
    '- accept: observable, behavior-level acceptance criteria — executable, not vibes',
    '- priority: urgent only if explicitly time-critical',
    '',
    'Intake:',
    raw,
  ].join('\n');
}

/** Pull a JSON object out of raw LLM text (tolerates code fences). */
function parseShaped(text: string): ShapedContract | null {
  try {
    const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    const json = (fenced ? fenced[1] : text).trim();
    const obj = JSON.parse(json) as Partial<ShapedContract>;
    if (typeof obj.goal !== 'string' || obj.goal.trim().length === 0) return null;
    const tags = Array.isArray(obj.tags) ? obj.tags.filter((t) => typeof t === 'string') : [];
    const accept = Array.isArray(obj.accept) ? obj.accept.filter((a) => typeof a === 'string') : [];
    const priorities: TaskPriority[] = ['low', 'normal', 'high', 'urgent'];
    const priority: TaskPriority = priorities.includes(obj.priority as TaskPriority)
      ? (obj.priority as TaskPriority)
      : 'normal';
    return {
      goal: obj.goal.trim(),
      tags: tags.length > 0 ? tags : ['general'],
      accept: accept.length > 0 ? accept : [TBD_ACCEPT],
      priority,
    };
  } catch {
    return null;
  }
}

/**
 * The oracle: persistent intake triage for the market.
 *
 * Pass `generateText` to wire a real model (the deployment does this);
 * without it the heuristic fallback classifies by signals. LLM failures
 * degrade to the heuristic — triage never throws.
 */
export class Oracle {
  private readonly generateText?: GenerateText;
  private readonly build: ContractBuilder;

  /**
   * @param generateText Optional LLM hook `(prompt) => text`. Same injection
   *   pattern as agentos's EmergentAgentJudge — the deployment wires a model.
   * @param build Optional contract builder; defaults to a deterministic one.
   */
  constructor(generateText?: GenerateText, build: ContractBuilder = defaultContractBuilder) {
    this.generateText = generateText;
    this.build = build;
  }

  /**
   * Triage raw intake into task | debate | direct | reject.
   * Never throws: LLM errors or malformed output fall back to heuristics.
   */
  async triage(raw: string): Promise<IntakeVerdict> {
    // Signal-level classification runs first and is authoritative for
    // routing: debate markers and direct-assignment patterns decide the
    // verdict kind; the LLM only shapes contracts for `task` intake.
    const routed = heuristicTriage(raw, this.build);
    if (routed.kind !== 'task') return routed;
    if (!this.generateText) return routed;

    try {
      const text = await this.generateText(llmPrompt(raw));
      const shaped = parseShaped(text);
      if (shaped) return { kind: 'task', contract: this.build(shaped) };
      return routed;
    } catch {
      return routed; // degrade to heuristic on any LLM failure
    }
  }
}
