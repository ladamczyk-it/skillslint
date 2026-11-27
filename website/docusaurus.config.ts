import { createConfig } from '@internal/docusaurus-theme/config';

import packageJson from '../package.json' with { type: 'json' };

export default createConfig({
  tool: 'skillslint',
  title: 'Skillslint',
  tagline: packageJson.description,
  version: packageJson.version,
  logo: 'img/logo.svg',
});
