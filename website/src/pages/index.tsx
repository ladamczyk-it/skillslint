import type { ReactNode } from 'react';

import Head from '@docusaurus/Head';
import { HomePage } from '@internal/docusaurus-theme/HomePage';

import { SkillAnimation } from '../components/SkillAnimation';

const TITLE = 'Skillslint: lint and score Agent Skills (SKILL.md)';

const DESCRIPTION =
  'Lint Agent Skills such as Claude Code skills before your agents run them: textlint prose checks and quality scores per SKILL.md, with floors that fail CI.';

const FEATURES = [
  {
    title: 'Two checks, one run',
    description:
      'textlint catches misspellings and weak prose while agent-skills-cli scores structure, clarity, specificity and advanced use, in a single command.',
  },
  {
    title: 'Thresholds you set',
    description:
      'Hold every skill to an overall floor or to per-category floors; anything below exits 1, so CI fails before a weak skill ships.',
  },
  {
    title: 'Built for CI and AI agents',
    description:
      'Run it in CI, after an agent writes a skill, or inside qoq; call lint() to get per-skill scores back as structured results.',
  },
];

const OPENER =
  'Skills are prompts your agents run unattended, so a vague or misspelled one fails silently. Lint every SKILL.md for prose and score its structure, clarity and specificity, locally and in CI.';

const Home = (): ReactNode => (
  <HomePage
    features={FEATURES}
    install="npm install --save-dev @ladamczyk/skillslint"
    opener={OPENER}
  >
    <Head>
      <title>{TITLE}</title>
      <meta content={DESCRIPTION} name="description" />
      <meta content={TITLE} property="og:title" />
      <meta content={DESCRIPTION} property="og:description" />
    </Head>
    <SkillAnimation />
  </HomePage>
);

export default Home;
