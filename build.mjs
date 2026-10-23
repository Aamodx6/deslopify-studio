import { resolveConfig } from './node_modules/astro/dist/core/config/config.js';
import { loadOrCreateNodeLogger } from './node_modules/astro/dist/core/logger/load.js';
import { createSettings } from './node_modules/astro/dist/core/config/settings.js';
import { fileURLToPath } from 'node:url';
import { AstroBuilder } from './node_modules/astro/dist/core/build/index.js';

const inlineConfig = {
  configFile: false,
  site: 'https://deslopify.studio',
  output: 'static'
};

console.log('Resolving config...');
const { userConfig, astroConfig } = await resolveConfig(inlineConfig, 'build');
console.log('Loading logger...');
const logger = await loadOrCreateNodeLogger(astroConfig, inlineConfig);
console.log('Creating settings...');
const settings = await createSettings(astroConfig, undefined, fileURLToPath(astroConfig.root));

console.log('Creating AstroBuilder...');
const builder = new AstroBuilder(settings, {
  logger,
  mode: 'production',
  runtimeMode: 'production',
  force: false
});

console.log('Starting builder.run()...');
await builder.run();
console.log('Build complete!');
process.exit(0);
