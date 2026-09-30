/**
 * @fileoverview Behavior-anchored reputation for the market.
 *
 * Reputation is keyed by (capability-tag × task-class) — NEVER by bidder
 * name, because bidders are ephemeral instances with no persistent identity
 * to sanction. Each entry carries ledger-verified evidence `{task, ts,
 * delta}` so every point is traceable to a settlement.
 *
 * Convention: a verified settle applies +1, a slash applies −2, and the
 * score floors at 0. Scores decay exponentially with a configurable
 * half-life; evidence older than ~4 half-lives is pruned.
 *
 * @module agentos/market/reputation
 */

import type { ReputationEntry, TaskContract } from './types.js';
import { taskClass as buildTaskClass } from './contracts.js';

/** Evidence with weight below 2^-4 (older than ~4 half-lives) is pruned. */
const PRUNE_WEIGHT = 2 ** -4;

/** Normalizes and validates a capability tag. */
function normTag(tag: string): string {
  if (typeof tag !== 'string' || tag.trim().length === 0) {
    throw new Error('reputation: tag must be a non-empty string');
  }
  return tag.trim().toLowerCase();
}

/** Validates a task-class key. */
function normClass(taskClass: string): string {
  if (typeof taskClass !== 'string' || taskClass.trim().length === 0) {
    throw new Error('reputation: taskClass must be a non-empty string');
  }
  return taskClass.trim();
}

function findEntry(
  entries: ReputationEntry[],
  tag: string,
  taskClass: string,
): ReputationEntry | undefined {
  return entries.find((e) => e && e.tag === tag && e.taskClass === taskClass);
}

/**
 * Derives the canonical task class for a contract from its tags,
 * via `taskClass` in contracts.ts. Throws when the contract has no
 * usable tags.
 *
 * @param contract - The task contract.
 * @returns The canonical class key, e.g. `"git+ops"`.
 */
export function taskClassFor(contract: TaskContract): string {
  if (!contract || typeof contract !== 'object' || !Array.isArray(contract.tags)) {
    throw new TypeError('taskClassFor: contract with a tags[] array is required');
  }
  return buildTaskClass(contract.tags);
}

/**
 * Current score for a (tag, task-class) pair. Unknown pairs score 0 —
 * no history, no credit.
 *
 * @param entries - The reputation table.
 * @param tag - Capability tag.
 * @param taskClass - Canonical task-class key.
 * @returns The score, floored at 0; 0 when unknown.
 */
export function getScore(entries: ReputationEntry[], tag: string, taskClass: string): number {
  if (!Array.isArray(entries)) {
    throw new TypeError('getScore: entries must be an array');
  }
  const e = findEntry(entries, normTag(tag), normClass(taskClass));
  if (!e || !Number.isFinite(e.score)) return 0;
  return Math.max(0, e.score);
}

/**
 * Applies a reputation delta to a (tag, task-class) pair and appends
 * ledger-verified evidence `{task, ts, delta}`. Creates the entry on
 * first use. Convention: +1 for a verified settle, −2 for a slash.
 * The score floors at 0 — it can never go negative.
 *
 * @param entries - The reputation table (mutated in place).
 * @param tag - Capability tag.
 * @param taskClass - Canonical task-class key.
 * @param task - Settled task slug backing this delta.
 * @param delta - Reputation delta; must be finite.
 * @param ts - Parseable timestamp of the settlement.
 * @returns The updated entry.
 */
export function applyDelta(
  entries: ReputationEntry[],
  tag: string,
  taskClass: string,
  task: string,
  delta: number,
  ts: string,
): ReputationEntry {
  if (!Array.isArray(entries)) {
    throw new TypeError('applyDelta: entries must be an array');
  }
  const t = normTag(tag);
  const c = normClass(taskClass);
  if (typeof task !== 'string' || task.trim().length === 0) {
    throw new Error('applyDelta: task must be a non-empty string');
  }
  if (typeof delta !== 'number' || !Number.isFinite(delta)) {
    throw new Error('applyDelta: delta must be a finite number');
  }
  if (typeof ts !== 'string' || Number.isNaN(Date.parse(ts))) {
    throw new Error('applyDelta: ts must be a parseable date-time string');
  }

  let e = findEntry(entries, t, c);
  if (!e) {
    e = { tag: t, taskClass: c, score: 0, evidence: [], updatedAt: ts };
    entries.push(e);
  }
  e.evidence.push({ task: task.trim(), ts, delta });
  e.score = Math.max(0, (Number.isFinite(e.score) ? e.score : 0) + delta);
  e.updatedAt = ts;
  return e;
}

/**
 * Applies exponential time-decay to every entry's score and prunes
 * evidence older than ~4 half-lives (weight < 2^-4).
 *
 * The score is recomputed as the time-weighted sum of evidence deltas:
 * `Σ deltaᵢ · 2^(−ageᵢ / halfLife)`, floored at 0. Future-dated evidence
 * is clamped to weight 1 rather than inflating the score. Corrupt
 * evidence (unparseable timestamp, non-finite delta) throws — decay must
 * never silently launder the ledger.
 *
 * @param entries - The reputation table (mutated in place).
 * @param nowTs - Reference timestamp ("now"), parseable.
 * @param halfLifeDays - Evidence half-life in days. Defaults to 30.
 * @returns The same `entries` array, decayed.
 */
export function decay(
  entries: ReputationEntry[],
  nowTs: string,
  halfLifeDays = 30,
): ReputationEntry[] {
  if (!Array.isArray(entries)) {
    throw new TypeError('decay: entries must be an array');
  }
  if (typeof nowTs !== 'string' || Number.isNaN(Date.parse(nowTs))) {
    throw new Error('decay: nowTs must be a parseable date-time string');
  }
  if (typeof halfLifeDays !== 'number' || !Number.isFinite(halfLifeDays) || halfLifeDays <= 0) {
    throw new Error('decay: halfLifeDays must be a finite number > 0');
  }

  const now = Date.parse(nowTs);
  const halfLifeMs = halfLifeDays * 24 * 60 * 60 * 1000;

  for (const e of entries) {
    if (!e || !Array.isArray(e.evidence)) {
      throw new Error('decay: corrupt reputation entry — evidence must be an array');
    }
    let total = 0;
    const kept: { task: string; ts: string; delta: number }[] = [];
    for (const ev of e.evidence) {
      const t = Date.parse(ev.ts);
      if (Number.isNaN(t)) {
        throw new Error(
          `decay: corrupt evidence timestamp ${JSON.stringify(ev.ts)} for task ${JSON.stringify(ev.task)}`,
        );
      }
      if (typeof ev.delta !== 'number' || !Number.isFinite(ev.delta)) {
        throw new Error(`decay: corrupt evidence delta for task ${JSON.stringify(ev.task)}`);
      }
      const ageMs = Math.max(0, now - t); // clamp future-dated evidence to weight 1
      const weight = 2 ** -(ageMs / halfLifeMs);
      if (weight >= PRUNE_WEIGHT) {
        kept.push(ev);
        total += ev.delta * weight;
      }
    }
    e.evidence = kept;
    e.score = Math.max(0, total);
    e.updatedAt = nowTs;
  }
  return entries;
}
