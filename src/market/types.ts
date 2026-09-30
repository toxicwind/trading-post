/**
 * @fileoverview Shared types for the emergent task economy (src/market).
 *
 * The market is a task-bidding economy, NOT the extension store in
 * src/cognition/marketplace (which publishes agents/personas/workflows).
 * Bidders are ephemeral instances; only the oracle holds a persistent identity.
 *
 * Design principles (from arXiv research 2026-09-30, see
 * ~/workspace/emergent-tasking/research/papers-2026-09-30.md):
 *  1. Emergence from local bidding laws, not orchestrated roles.
 *  2. Bid on coherent bundles; learn the bidding function from the ledger.
 *  3. Reputation is BEHAVIOR-anchored (capability-tag x task-class),
 *     never name-anchored — bidders are ephemeral.
 *  4. Heterogeneous, evidence-grounded verifiers; debate != verification.
 *  5. Contracts bound everything; highest-eligible-bid-wins stays.
 *
 * @module agentos/market/types
 */

/** Every event the ledger can record. One JSON object per line (JSONL). */
export type LedgerEventKind =
  | 'task-open'
  | 'bid'
  | 'assign'
  | 'result'
  | 'verify'
  | 'settle'
  | 'slash'
  | 'debate'
  | 'petition';

/** Base shape: `ev` discriminates, `ts` is ISO-8601, extras per kind. */
export interface LedgerEvent {
  ev: LedgerEventKind;
  task?: string;
  ts: string;
  [k: string]: unknown;
}

/** Task priority — urgent bypasses the market via direct assignment. */
export type TaskPriority = 'low' | 'normal' | 'high' | 'urgent';

/**
 * A task contract: the acceptance bar plus resource bounds.
 * The bidder chooses the method; the contract is the law.
 */
export interface TaskContract {
  /** Slug, e.g. `verify-oracle-build`. */
  task: string;
  /** What done looks like, in plain words. */
  goal: string;
  /** Capability tags bidders match against, e.g. ["ops","git"]. */
  tags: string[];
  /** Acceptance criteria: observable, behavior-level, executable. */
  accept: string[];
  /** Where artifacts land. */
  workdir: string;
  priority: TaskPriority;
  /** Resource bounds (Agent Contracts principle). */
  budget?: {
    maxTokens?: number;
    maxSeconds?: number;
    deadline?: string;
  };
  /** Bundle id for coherent task groups (bid on bundles, not singles). */
  bundle?: string;
}

/** A bidder's offer on a task. */
export interface Bid {
  task: string;
  /** Ephemeral instance name — never used as a reputation key. */
  bidder: string;
  /** 0..1, calibrated against the bidder's own ledger history. */
  confidence: number;
  /** One-line approach sketch. */
  approach: string;
  ts: string;
  /** Bidder's capability tags (for eligibility + bundle matching). */
  tags: string[];
  /** Optional bundle claim: tasks in the same bundle bid together. */
  bundle?: string;
}

/** What the winner produced. Evidence, not claims. */
export interface TaskResult {
  task: string;
  bidder: string;
  artifacts: string[];
  /** Behavior evidence: what was run, what was observed. */
  evidence: string;
  ts: string;
}

/**
 * Independent verification. The verifier MUST be a different agent
 * (ideally a different agent class) than the bidder, and MUST execute
 * the artifacts against the acceptance criteria — never LLM-vibes alone.
 */
export interface Verification {
  task: string;
  verifier: string;
  pass: boolean;
  /** What was executed, what was observed, file:line where relevant. */
  note: string;
  ts: string;
}

/** Settlement: the market's verdict. */
export interface Settlement {
  task: string;
  bidder: string;
  verdict: 'verified' | 'failed' | 'abandoned';
  /** +1 verified settle, -2 slash, floor 0. */
  repDelta: number;
  ts: string;
}

/**
 * Behavior-anchored reputation. Keyed by (capability-tag x task-class),
 * NOT by bidder name — ephemeral instances have no persistent identity
 * to sanction (cf. "Dissociative Identity", arXiv 2605.30169).
 */
export interface ReputationEntry {
  tag: string;
  /** Task class derived from the task's tags, e.g. "ops+git". */
  taskClass: string;
  /** Floor 0. */
  score: number;
  /** Ledger-verified evidence backing the score (time-decayed). */
  evidence: { task: string; ts: string; delta: number }[];
  updatedAt: string;
}

/** A raw incoming request awaiting oracle triage. */
export interface IntakeRequest {
  id: string;
  raw: string;
  ts: string;
}

/** Oracle triage verdict. */
export type IntakeVerdict =
  | { kind: 'task'; contract: TaskContract }
  | { kind: 'debate'; question: string; context: string }
  | { kind: 'direct'; assignee: string; reason: string }
  | { kind: 'reject'; reason: string };

/** An upgrade petition: any persistent agent may file one. */
export interface Petition {
  id: string;
  filer: string;
  want: string;
  why: string;
  cost: string;
  ts: string;
}

/** A debate on a petition or open question. */
export interface Debate {
  id: string;
  question: string;
  advocates: { side: string; agent: string; argument: string }[];
  verdict: string;
  rationale: string;
  ts: string;
}

/** Watchdog health snapshot. */
export interface WatchdogReport {
  ts: string;
  aliveBidders: string[];
  stalledTasks: { task: string; state: string; since: string }[];
  ledgerLines: number;
  alerts: string[];
}
