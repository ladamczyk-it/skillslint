import type { ReactNode } from 'react';

import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import githubStyles from '@internal/docusaurus-theme/github-button.module.css';
import styles from '@internal/docusaurus-theme/hero.module.css';
import CodeBlock from '@theme/CodeBlock';
import Layout from '@theme/Layout';

import pageStyles from './index.module.css';

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

const Home = (): ReactNode => {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout>
      <main>
        <header className={`${styles.hero} ${pageStyles.hero}`}>
          <div className={styles.heroContent}>
            <div className={pageStyles.heroTop}>
              <div className={pageStyles.heroText}>
                <h1 className={styles.heroTitle}>{siteConfig.title}</h1>
                <p className={styles.heroTagline}>{OPENER}</p>
              </div>
              <div className={styles.heroActions}>
                <Link className={githubStyles.githubButton} to="/docs">
                  Get Started
                </Link>
              </div>
            </div>
            <div className={`${styles.heroInstall} ${pageStyles.install}`}>
              <CodeBlock language="bash">npm install --save-dev @ladamczyk/skillslint</CodeBlock>
            </div>
          </div>
        </header>
        <ul className={`${styles.features} ${pageStyles.features}`}>
          {FEATURES.map(({ title, description }) => (
            <li key={title} className={styles.feature}>
              <h2 className={styles.featureTitle}>{title}</h2>
              <p className={styles.featureDescription}>{description}</p>
            </li>
          ))}
        </ul>
      </main>
    </Layout>
  );
};

export default Home;
