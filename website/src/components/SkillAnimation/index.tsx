import type { CSSProperties, ReactNode } from 'react';

import frame from '@internal/docusaurus-theme/terminal-window.module.css';
import { TerminalWindow } from '@internal/docusaurus-theme/TerminalWindow';

import styles from './styles.module.css';

/** The overall floor `--threshold` sets; per-category floors stay unset, so only Overall is held to it. */
const OVERALL_THRESHOLD = 70;

/** Scores before (`fail`) and after (`pass`) the fix, in the order the CLI prints them. */
const SCORES = [
  { label: 'Overall', fail: 64, pass: 76 },
  { label: 'Structure', fail: 82, pass: 82 },
  { label: 'Clarity', fail: 71, pass: 71 },
  { label: 'Specificity', fail: 52, pass: 74 },
  { label: 'Advanced', fail: 60, pass: 72 },
];

const LABEL =
  'Animation: skillslint lints skills/my-skill/SKILL.md, flags a misspelling, scores the skill below its overall threshold of 70, then passes once both are fixed.';

/** Mirrors agent-skills-cli's `getScoreColor`: ≥70 green, ≥50 yellow, below that red. */
const scoreColor = (score: number): string => {
  if (score >= 70) {
    return 'var(--ok)';
  }

  return score >= 50 ? 'var(--warn)' : 'var(--bad)';
};

export const SkillAnimation = (): ReactNode => (
  <TerminalWindow className={styles.wrapper} label={LABEL} title="skills/my-skill/SKILL.md">
    <div className={styles.body}>
      <div className={styles.file}>
        <div className={styles.line} style={{ '--i': 0 } as CSSProperties}>
          ---
        </div>
        <div className={styles.line} style={{ '--i': 1 } as CSSProperties}>
          name: my-skill
        </div>
        <div className={styles.line} style={{ '--i': 2 } as CSSProperties}>
          description: Triage reports you{' '}
          <span className={styles.word}>
            <span className={styles.typo}>recieve</span>
            <span className={styles.fixed}>receive</span>
          </span>
        </div>
        <div className={styles.line} style={{ '--i': 3 } as CSSProperties}>
          ---
        </div>
      </div>
      <div className={frame.terminal}>
        <div className={styles.prompt}>$ npx skillslint</div>
        <div className={styles.finding}>
          <span className={styles.position}>3:33</span>
          <span className={styles.bad}>✖</span>
          <span className={styles.message}>
            This is a commonly misspelled word. Correct it to receive
          </span>
          <span className={styles.ruleId}>common-misspellings</span>
        </div>
        <div className={styles.skill}>/my-skill</div>
        {SCORES.map(({ label, fail, pass }) => (
          <div
            key={label}
            className={styles.score}
            style={
              {
                '--fail': fail,
                '--pass': pass,
                '--fail-color': scoreColor(fail),
                '--pass-color': scoreColor(pass),
              } as CSSProperties
            }
          >
            <span className={styles.label}>{label}:</span>
            <span className={styles.track}>
              <span className={styles.fill} />
              {label === 'Overall' && (
                <span
                  className={styles.threshold}
                  style={{ '--threshold': OVERALL_THRESHOLD } as CSSProperties}
                />
              )}
            </span>
            <span className={styles.value}>
              <span className={styles.failValue}>{fail}/100</span>
              <span className={styles.passValue}>{pass}/100</span>
            </span>
          </div>
        ))}
        <div className={styles.verdict}>
          <span className={styles.fail}>
            At least one skill doesn&apos;t meet required threshold!
          </span>
          <span className={styles.pass}>All good!</span>
        </div>
      </div>
    </div>
  </TerminalWindow>
);
