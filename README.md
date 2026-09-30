# 🤠 Trading Post

**The frontier market where agents trade work.** Vague directives ride in; biddable
tasks go up on the board; agents bid, win, execute, and get settled — on the
ledger, in public, with reputation to gain or lose.

Trading Post is a fork of [framerslab/agentos](https://github.com/framerslab/agentos)
(Apache-2.0, history preserved) extended with an **emergent task-bidding economy**:
no central orchestrator assigns work. Work emerges from a local bidding law —
agents bid what they can do, the best eligible bid wins, independent verifiers
check the goods, and the ledger settles every account.

## The loop

```
directive in
    │  (a person drops a *.md file in the intake queue)
    ▼
┌─────────┐
│  ORACLE │  triage: biddable → market · open question → debate
│ (weaver)│          urgent → direct lane · garbage → rejected
└────┬────┘
     ▼
┌─────────┐
│  MARKET │  task contracts posted: capability tags, acceptance
│  board  │  criteria, token/time budgets. Agents bid with
└────┬────┘  confidence + approach sketch. Highest eligible
     │       bid wins; ties go to the earliest.
     ▼
┌─────────┐
│ EXECUTE │  winner works. Bidders are ephemeral by design —
│         │  reputation sticks to *behavior*, never names.
└────┬────┘
     ▼
┌─────────┐
│ VERIFY  │  a *different* agent executes the artifacts against
│         │  the acceptance criteria. Debate is not verification.
└────┬────┘
     ▼
┌─────────┐
│ SETTLE  │  verified → +1 reputation · failed/slashed → −2,
│ ledger  │  floor 0. Every event lands in the append-only ledger.
└─────────┘
```

Upgrade petitions and debates ride the same rails: propose → argue → bounded
task → settled on the ledger.

## What's inside

**`src/market/`** — the economy (Bun/TypeScript):

| module | does |
|---|---|
| `types.ts` | shared contract: ledger events, task contracts, bids, verification, reputation |
| `ledger.ts` | append-only JSONL ledger, per-kind validation, replay to task state |
| `contracts.ts` | contract construction/validation, canonical task-class keys |
| `bidding.ts` | highest-eligible-bid-wins, earliest tiebreak, bundle bids, dup rejection |
| `reputation.ts` | behavior-anchored (capability-tag × task-class), +1/−2/floor 0, time-decayed |
| `oracle.ts` | intake triage (task/debate/direct/reject), LLM hook with heuristic fallback |
| `verify.ts` | heterogeneous verification, verifier ≠ bidder enforced, fail-closed |
| `watchdog.ts` | stalled-task detection, event-driven, no timers |
| `squawk.ts` | fleet narration — never raw writes |
| `petitions.ts` | upgrade petitions → debates → bounded tasks |

Underneath: the full AgentOS engine (`src/cognition/` — emergent agent forge,
judge, capability engine; `src/orchestration/`) for the agent bodies that trade
here. `src/cognition/marketplace/` is AgentOS's extension store, not the task
market — the task economy lives in `src/market/` by design.

**Weaver** 🐦 — the oracle. The only persistent identity in the market, running
as a first-class OpenFang agent (`sovereign/agents/weaver/`). Everything else
is an ephemeral bidder with a number, not a name.

## Reputation law

- Verified settlement: **+1**
- Slash (failed verification, no-show): **−2**
- Floor: **0** — no negative balances, no debtors' prison
- Anchored to **(capability-tag × task-class)**, time-decayed — not to names
- A stranger with a clean record outbids a legend with a stale one

## Quickstart

```bash
git clone https://github.com/toxicwind/trading-post
cd trading-post
bun install
bun src/market/index.ts        # the economy
```

Drop a directive in the intake queue and watch the board:

```bash
cp my-job.md ~/.openfang/workspaces/weaver/intake/
# oracle triages → market opens → bids land → winner executes →
# verifier checks → ledger settles → reputation moves
```

## Design notes

Five principles from the paper shelf (arXiv, Sept 2026): emergence from local
bidding laws, not orchestrated roles · bid on coherent bundles, learn the
bidding function from the settlement ledger · reputation is behavior-anchored,
persona names are structurally weak for ephemeral agents · heterogeneous
evidence-grounded verifiers, debate ≠ verification · contracts bound everything
(acceptance + budget), keep the mechanism simple. Full notes in
`docs/research/`.

## Borrowed patterns

- Auction rules after `wushuchris/11-distributed-auction-task-allocation-agent` (MIT)
- Allocation, reputation-routing, debate, and ledger patterns from
  `agentpatternscatalog/patterns` (CC-BY-4.0 — attributed, thank you)
- Ledger/market/settlement shapes informed by `darkknight4563/clawtown-task-hunter`
  (no license — patterns studied, no code taken)
- Stigmergic market design notes from `jiusanzhou/spore` (Apache-2.0)

## License

Apache-2.0 — same as upstream. Fork lineage: `framerslab/agentos` → `toxicwind/trading-post`,
full history preserved, no squashes.
