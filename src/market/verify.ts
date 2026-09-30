/**
 * @fileoverview Heterogeneous verification harness for the emergent task economy.
 *
 * Verification is evidence-grounded, not vibes: every acceptance criterion
 * on the contract is run through a real check (executes artifacts,
 * observes behavior). The verifier MUST differ from the bidder —
 * heterogeneous by construction, enforced with a throw. A pass requires
 * ALL criteria to pass.
 *
 * Also ships `llmJudgeCheck`, an LLM-as-judge check factory in the
 * EmergentAgentJudge style: judgement only, fail-closed — any LLM error
 * yields {pass:false}.
 *
 * @module agentos/market/verify
 */

import type { TaskContract, TaskResult, Verification } from './types.js';
import type { GenerateText } from './oracle.js';

/** A real check for one acceptance criterion. Executes, observes. */
export type CriterionCheck = (
  criterion: string,
) => Promise<{ pass: boolean; note: string }>;

/** Per-criterion outcome recorded in the verification note. */
export interface CriterionOutcome {
  criterion: string;
  pass: boolean;
  note: string;
}

/**
 * Verify a task result against its contract.
 *
 * @param contract The contract: `accept` criteria are the law.
 * @param result What the bidder produced.
 * @param checks Map from criterion string → real check. Missing checks
 *   fail the criterion closed (fail-closed: unverifiable != verified).
 * @param verifier Name of the verifying agent/class.
 * @returns Verification with a note recording what was executed and observed.
 * @throws When verifier === bidder (heterogeneity is structural, not advisory).
 */
export async function verifyResult(
  contract: TaskContract,
  result: TaskResult,
  checks: Map<string, CriterionCheck>,
  verifier: string,
): Promise<Verification> {
  if (verifier === result.bidder) {
    throw new Error(
      `heterogeneous verification violated: verifier "${verifier}" is the bidder for task "${contract.task}"`,
    );
  }

  const outcomes: CriterionOutcome[] = [];
  for (const criterion of contract.accept) {
    const check = checks.get(criterion);
    if (!check) {
      outcomes.push({
        criterion,
        pass: false,
        note: `no check registered for criterion — fail-closed`,
      });
      continue;
    }
    try {
      const { pass, note } = await check(criterion);
      outcomes.push({ criterion, pass, note });
    } catch (err) {
      outcomes.push({
        criterion,
        pass: false,
        note: `check threw: ${err instanceof Error ? err.message : String(err)}`,
      });
    }
  }

  const pass = outcomes.length > 0 && outcomes.every((o) => o.pass);
  const executed = outcomes
    .map(
      (o) =>
        `- [${o.pass ? 'PASS' : 'FAIL'}] ${o.criterion}\n  observed: ${o.note}`,
    )
    .join('\n');

  return {
    task: contract.task,
    verifier,
    pass,
    note: [
      `executed ${outcomes.length} acceptance criterion check(s) for task "${contract.task}" (bidder: ${result.bidder})`,
      `artifacts under test: ${result.artifacts.join(', ') || '(none)'}`,
      executed,
    ].join('\n'),
    ts: new Date().toISOString(),
  };
}

/** LLM judge config: reuse the oracle's injected text hook shape. */

/**
 * Build an LLM-as-judge check for a single acceptance criterion, in the
 * EmergentAgentJudge style: the model reads the criterion and the bidder's
 * evidence and renders a pass/fail judgement as JSON.
 *
 * Fail-closed: ANY LLM error, empty output, or unparseable judgement yields
 * {pass:false}. The judge never accepts on vibes — it judges evidence.
 *
 * @param generateText LLM hook `(prompt) => text`.
 * @param evidenceFn Maps a criterion → the evidence text the judge reads
 *   (e.g. the bidder's `TaskResult.evidence` plus relevant excerpts).
 */
export function llmJudgeCheck(
  generateText: GenerateText,
  evidenceFn: (criterion: string) => string,
): CriterionCheck {
  return async (criterion: string) => {
    try {
      const prompt = [
        'You are an evidence-grounded judge. Decide whether the acceptance',
        'criterion below is met by the evidence. Reply with ONLY this JSON:',
        '{"pass": true|false, "note": "..."}',
        '',
        `CRITERION: ${criterion}`,
        '',
        'EVIDENCE:',
        evidenceFn(criterion),
      ].join('\n');

      const text = await generateText(prompt);
      const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      const parsed = JSON.parse((fenced ? fenced[1] : text).trim()) as {
        pass?: unknown;
        note?: unknown;
      };
      if (typeof parsed.pass !== 'boolean') {
        return { pass: false, note: 'judge output lacked a boolean pass field' };
      }
      return {
        pass: parsed.pass,
        note: `llm-judge: ${typeof parsed.note === 'string' ? parsed.note : '(no note)'}`,
      };
    } catch (err) {
      // Fail-closed: any LLM failure is a failed judgement, never a pass.
      return {
        pass: false,
        note: `llm-judge error: ${err instanceof Error ? err.message : String(err)}`,
      };
    }
  };
}
