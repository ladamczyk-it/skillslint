export default {
  prettier: {
    sources: ['.'],
  },
  knip: {
    entry: ['./src/index.{js,ts}', './src/cli.{js,ts}'],
    project: './src/**/*.{js,ts}',
    ignore: ['**/rolldown.config.js', '**/vitest.config.js', 'eslint.config.js', 'qoq.config.js'],
    ignoreDependencies: [
      // build specific
      'rolldown',
      'dotenv',
      // package specific
      '@textlint/*',
      'textlint*',
      '@commitlint/cli',
    ],
  },
  eslint: [
    {
      template: 'qoq-eslint-v9-ts',
      files: ['src/**/*.ts'],
    },
  ],
};
