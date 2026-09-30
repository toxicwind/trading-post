/**
 * @fileoverview Bid placement, eligibility, winner selection, and bundles.
 *
 * The market's allocation law stays simple on purpose: highest eligible bid
 * wins; ties break on earliest timestamp (then bidder name, for
 * determinism). A bid is eligible when it targets the contract's task, the
 * bidder's capability tags overlap the contract's tags, confidence is a
 * number in [0, 1], and the approach sketch is non-empty.
 *
 * Bundle bids claim coherent task groups: every bid carrying the same
 * `bundle` id is grouped together by {@link groupByBundle}.
 *
 * @module agentos/market/bidding
 */

import type { Bid, TaskContract } from './types.js';

/**
 * Returns every eligibility problem for a bid against a contract.
 * Pure — never throws on a malformed bid, it just reports.
 *
 * @param bid - The bid to check.
 * @param contract - The contract it bids on.
 * @returns List of human-readable problems; empty when eligible.
 */
export function bidProblems(bid: Bid, contract: TaskContract): string[] {
  const problems: string[] = [];
  if (!bid || typeof bid !== 'object') return ['bid must be an object'];
  if (!contract || typeof contract !== 'object') return ['contract must be an object'];

  if (bid.task !== contract.task) {
    problems.push(
      `bid.task ${JSON.stringify(bid.task)} does not match contract.task ${JSON.stringify(contract.task)}`,
    );
  }
  if (typeof bid.bidder !== 'string' || bid.bidder.trim().length === 0) {
    problems.push('bidder must be a non-empty string');
  }
  if (
    typeof bid.confidence !== 'number' ||
    !Number.isFinite(bid.confidence) ||
    bid.confidence < 0 ||
    bid.confidence > 1
  ) {
    problems.push('confidence must be a finite number in [0, 1]');
  }
  if (typeof bid.approach !== 'string' || bid.approach.trim().length === 0) {
    problems.push('approach must be a non-empty one-line sketch');
  }
  if (typeof bid.ts !== 'string' || Number.isNaN(Date.parse(bid.ts))) {
    problems.push('ts must be a parseable date-time string');
  }
  if (!Array.isArray(bid.tags)) {
    problems.push('bid.tags must be an array');
  }
  if (!Array.isArray(contract.tags)) {
    problems.push('contract.tags must be an array');
  } else if (Array.isArray(bid.tags)) {
    const have = new Set(
      bid.tags.filter((t): t is string => typeof t === 'string').map((t) => t.trim().toLowerCase()),
    );
    const overlap = contract.tags.filter(
      (t) => typeof t === 'string' && have.has(t.trim().toLowerCase()),
    );
    if (overlap.length === 0) {
      problems.push(
        `no capability overlap: bidder tags [${bid.tags.join(', ')}] vs contract tags [${contract.tags.join(', ')}]`,
      );
    }
  }
  return problems;
}

/**
 * True when a bid is eligible against a contract. Pure; never throws.
 *
 * @param bid - The bid to check.
 * @param contract - The contract it bids on.
 */
export function isEligible(bid: Bid, contract: TaskContract): boolean {
  return bidProblems(bid, contract).length === 0;
}

/**
 * Validates a bid against the contract and records it on the bid list.
 *
 * Rejects (throws) on any eligibility problem — task mismatch, empty tag
 * overlap, confidence outside [0, 1], empty approach, bad timestamp — and
 * on an exact duplicate (same bidder, task, and ts already listed).
 *
 * @param bids - The task's bid list. The accepted bid is pushed onto it.
 * @param bid - The bid to place.
 * @param contract - The contract being bid on.
 * @returns The placed bid.
 * @throws {TypeError} When `bids` is not an array.
 * @throws {Error} When the bid is ineligible or a duplicate.
 */
export function placeBid(bids: Bid[], bid: Bid, contract: TaskContract): Bid {
  if (!Array.isArray(bids)) {
    throw new TypeError('placeBid: bids must be an array');
  }
  const problems = bidProblems(bid, contract);
  if (problems.length > 0) {
    throw new Error(`placeBid: bid rejected — ${problems.join('; ')}`);
  }
  if (bids.some((b) => b && b.bidder === bid.bidder && b.task === bid.task && b.ts === bid.ts)) {
    throw new Error(`placeBid: duplicate bid from ${bid.bidder} on ${bid.task} at ${bid.ts}`);
  }
  bids.push(bid);
  return bid;
}

/**
 * Filters a bid list down to the bids eligible against the contract.
 * Malformed bids are dropped, not reported — use {@link bidProblems}
 * when the reasons matter.
 *
 * @param bids - Candidate bids.
 * @param contract - The contract they bid on.
 */
export function eligibleBidders(bids: Bid[], contract: TaskContract): Bid[] {
  if (!Array.isArray(bids)) {
    throw new TypeError('eligibleBidders: bids must be an array');
  }
  if (!contract || typeof contract !== 'object') {
    throw new TypeError('eligibleBidders: contract must be an object');
  }
  return bids.filter((b) => isEligible(b, contract));
}

/**
 * Selects the winning bid: highest confidence wins; ties break on the
 * earliest `ts`; a residual tie breaks on bidder name so the result is
 * deterministic. Does not mutate the input. Filter through
 * {@link eligibleBidders} first when only eligible bids may win.
 *
 * @param bids - Candidate bids.
 * @returns The winning bid, or `null` when the list is empty.
 * @throws {TypeError} When `bids` is not an array.
 */
export function winningBid(bids: Bid[]): Bid | null {
  if (!Array.isArray(bids)) {
    throw new TypeError('winningBid: bids must be an array');
  }
  if (bids.length === 0) return null;
  let best = bids[0];
  for (const b of bids.slice(1)) {
    if (b.confidence > best.confidence) {
      best = b;
    } else if (b.confidence === best.confidence) {
      const bt = Date.parse(b.ts);
      const bestT = Date.parse(best.ts);
      if (bt < bestT || (bt === bestT && b.bidder < best.bidder)) {
        best = b;
      }
    }
  }
  return best;
}

/**
 * Groups bundle-claiming bids by their bundle id. A bid with a `bundle`
 * claims every task sharing that bundle id; bids without a bundle are
 * skipped (they bid on singles, not bundles).
 *
 * @param bids - Bids, possibly spanning several bundles.
 * @returns Map from bundle id to the bids claiming it.
 * @throws {TypeError} When `bids` is not an array.
 */
export function groupByBundle(bids: Bid[]): Map<string, Bid[]> {
  if (!Array.isArray(bids)) {
    throw new TypeError('groupByBundle: bids must be an array');
  }
  const groups = new Map<string, Bid[]>();
  for (const bid of bids) {
    if (!bid || typeof bid.bundle !== 'string' || bid.bundle.trim().length === 0) continue;
    const key = bid.bundle.trim();
    const list = groups.get(key);
    if (list) list.push(bid);
    else groups.set(key, [bid]);
  }
  return groups;
}
