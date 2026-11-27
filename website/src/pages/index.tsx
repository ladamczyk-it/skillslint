import type { ReactNode } from 'react';

import { HomePage } from '@internal/docusaurus-theme/HomePage';

import { SkillAnimation } from '../components/SkillAnimation';

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
    title: 'CLI or API',
    description:
      'Run it with npx, in CI or inside a QoQ pipeline, or call lint() from your own tooling and get structured results back.',
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
    <SkillAnimation />
  </HomePage>
);

export default Home;
