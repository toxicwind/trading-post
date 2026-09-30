/**
 * @fileoverview Task contract construction and validation.
 *
 * The contract is the law: acceptance criteria, capability tags, resource
 * bounds, and priority. `buildContract` fills defaults and slugifies the
 * task name, then validates — anything invalid throws with the exact
 * reasons, never with a silently patched-up contract.
 *
 * @module agentos/market/contracts
 */

import type { TaskContract, TaskPriority } from './types.js';

/** Priorities the market understands. */
export const TASK_PRIORITIES: readonly TaskPriority[] = ['low', 'normal', 'high', 'urgent'];

/**
 * A draft contract: everything optional except a human-readable name.
 * `buildContract` fills defaults and validates the rest.
 */
export interface ContractDraft {
  /** Human-readable name, e.g. "Verify Oracle Build". */
  name?: string;
  /** Explicit slug; slugified again (idempotent) when present. Takes precedence over `name`. */
  task?: string;
  /** What done looks like, in plain words. Required. */
  goal?: string;
  /** Capability tags bidders match against. Required, non-empty. */
  tags?: string[];
  /** Acceptance criteria: observable, behavior-level. Required, non-empty. */
  accept?: string[];
  /** Where artifacts land. Required. */
  workdir?: string;
  /** Defaults to `'normal'`. */
  priority?: TaskPriority;
  /** Resource bounds. Optional; validated only when present. */
  budget?: { maxTokens?: number; maxSeconds?: number; deadline?: string };
  /** Bundle id for coherent task groups. Optional. */
  bundle?: string;
}

/**
 * Slugifies a human-readable name: lowercase, non-alphanumeric runs become
 * dashes, leading/trailing dashes trimmed. `verify-oracle-build`.
 *
 * @param name - Human-readable name.
 * @returns The slug.
 * @throws {TypeError} When `name` is not a string.
 * @throws {Error} When `name` contains no slugable characters.
 */
export function slugify(name: string): string {
  if (typeof name !== 'string') {
    throw new TypeError('slugify: name must be a string');
  }
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (slug.length === 0) {
    throw new Error('slugify: name produced an empty slug — provide at least one alphanumeric character');
  }
  return slug;
}

/**
 * Canonical class key for a set of capability tags: lowercased, trimmed,
 * deduplicated, sorted, joined with `+`. E.g. `["ops","git"]` → `"git+ops"`.
 * Used as the behavior-anchored reputation key, never the bidder's name.
 *
 * @param tags - Capability tags.
 * @returns The canonical class key.
 * @throws {TypeError} When `tags` is not an array.
 * @throws {Error} When no usable tags remain after normalization.
 */
export function taskClass(tags: string[]): string {
  if (!Array.isArray(tags)) {
    throw new TypeError('taskClass: tags must be an array');
  }
  const norm = [...new Set(tags.map((t) => String(t).trim().toLowerCase()).filter((t) => t.length > 0))].sort();
  if (norm.length === 0) {
    throw new Error('taskClass: at least one non-empty tag is required');
  }
  return norm.join('+');
}

/**
 * Checks a contract and returns every problem found. Pure — never throws
 * on a malformed contract, it just reports.
 *
 * @param c - The contract to check.
 * @returns List of human-readable problems; empty when valid.
 */
export function validateContract(c: TaskContract): string[] {
  const problems: string[] = [];
  if (!c || typeof c !== 'object') return ['contract must be an object'];

  if (typeof c.task !== 'string' || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(c.task)) {
    problems.push('task must be a slug: lowercase alphanumerics separated by single dashes');
  }
  if (typeof c.goal !== 'string' || c.goal.trim().length === 0) {
    problems.push('goal must be a non-empty string');
  }
  if (!Array.isArray(c.tags) || c.tags.length === 0 || c.tags.some((t) => typeof t !== 'string' || t.trim().length === 0)) {
    problems.push('tags must be a non-empty array of non-empty strings');
  }
  if (
    !Array.isArray(c.accept) ||
    c.accept.length === 0 ||
    c.accept.some((a) => typeof a !== 'string' || a.trim().length === 0)
  ) {
    problems.push('accept must be a non-empty array of non-empty acceptance criteria');
  }
  if (typeof c.workdir !== 'string' || c.workdir.trim().length === 0) {
    problems.push('workdir must be a non-empty string');
  }
  if (!(TASK_PRIORITIES as readonly string[]).includes(c.priority)) {
    problems.push(`priority must be one of ${TASK_PRIORITIES.join(', ')}`);
  }

  if (c.budget !== undefined) {
    if (!c.budget || typeof c.budget !== 'object') {
      problems.push('budget must be an object when present');
    } else {
      const { maxTokens, maxSeconds, deadline } = c.budget;
      if (maxTokens !== undefined && !(typeof maxTokens === 'number' && Number.isFinite(maxTokens) && maxTokens > 0)) {
        problems.push('budget.maxTokens must be a finite number > 0 when present');
      }
      if (maxSeconds !== undefined && !(typeof maxSeconds === 'number' && Number.isFinite(maxSeconds) && maxSeconds > 0)) {
        problems.push('budget.maxSeconds must be a finite number > 0 when present');
      }
      if (deadline !== undefined && (typeof deadline !== 'string' || Number.isNaN(Date.parse(deadline)))) {
        problems.push('budget.deadline must be a parseable date-time string when present');
      }
    }
  }

  if (c.bundle !== undefined && (typeof c.bundle !== 'string' || c.bundle.trim().length === 0)) {
    problems.push('bundle must be a non-empty string when present');
  }

  return problems;
}

/**
 * Builds a {@link TaskContract} from a draft: slugifies the name
 * (`task` wins over `name`), fills defaults (`priority: 'normal'`),
 * and validates. No budget is required, but a present budget must be
 * sane (`maxSeconds > 0`, `maxTokens > 0`, parseable `deadline`).
 *
 * @param draft - The draft contract.
 * @returns A valid, fully-populated task contract.
 * @throws {TypeError} When `draft` is not an object.
 * @throws {Error} When the name is missing/unslugable or validation finds problems.
 */
export function buildContract(draft: ContractDraft): TaskContract {
  if (!draft || typeof draft !== 'object') {
    throw new TypeError('buildContract: draft must be an object');
  }
  const rawName = draft.task ?? draft.name;
  if (typeof rawName !== 'string' || rawName.trim().length === 0) {
    throw new Error('buildContract: draft.task (or draft.name) is required and must be non-empty');
  }
  if (typeof draft.goal !== 'string' || draft.goal.trim().length === 0) {
    throw new Error('buildContract: draft.goal is required and must be non-empty');
  }

  const contract: TaskContract = {
    task: slugify(rawName),
    goal: draft.goal.trim(),
    tags: draft.tags ?? [],
    accept: draft.accept ?? [],
    workdir: draft.workdir ?? '',
    priority: draft.priority ?? 'normal',
  };
  if (draft.budget !== undefined) contract.budget = draft.budget;
  if (draft.bundle !== undefined) contract.bundle = draft.bundle;

  const problems = validateContract(contract);
  if (problems.length > 0) {
    throw new Error(`buildContract: invalid contract — ${problems.join('; ')}`);
  }
  return contract;
}
