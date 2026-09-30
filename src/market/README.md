# src/market — the emergent task economy

A task-bidding economy for self-organizing agent swarms. **Not** the extension
store in `src/cognition/marketplace/` (which publishes agents/personas/workflows
like an app store) — this is the market where *work* gets priced, assigned,
verified, and settled.

## The loop

```
intake (oracle) → market ledger → bidding → execution → verification → settlement
                     ↑                                                      ↓
              governance (petitions → debates → approved upgrades become tasks)
                     ↑                                                      ↓
                        watchdog (liveness, stalled tasks, ledger growth)
```

Every lifecycle event appends one JSON line to the ledger:
`task-open, bid, assign, result, verify, settle | slash, debate, petition`.

## Roles

- **oracle** — persistent identity. Triages intake: biddable work → market
  tasks (capability tags + acceptance criteria); open questions → debates;
  urgent → direct assignment; garbage → rejected with reason. Chairs debates,
  settles tasks. (The OpenFang agent in this repo's deployment.)
- **bidders** — ephemeral instances. Bid with confidence (0..1) + a one-line
  approach sketch; winner executes, narrates, writes artifacts, posts result.
  Bidders choose their own method; the task contract is the law.
- **watchdog** — supervision with a persona, not just a liveness ping:
  bidder activity, stalled tasks, ledger growth, statistical
  self-organization signatures.

## Five design principles (arXiv, Sept 2026)

1. **Emergence from local laws, not orchestrated roles.** Every bidder runs
   the same local bidding law (tags + load + behavioral score); allocation
   structure emerges. (Waggle, 2609.34136)
2. **Bid on coherent bundles; learn the bidding function.** Single-task
   greedy leaves ~15% on the table. Bidders claim task groups sharing
   context; the confidence function trains against the settlement ledger
   (centralized training, decentralized execution). (GACA, 2608.15884)
3. **Reputation is behavior-anchored, not identity-anchored.** Bidders are
   ephemeral — name-based reputation is structurally unsound. Score
   (capability-tag × task-class) pairs with time-decayed, ledger-verified
   evidence. (DART, 2609.05529; Dissociative Identity, 2605.30169)
4. **Heterogeneous, evidence-grounded verification; debate ≠ verification.**
   Verifier differs in agent class from executor and *executes* artifacts
   against acceptance criteria. Governance debates use structured
   argumentation, not vibes. (Post-hoc Debate Judgement, 2608.19002)
5. **Contracts bound everything; keep the mechanism simple.** Every
   assignment carries acceptance criteria + token/time budget + temporal
   bounds. Highest-eligible-bid-wins is provably near-optimal; Vickrey/
   sealed variants reserved for adversarial settings. (Agent Contracts,
   2601.08815; Simple Mechanisms, 2609.37997)

## Modules

| File | Owns |
|---|---|
| `types.ts` | Shared types — the contract every module builds against |
| `ledger.ts` | JSONL append-only ledger, event validation, replay |
| `contracts.ts` | Task contract construction + validation |
| `bidding.ts` | Bid placement, eligibility, highest-wins + earliest-tiebreak, bundles |
| `reputation.ts` | Behavior-anchored scoring, +1/−2/floor 0, time decay |
| `oracle.ts` | Intake triage → task / debate / direct / reject |
| `verify.ts` | Heterogeneous verification harness (executes artifacts) |
| `watchdog.ts` | Liveness, stalled tasks, ledger growth (event-driven) |
| `squawk.ts` | Fleet narration via fleet-post (never raw writes) |
| `petitions.ts` | Upgrade petitions → debates → approved upgrades become tasks |
| `index.ts` | Barrel export |

## Wiring into agentos

- `verify.ts` extends the **EmergentAgentJudge** pattern (LLM-as-judge with
  fail-closed defaults) for the judgement half of verification — but the
  evidence half always executes artifacts for real.
- `petitions.ts` produces bounded change proposals shaped to fit
  **SelfImprovementConfig** (personality/skills/workflows/self-evaluation
  budgets) so approved self-modification stays within configured limits.
- The extension store (`src/cognition/marketplace/`) is untouched.

## Attributions

- Auction/bidding rules adapted from `wushuchris/11-distributed-auction-task-allocation-agent` (MIT).
- Pattern docs consulted from `agentpatternscatalog/patterns` (CC-BY-4.0):
  vickrey-auction-allocation, trust-and-reputation-routing, debate,
  coalition-formation, voting-based-cooperation, confidence-reporting,
  stigmergic-coordination, execution-state-ledger, blackboard.
- Ledger lifecycle informed by `clawtown-task-hunter` patterns (no license —
  patterns only, no code copied).
