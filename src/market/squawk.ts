/**
 * @fileoverview Fleet narration for the emergent task economy.
 *
 * The market narrates itself to the pack: task openings, bids, wins,
 * progress, completions, verdicts, alerts, petitions, and debates all post
 * to the fleet channel. Narration goes through `fleet-post` (hyper-race,
 * never raw file writes) — spawned, never written by hand.
 *
 * Narration must never break the market: every failure is logged to
 * stderr and the promise resolves anyway.
 *
 * @module agentos/market/squawk
 */

/** Narration kinds the market can post to fleet. */
export type SquawkKind =
  | 'task-open'
  | 'bid'
  | 'win'
  | 'progress'
  | 'done'
  | 'verdict'
  | 'alert'
  | 'petition'
  | 'debate';

/** Options for `narrate`. */
export interface NarrateOpts {
  /** Fleet sender identity. Default: `market`. */
  sender?: string;
  /** fleet-post binary path. Default: `~/workspace/bin/fleet-post`. */
  fleetPostPath?: string;
}

/** Result of a narration attempt. Never throws. */
export interface NarrateResult {
  kind: SquawkKind;
  sender: string;
  /** Process exit code; -1 when the spawn itself failed. */
  code: number;
  stdout: string;
  stderr: string;
}

const DEFAULT_SENDER = 'market';
const DEFAULT_FLEET_POST = `${process.env.HOME ?? '~'}/workspace/bin/fleet-post`;

/** Prefixes that give each kind its voice on the fleet channel. */
const KIND_PREFIX: Record<SquawkKind, string> = {
  'task-open': '📝 task-open',
  bid: '💰 bid',
  win: '🏆 win',
  progress: '⏳ progress',
  done: '✅ done',
  verdict: '⚖️ verdict',
  alert: '🚨 alert',
  petition: '📜 petition',
  debate: '🗣️ debate',
};

/**
 * Narrate a market event to the fleet channel.
 *
 * Spawns `fleet-post --sender <sender> --message <text>` via Bun.spawn.
 * Never writes to the fleet channel directly, never throws: failures are
 * logged to stderr and returned in the result.
 *
 * @param kind The market event kind being narrated.
 * @param text The message body.
 * @param opts Optional sender and fleet-post path overrides.
 */
export async function narrate(
  kind: SquawkKind,
  text: string,
  opts: NarrateOpts = {},
): Promise<NarrateResult> {
  const sender = opts.sender ?? process.env.FLEET_SENDER ?? DEFAULT_SENDER;
  const bin = opts.fleetPostPath ?? process.env.FLEET_POST ?? DEFAULT_FLEET_POST;
  const message = `${KIND_PREFIX[kind]} ${text}`;

  try {
    const proc = Bun.spawn([bin, '--sender', sender, '--message', message], {
      stdout: 'pipe',
      stderr: 'pipe',
    });
    const [stdout, stderr, code] = await Promise.all([
      new Response(proc.stdout).text(),
      new Response(proc.stderr).text(),
      proc.exited,
    ]);
    if (code !== 0) {
      console.error(`[squawk] fleet-post exited ${code}: ${stderr.trim()}`);
    }
    return { kind, sender, code, stdout, stderr };
  } catch (err) {
    // Narration must not break the market — log and carry on.
    const detail = err instanceof Error ? err.message : String(err);
    console.error(`[squawk] fleet-post spawn failed: ${detail}`);
    return { kind, sender, code: -1, stdout: '', stderr: detail };
  }
}
