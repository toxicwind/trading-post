/**
 * @fileoverview One-shot migration: 2026-09-20 emergent-tasking prototype
 * ledger (~/. workspace) → src/market JSONL ledger.
 *
 * Maps legacy event shapes to the current ledger schema:
 *  - `settle.rep_delta` → `repDelta`
 *  - `reassign` → `assign` (bidder = to, note = reason)
 *  - `note` → skipped (annotation, not a state transition)
 * Extra legacy fields are preserved (the ledger allows extras).
 * Every migrated event is validated with validateLedgerEvent before write.
 *
 * Also builds a behavior-anchored reputation seed from settle events:
 * for each settle, each bidder tag (from bidders.json) × task class
 * gets the settle's delta applied.
 *
 * Usage:
 *   bun scripts/migrate-prototype-ledger.ts <old-ledger.jsonl> <bidders.json> <out-ledger.jsonl> <out-reputation.json>
 *
 * @module agentos/market/migrate-prototype-ledger
 */

import { validateLedgerEvent, type LedgerEvent } from '../src/market/ledger.js';
import { taskClass } from '../src/market/contracts.js';
import { applyDelta, type ReputationEntry } from '../src/market/reputation.js';

const [oldLedgerPath, biddersPath, outLedgerPath, outReputationPath] = Bun.argv.slice(2);
if (!oldLedgerPath || !biddersPath || !outLedgerPath || !outReputationPath) {
  console.error('usage: bun scripts/migrate-prototype-ledger.ts <old-ledger.jsonl> <bidders.json> <out-ledger.jsonl> <out-reputation.json>');
  process.exit(1);
}

const biddersRaw = await Bun.file(biddersPath).json() as {
  bidders: Record<string, number | { rep: number; tags: string[] }>;
};
const bidderTags = new Map<string, string[]>();
for (const [name, v] of Object.entries(biddersRaw.bidders)) {
  bidderTags.set(name, typeof v === 'number' ? [] : (v.tags ?? []));
}

// task slug → tags (from task-open events, for reputation seeding)
const taskTags = new Map<string, string[]>();

let migrated = 0, skipped = 0;
const failures: string[] = [];
const outLines: string[] = [];

const rawLines = (await Bun.file(oldLedgerPath).text()).split('\n').filter(l => l.trim());
for (const [i, line] of rawLines.entries()) {
  let e: Record<string, unknown>;
  try { e = JSON.parse(line); } catch { failures.push(`line ${i}: not JSON`); continue; }

  if (e.ev === 'note') { skipped++; continue; } // annotation, not a transition

  if (e.ev === 'reassign') {
    e = { ev: 'assign', task: e.task, ts: e.ts, bidder: e.to, note: `reassign: ${e.from} → ${e.to}: ${e.reason}` };
  }
  if (e.ev === 'settle' && typeof e.rep_delta === 'number') {
    e.repDelta = e.rep_delta;
    delete e.rep_delta;
  }
  if (e.ev === 'bid' && (typeof e.approach !== 'string' || !e.approach.trim())) {
    // 2026-09-20 prototype did not always record the approach sketch.
    // Backfill with explicit provenance rather than dropping bid history.
    e.approach = '[approach not recorded in 2026-09-20 prototype]';
  }
  if (e.ev === 'task-open' && Array.isArray(e.tags)) {
    taskTags.set(String(e.task), (e.tags as unknown[]).map(String));
  }

  try {
    validateLedgerEvent(e);
  } catch (err) {
    failures.push(`line ${i} (${e.ev}/${e.task}): ${(err as Error).message}`);
    continue;
  }
  outLines.push(JSON.stringify(e as LedgerEvent));
  migrated++;
}

await Bun.write(outLedgerPath, outLines.join('\n') + '\n');

// Reputation seed: settle events × bidder tags × task class
let repEntries: ReputationEntry[] = [];
const seen = new Map<string, ReputationEntry>();
for (const line of outLines) {
  const e = JSON.parse(line) as LedgerEvent;
  if (e.ev !== 'settle') continue;
  const bidder = String(e.bidder);
  const cls = taskClass(taskTags.get(String(e.task)) ?? []);
  for (const tag of bidderTags.get(bidder) ?? []) {
    const key = `${tag}×${cls}`;
    const updated = applyDelta([...seen.values()], tag, cls, String(e.task), Number(e.repDelta), String(e.ts));
    seen.set(key, updated);
  }
}
repEntries = [...seen.values()];
await Bun.write(outReputationPath, JSON.stringify(repEntries, null, 2) + '\n');

console.log(`migrated: ${migrated}, skipped (notes): ${skipped}, failed: ${failures.length}`);
for (const f of failures) console.log('FAIL:', f);
console.log(`reputation entries seeded: ${repEntries.length}`);
