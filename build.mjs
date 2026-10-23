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

const { userConfig, astroConfig } = await resolveConfig(inlineConfig, 'build');
const logger = await loadOrCreateNodeLogger(astroConfig, inlineConfig);
const settings = await createSettings(astroConfig, undefined, fileURLToPath(astroConfig.root));

const builder = new AstroBuilder(settings, {
  logger,
  mode: 'production',
  runtimeMode: 'production',
  force: false
});

await builder.run();
