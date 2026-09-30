/**
 * @fileoverview File-backed append-only JSONL ledger for the market.
 *
 * Every market lifecycle event (`task-open`, `bid`, `assign`, `result`,
 * `verify`, `settle`, `slash`, `debate`, `petition`) is appended as one
 * JSON object per line. Appends are single `appendFile` calls (O_APPEND),
 * which the OS applies atomically. `replay()` rebuilds each task's state
 * machine from the raw history: open → bidding → assigned → result →
 * verified / settled (or slashed). Governance events without a task
 * (`debate`, `petition`) are ignored by the task state machine.
 *
 * @module agentos/market/ledger
 */

import { readFileSync } from 'node:fs';
import { appendFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import type { LedgerEvent, LedgerEventKind, Settlement } from './types.js';

/** Every event kind the ledger accepts. */
export const LEDGER_EVENT_KINDS: readonly LedgerEventKind[] = [
  'task-open',
  'bid',
  'assign',
  'result',
  'verify',
  'settle',
  'slash',
  'debate',
  'petition',
];

/** True for non-empty trimmed strings. */
function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0;
}

/** True for parseable ISO-8601-ish date-time strings. */
function isTimestamp(v: unknown): v is string {
  return typeof v === 'string' && !Number.isNaN(Date.parse(v));
}

/** A per-field rule: returns a problem description, or null when the field is fine. */
type FieldRule = (ev: LedgerEvent) => string | null;

const requireTask: FieldRule = (ev) =>
  isNonEmptyString(ev.task) ? null : 'task must be a non-empty string';
const requireBidder: FieldRule = (ev) =>
  isNonEmptyString(ev.bidder) ? null : 'bidder must be a non-empty string';
const requireApproach: FieldRule = (ev) =>
  isNonEmptyString(ev.approach) ? null : 'approach must be a non-empty string';
const requireConfidence: FieldRule = (ev) =>
  typeof ev.confidence === 'number' && Number.isFinite(ev.confidence) && ev.confidence >= 0 && ev.confidence <= 1
    ? null
    : 'confidence must be a finite number in [0, 1]';
const requireEvidence: FieldRule = (ev) =>
  isNonEmptyString(ev.evidence) ? null : 'evidence must be a non-empty string';
const requireArtifacts: FieldRule = (ev) =>
  Array.isArray(ev.artifacts) ? null : 'artifacts must be an array';
const requireVerifier: FieldRule = (ev) =>
  isNonEmptyString(ev.verifier) ? null : 'verifier must be a non-empty string';
const requireNote: FieldRule = (ev) =>
  isNonEmptyString(ev.note) ? null : 'note must be a non-empty string';
const requirePass: FieldRule = (ev) =>
  typeof ev.pass === 'boolean' ? null : 'pass must be a boolean';
const requireVerdict: FieldRule = (ev) =>
  ev.verdict === 'verified' || ev.verdict === 'failed' || ev.verdict === 'abandoned'
    ? null
    : 'verdict must be one of verified | failed | abandoned';
const requireRepDelta: FieldRule = (ev) =>
  typeof ev.repDelta === 'number' && Number.isFinite(ev.repDelta)
    ? null
    : 'repDelta must be a finite number';
const requireOptionalRepDelta: FieldRule = (ev) =>
  ev.repDelta === undefined || (typeof ev.repDelta === 'number' && Number.isFinite(ev.repDelta))
    ? null
    : 'repDelta must be a finite number when present';
const requireReason: FieldRule = (ev) =>
  isNonEmptyString(ev.reason) ? null : 'reason must be a non-empty string';
const requireId: FieldRule = (ev) =>
  isNonEmptyString(ev.id) ? null : 'id must be a non-empty string';
const requireQuestion: FieldRule = (ev) =>
  isNonEmptyString(ev.question) ? null : 'question must be a non-empty string';
const requireFiler: FieldRule = (ev) =>
  isNonEmptyString(ev.filer) ? null : 'filer must be a non-empty string';
const requireWant: FieldRule = (ev) =>
  isNonEmptyString(ev.want) ? null : 'want must be a non-empty string';

