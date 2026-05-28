import { getNoRestrictedImportsPaths } from '@saashub/qoq-eslint-v9-js';

const rules = {
  'no-restricted-imports': [
    1,
    {
      paths: getNoRestrictedImportsPaths(),
    },
  ],
};

export default {
  prettier: {
    sources: ['.'],
  },
  knip: {
    entry: './src/index.{js,ts}',
    project: './src/**/*.{js,ts}',
    ignore: ['**/rollup.*.js', '**/vitest.config.js', 'eslint.config.js', 'qoq.config.js'],
    ignoreDependencies: [
      // build specific
      '@rollup/*',
      'rollup-*',
      'esbuild',
      // package specific
      '@textlint/*',
      'textlint*',
      '@commitlint/cli',
    ],
  },
  eslint: [
    {
      template: '@saashub/qoq-eslint-v9-ts',
      files: ['src/**/*.ts'],
      rules,
    },
  ],
};
