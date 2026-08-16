import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { homedir } from 'os';
import { dirname, join } from 'path';
import { createInterface } from 'readline/promises';

import c from 'picocolors';

const STATS_URL = 'https://stats.adamczyk.ovh';
const STATS_TIMEOUT_MS = 2000;

// Machine-wide, not per-project: skillslint has no config file of its own, and
// asking once per checkout would be one prompt per repo. XDG_CONFIG_HOME wins
// where it is set, ~/.config otherwise.
const CONSENT_FILE = join(
  process.env.XDG_CONFIG_HOME ?? join(homedir(), '.config'),
  'skillslint.json'
);

const readConsent = (file: string): Record<string, unknown> => {
  try {
    const parsed: unknown = JSON.parse(readFileSync(file, 'utf8'));

    return typeof parsed === 'object' && parsed !== null ? (parsed as Record<string, unknown>) : {};
  } catch {
    // Missing or corrupt is the same as never asked.
    return {};
  }
};

const writeConsent = (file: string, stats: boolean): void => {
  try {
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, `${JSON.stringify({ ...readConsent(file), stats }, null, 2)}\n`);
  } catch {
    // An unwritable config dir means we ask again next run — not an error worth
    // failing a lint over.
  }
};

const askConsent = async (): Promise<boolean> => {
  process.stdout.write(
    [
      c.bold('\nSkillslint usage stats\n'),
      `Send a count of skillslint runs to ${STATS_URL}? Each run posts one thing:\n`,
      `  • the tool name — always the literal ${c.cyan('"skillslint"')}\n`,
      c.gray(
        'Never sent: your skills, file names, paths, scores, findings, thresholds,\n' +
          'the flags you typed, project or package names, and nothing identifying\n' +
          'you or your machine.\n'
      ),
      c.gray(`Stored as \`stats: true|false\` in ${CONSENT_FILE} — edit it any time.\n\n`),
    ].join('')
  );

  const rl = createInterface({ input: process.stdin, output: process.stdout });

  try {
    return (await rl.question('Send anonymous usage stats? [y/N] ')).trim().toLowerCase() === 'y';
  } finally {
    rl.close();
  }
};

// Three states, and they are not two: `true` allows, `false` denies, and
// `undefined` means nobody has been asked yet. A non-interactive run (CI, a
// pipe, `npx … | tee`) can't ask, so it stays undefined — nothing is sent and
// nothing is written, and the next run with a human present still prompts.
// Answering `false` writes that denial down, which is what stops the asking.
export const resolveConsent = async (file: string = CONSENT_FILE): Promise<boolean | undefined> => {
  const stored = readConsent(file).stats;

  if (typeof stored === 'boolean') {
    return stored;
  }

  if (process.env.CI === 'true' || !process.stdin.isTTY || !process.stdout.isTTY) {
    return undefined;
  }

  const stats = await askConsent();

  writeConsent(file, stats);

  return stats;
};

// Fire-and-forget: callers don't await it, and a dead or slow endpoint must never
// surface as an error or hold a run up — hence the swallowed catch and the 2s cap.
//
// `options` is always empty and takes no argument: a run count is the whole
// question this answers, and the sink requires the key. Nothing about how the
// run was invoked goes out, so there is nothing to sanitize.
export const sendStats = async (): Promise<void> => {
  try {
    await fetch(STATS_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ tool: 'skillslint', options: [] }),
      signal: AbortSignal.timeout(STATS_TIMEOUT_MS),
    });
  } catch {
    // Stats are best-effort; a failed send is not the user's problem.
  }
};