/** Required fields beyond the base `ev` + `ts`, per event kind. */
const KIND_RULES: Record<LedgerEventKind, FieldRule[]> = {
  'task-open': [requireTask],
  bid: [requireTask, requireBidder, requireApproach, requireConfidence],
  assign: [requireTask, requireBidder],
  result: [requireTask, requireBidder, requireEvidence, requireArtifacts],
  verify: [requireTask, requireVerifier, requirePass, requireNote],
  settle: [requireTask, requireBidder, requireVerdict, requireRepDelta],
  slash: [requireTask, requireBidder, requireReason, requireOptionalRepDelta],
  debate: [requireId, requireQuestion],
  petition: [requireId, requireFiler, requireWant],
};

/**
 * Validates a raw value as a {@link LedgerEvent}.
 *
 * Throws with a precise reason when the event is malformed: unknown kind,
 * missing/unparseable `ts`, or missing/invalid fields for its kind. Extra
 * fields are allowed (the event type has an index signature).
 *
 * @param ev - The raw value to validate.
 */
export function validateLedgerEvent(ev: unknown): asserts ev is LedgerEvent {
  if (!ev || typeof ev !== 'object' || Array.isArray(ev)) {
    throw new Error('validateLedgerEvent: event must be a plain object');
  }
  const e = ev as LedgerEvent;
  if (!(LEDGER_EVENT_KINDS as readonly string[]).includes(e.ev)) {
    throw new Error(
      `validateLedgerEvent: unknown event kind ${JSON.stringify(e.ev)} — expected one of ${LEDGER_EVENT_KINDS.join(', ')}`,
    );
  }
  if (!isTimestamp(e.ts)) {
    throw new Error(`validateLedgerEvent: ts must be a parseable date-time string, got ${JSON.stringify(e.ts)}`);
  }
  const problems = KIND_RULES[e.ev].map((rule) => rule(e)).filter((p): p is string => p !== null);
  if (problems.length > 0) {
    throw new Error(`validateLedgerEvent: invalid '${e.ev}' event — ${problems.join('; ')}`);
  }
}

/** Terminal and intermediate states of the per-task state machine. */
export type TaskReplayState =
  | 'open'
  | 'bidding'
  | 'assigned'
  | 'result'
  | 'verified'
  | 'settled'
  | 'slashed';

/** A task's lifecycle as rebuilt from the ledger. */
export interface TaskReplay {
  /** Task slug. */
  task: string;
  /** Current state of the state machine. */
  state: TaskReplayState;
  /** Number of `bid` events seen. */
  bids: number;
  /** Winner, once `assign` is seen. */
  assignee?: string;
  /** Artifacts claimed by the winner's `result` event. */
  artifacts?: string[];
  /** Outcome of the latest `verify` event. */
  verification?: { verifier: string; pass: boolean; note: string };
  /** Outcome of the latest `settle` event. */
  settlement?: { bidder: string; verdict: Settlement['verdict']; repDelta: number };
  /** Out-of-order or repeated events found during replay (diagnostic, not fatal). */
  violations: string[];
  /** Event kinds in ledger order, for auditing. */
  history: LedgerEventKind[];
}

function newReplay(task: string): TaskReplay {
  return { task, state: 'open', bids: 0, violations: [], history: [] };
}

/**
 * Rebuilds every task's state machine from a list of ledger events.
 *
 * Pure function: does not touch the filesystem. Events that arrive out of
 * order (e.g. a `bid` before `task-open`) do not abort the replay — they
 * are recorded in `violations` so the ledger stays auditable. Governance
 * events without a task (`debate`, `petition`) are skipped.
 *
 * @param events - Ledger events in ledger order.
 * @returns Map from task slug to its {@link TaskReplay}.
 */
