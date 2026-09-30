/**
 * @fileoverview Watchdog health analysis for the emergent task economy.
 *
 * Pure, event-driven: the caller feeds ledger events in; `analyze` computes
 * a health snapshot. No polling loops, no timers — the market loop calls
 * this whenever new events land (or whenever a supervisor asks).
 *
 * Stalled states:
 * - `task-open` with no `bid` after `openTimeoutMs` (default 30 min) → the
 *   market is ignoring a task.
 * - `assign` with no `result` after the contract deadline or
 *   `assignTimeoutMs` (default 2 h) → the winner went quiet.
 *
 * @module agentos/market/watchdog
 */

import type { LedgerEvent, WatchdogReport } from './types.js';

/** Options for stalled-task analysis. */
export interface AnalyzeOpts {
  /** task-open with no bid after this is stalled. Default 30 min. */
  openTimeoutMs?: number;
  /** assign with no result after this (absent an earlier deadline) is stalled. Default 2 h. */
  assignTimeoutMs?: number;
  /** Optional per-task contract deadlines (ISO-8601) — beat assignTimeoutMs when earlier. */
  deadlines?: Record<string, string>;
  /** Bidders known alive at analysis time. */
  aliveBidders: string[];
  /** ISO-8601 now override (tests). Defaults to `new Date()`. */
  nowTs?: string;
}

const DEFAULT_OPEN_TIMEOUT_MS = 30 * 60 * 1000;
const DEFAULT_ASSIGN_TIMEOUT_MS = 2 * 60 * 60 * 1000;

/** One stalled task. */
export interface StalledTask {
  task: string;
  state: 'awaiting-bid' | 'awaiting-result';
  since: string;
}

interface TaskState {
  openTs: string | null;
  hasBid: boolean;
  lastAssignTs: string | null;
  hasResultAfterAssign: boolean;
  settled: boolean;
}

function blankState(): TaskState {
  return {
    openTs: null,
    hasBid: false,
    lastAssignTs: null,
    hasResultAfterAssign: false,
    settled: false,
  };
}

/**
 * Find stalled tasks in a ledger snapshot. Pure function.
 *
 * @param ledger Ledger events (any order; sorted internally by `ts`).
 * @param opts Timeouts, deadlines, and now override.
 * @returns Stalled tasks with the state they stalled in and since-when.
 */
export function stalledTasks(ledger: LedgerEvent[], opts: AnalyzeOpts): StalledTask[] {
  const openTimeout = opts.openTimeoutMs ?? DEFAULT_OPEN_TIMEOUT_MS;
  const assignTimeout = opts.assignTimeoutMs ?? DEFAULT_ASSIGN_TIMEOUT_MS;
  const now = opts.nowTs ? Date.parse(opts.nowTs) : Date.now();

  const byTask = new Map<string, TaskState>();
  const sorted = [...ledger].sort((a, b) => Date.parse(a.ts) - Date.parse(b.ts));

  for (const ev of sorted) {
    if (!ev.task) continue;
    let st = byTask.get(ev.task);
    if (!st) {
      st = blankState();
      byTask.set(ev.task, st);
    }
    switch (ev.ev) {
      case 'task-open':
        st.openTs = ev.ts;
        st.hasBid = false;
        st.lastAssignTs = null;
        st.hasResultAfterAssign = false;
        st.settled = false;
        break;
      case 'bid':
        st.hasBid = true;
        break;
      case 'assign':
        st.lastAssignTs = ev.ts;
        st.hasResultAfterAssign = false;
        break;
      case 'result':
        if (st.lastAssignTs) st.hasResultAfterAssign = true;
        break;
      case 'settle':
      case 'slash':
        st.settled = true;
        break;
      default:
        break;
    }
  }

  const stalled: StalledTask[] = [];
  for (const [task, st] of byTask) {
    if (st.settled) continue;

    // An assign means the market moved past bidding even if no bid line
    // was recorded — skip the awaiting-bid stall in that case.
    if (st.openTs && !st.hasBid && !st.lastAssignTs) {
      if (now - Date.parse(st.openTs) > openTimeout) {
        stalled.push({ task, state: 'awaiting-bid', since: st.openTs });
        continue;
      }
    }

    if (st.lastAssignTs && !st.hasResultAfterAssign) {
      const deadline = opts.deadlines?.[task];
      const cutoff =
        deadline && !Number.isNaN(Date.parse(deadline))
          ? Math.min(Date.parse(deadline), Date.parse(st.lastAssignTs) + assignTimeout)
          : Date.parse(st.lastAssignTs) + assignTimeout;
      if (now > cutoff) {
        stalled.push({ task, state: 'awaiting-result', since: st.lastAssignTs });
      }
    }
  }
  return stalled;
}

/**
 * Analyze a ledger snapshot into a watchdog health report. Pure function —
 * the caller feeds ledger events; nothing in here polls or loops.
 *
 * @param ledger Ledger events to analyze.
 * @param opts Timeouts, alive bidders, deadlines, now override.
 * @returns WatchdogReport with stalled tasks, ledger size, and alerts.
 */
export function analyze(ledger: LedgerEvent[], opts: AnalyzeOpts): WatchdogReport {
  const stalled = stalledTasks(ledger, opts);
  const now = opts.nowTs ?? new Date().toISOString();

  const alerts: string[] = [];
  for (const s of stalled) {
    alerts.push(
      `stalled task "${s.task}" in state ${s.state} since ${s.since}`,
    );
  }

  return {
    ts: now,
    aliveBidders: opts.aliveBidders,
    stalledTasks: stalled,
    ledgerLines: ledger.length,
    alerts,
  };
}
