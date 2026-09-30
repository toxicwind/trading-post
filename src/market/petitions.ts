/**
 * @fileoverview Governance for the emergent task economy: upgrade petitions
 * → structured debates → approved proposals becoming market tasks.
 *
 * Any persistent agent may file a petition. The oracle chairs a debate with
 * advocates; an approved proposal becomes a biddable task contract. Approved
 * change proposals are shaped as bounded config deltas (see
 * `BoundedChange`) in the spirit of agentos's SelfImprovementConfig:
 * bounded, budgeted, reviewable — never unbounded self-modification.
 * No framework imports; this module stands on the market's own types.
 *
 * @module agentos/market/petitions
 */

import type { Debate, Petition, TaskContract } from './types.js';

/**
 * A bounded change proposal: the shape every approved upgrade takes.
 *
 * Compatible with agentos's SelfImprovementConfig philosophy — every
 * self-modification is bounded by scope and budget, never open-ended.
 */
export interface BoundedChange {
  /** What part of the agent the change touches. */
  scope: 'personality' | 'skills' | 'workflows' | 'self-evaluation';
  /** Human-readable description of the delta. */
  delta: string;
  /** Resource bounds for implementing and validating the change. */
  budget: {
    maxTokens?: number;
    maxSeconds?: number;
    /** Plain-words cost, e.g. "2h of a review-class bidder". */
    cost?: string;
  };
  /** Why the change is warranted. */
  rationale: string;
}

/** One advocate's position in a debate. */
export interface Advocate {
  side: string;
  agent: string;
  argument: string;
}

/** Verdicts a settled debate can carry. */
export type DebateOutcome = 'approved' | 'rejected' | string;

/** Unique id: random UUID where available, timestamp-based fallback. */
function newId(prefix: string): string {
  const uuid =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? (crypto as Crypto).randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  return `${prefix}-${uuid}`;
}

/**
 * File an upgrade petition. Any persistent agent may file; the petition
 * itself is just a record — it becomes actionable only through debate.
 */
export function filePetition(filer: string, want: string, why: string, cost: string): Petition {
  return {
    id: newId('petition'),
    filer,
    want,
    why,
    cost,
    ts: new Date().toISOString(),
  };
}

/**
 * Open a structured debate on a question (a petition's `want`, or any open
 * question). Advocates are recorded per side — structured argumentation,
 * not vibes.
 */
export function openDebate(question: string, advocates: Advocate[]): Debate {
  return {
    id: newId('debate'),
    question,
    advocates: advocates.map((a) => ({
      side: a.side,
      agent: a.agent,
      argument: a.argument,
    })),
    verdict: '',
    rationale: '',
    ts: new Date().toISOString(),
  };
}

/**
 * Settle a debate with a verdict and rationale. Returns a new Debate object
 * (the input is not mutated); `ts` marks settlement time.
 */
export function settleDebate(debate: Debate, verdict: DebateOutcome, rationale: string): Debate {
  return {
    ...debate,
    advocates: debate.advocates.map((a) => ({ ...a })),
    verdict,
    rationale,
    ts: new Date().toISOString(),
  };
}

/** Whether a verdict counts as approval (fail-closed: only explicit approvals). */
function isApproved(verdict: string): boolean {
  return ['approved', 'accept', 'accepted', 'yes', 'pass'].includes(verdict.trim().toLowerCase());
}

/**
 * Shape an approved proposal as a bounded change delta.
 *
 * @param petition The petition under debate.
 * @param debate The settled debate.
 * @param scope Which agent surface the change touches.
 * @param budget Resource bounds for the implementation.
 * @returns A BoundedChange, or null when the debate was not approved.
 */
export function toBoundedChange(
  petition: Petition,
  debate: Debate,
  scope: BoundedChange['scope'],
  budget: BoundedChange['budget'] = {},
): BoundedChange | null {
  if (!isApproved(debate.verdict)) return null;
  return {
    scope,
    delta: petition.want,
    budget: {
      ...budget,
      cost: budget.cost ?? petition.cost,
    },
    rationale: debate.rationale || petition.why,
  };
}

/**
 * Convert a settled debate on a petition into a market task contract.
 * Approved → a bounded, biddable task; rejected (or unsettled) → null.
 *
 * The resulting contract carries tags `['governance', scope]` so
 * governance-scoped bidders match it, and acceptance criteria that force
 * the winner to honor the bound (implement the delta AND prove it stays
 * within budget — no unbounded self-modification ships).
 *
 * @param petition The petition that went to debate.
 * @param debate The settled debate (verdict must be explicitly approved).
 * @param scope Change scope; defaults to 'workflows'.
 */
export function petitionToContract(
  petition: Petition,
  debate: Debate,
  scope: BoundedChange['scope'] = 'workflows',
): TaskContract | null {
  if (!isApproved(debate.verdict)) return null;

  const slug = petition.want
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40) || 'petition-task';

  return {
    task: `petition-${petition.id.slice('petition-'.length, 'petition-'.length + 8)}-${slug}`,
    goal: `Implement approved upgrade: ${petition.want}`,
    tags: ['governance', scope],
    accept: [
      `the change described in the proposal is implemented and demonstrable`,
      `implementation stays within the declared cost bound ("${petition.cost}")`,
      `no agent surface outside scope "${scope}" is modified`,
    ],
    workdir: `/home/toxic/sovereign/hatch/emergent-market/work/petition-${petition.id.slice(-8)}`,
    priority: 'normal',
  };
}