export function replayEvents(events: LedgerEvent[]): Map<string, TaskReplay> {
  if (!Array.isArray(events)) {
    throw new TypeError('replayEvents: events must be an array');
  }
  const tasks = new Map<string, TaskReplay>();
  const get = (task: string): TaskReplay => {
    let r = tasks.get(task);
    if (!r) {
      r = newReplay(task);
      tasks.set(task, r);
    }
    return r;
  };

  for (const ev of events) {
    if (!isNonEmptyString(ev.task)) continue; // governance events carry no task
    const r = get(ev.task);
    r.history.push(ev.ev);
    const opened = r.history.includes('task-open');

    switch (ev.ev) {
      case 'task-open': {
        const opens = r.history.filter((k) => k === 'task-open').length;
        if (opens > 1) {
          r.violations.push('duplicate task-open');
        } else if (r.bids > 0) {
          r.violations.push('task-open after bids');
        }
        break;
      }
      case 'bid': {
        r.bids += 1;
        if (!opened) r.violations.push('bid before task-open');
        if (r.state === 'open') r.state = 'bidding';
        else if (r.state !== 'bidding') r.violations.push(`bid in state '${r.state}'`);
        break;
      }
      case 'assign': {
        if (r.state === 'open' || r.state === 'bidding') {
          r.state = 'assigned';
          r.assignee = String(ev.bidder);
        } else {
          r.violations.push(`assign in state '${r.state}'`);
        }
        break;
      }
      case 'result': {
        if (r.state === 'assigned') {
          r.state = 'result';
          r.artifacts = (ev.artifacts as unknown[]).map(String);
        } else {
          r.violations.push(`result in state '${r.state}'`);
        }
        break;
      }
      case 'verify': {
        if (r.state === 'result' || r.state === 'verified') {
          r.state = 'verified';
          r.verification = {
            verifier: String(ev.verifier),
            pass: ev.pass as boolean,
            note: String(ev.note),
          };
        } else {
          r.violations.push(`verify in state '${r.state}'`);
        }
        break;
      }
      case 'settle': {
        if (r.state === 'verified' || r.state === 'result') {
          r.state = 'settled';
          r.settlement = {
            bidder: String(ev.bidder),
            verdict: ev.verdict as Settlement['verdict'],
            repDelta: ev.repDelta as number,
          };
        } else {
          r.violations.push(`settle in state '${r.state}'`);
        }
        break;
      }
      case 'slash': {
        r.state = 'slashed';
        break;
      }
      case 'debate':
      case 'petition': {
        // Governance — not part of the task state machine.
        break;
      }
    }
  }
  return tasks;
}

/**
 * File-backed append-only JSONL ledger.
 *
 * The file is created (with parent directories) on the first `append`.
 * Each append is one `appendFile` call, which the OS applies atomically
 * under O_APPEND. Reads re-validate every line — a corrupt ledger fails
 * loudly instead of silently poisoning the replay.
 */
export class Ledger {
  /** Absolute or relative path of the JSONL ledger file. */
  readonly path: string;

  /**
   * @param path - Path of the JSONL ledger file. Must be non-empty.
   */
  constructor(path: string) {
    if (typeof path !== 'string' || path.trim().length === 0) {
      throw new Error('Ledger: path must be a non-empty string');
    }
    this.path = path;
  }

  /**
   * Validates and atomically appends one event to the ledger.
   *
   * @param event - The event to record. Thrown on if invalid — nothing is written.
   */
  async append(event: LedgerEvent): Promise<void> {
    validateLedgerEvent(event);
    await mkdir(dirname(this.path), { recursive: true });
    await appendFile(this.path, `${JSON.stringify(event)}\n`, 'utf8');
  }

  /**
   * Reads and validates every event in the ledger, in file order.
   *
   * A missing file reads as an empty ledger. A corrupt line throws with
   * its line number.
   */
  readAll(): LedgerEvent[] {
    let text: string;
    try {
      text = readFileSync(this.path, 'utf8');
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === 'ENOENT') return [];
      throw err;
    }
    const events: LedgerEvent[] = [];
    const lines = text.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.length === 0) continue;
      let parsed: unknown;
      try {
        parsed = JSON.parse(line);
      } catch {
        throw new Error(`Ledger.readAll: corrupt JSON on line ${i + 1} of ${this.path}`);
      }
      validateLedgerEvent(parsed);
      events.push(parsed);
    }
    return events;
  }

  /**
   * All ledger events for one task, in file order.
   *
   * @param task - Task slug.
   */
  eventsFor(task: string): LedgerEvent[] {
    if (!isNonEmptyString(task)) {
      throw new Error('Ledger.eventsFor: task must be a non-empty string');
    }
    return this.readAll().filter((e) => e.task === task);
  }

  /**
   * Rebuilds every task's state machine from the ledger file.
   *
   * @returns Map from task slug to its {@link TaskReplay}.
   */
  replay(): Map<string, TaskReplay> {
    return replayEvents(this.readAll());
  }
}
