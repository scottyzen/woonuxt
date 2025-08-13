import { defineNuxtModule, useLogger } from '@nuxt/kit';
import { validateEnvironment, loadAppConfig, fetchWoonuxtSettings, deepMerge, applyLegacyConfig } from './utils';

// Validate environment variables before module setup
validateEnvironment();

export default defineNuxtModule({
  meta: {
    name: 'woonuxt-bridge',
    configKey: 'woonuxtBridge',
  },
  async setup(_, nuxt) {
    const logger = useLogger('woonuxt-config');

    // 1) Environment variables are guaranteed to be valid at this point
    const GQL_HOST = process.env.GQL_HOST!;

    // 2) Load defaults from app.config.ts
    const appConfig = await loadAppConfig();
    if (Object.keys(appConfig).length > 0) {
      logger.info('Loaded app.config.ts');
    } else {
      logger.warn('Could not load app.config.ts');
    }

    // 3) Fetch WordPress settings
    logger.info('Fetching WooNuxt settings from WordPress...');
    const wpData = await fetchWoonuxtSettings(GQL_HOST);

    // 4) Merge app config with WordPress data (WordPress data takes precedence)
    const merged = deepMerge(appConfig, wpData);
    logger.info('Configuration merged successfully');

    // 5) Update Nuxt app config
    nuxt.options.appConfig = merged;

    // 6) Apply legacy compatibility mappings
    applyLegacyConfig(nuxt, merged);

    logger.success('WooNuxt configuration setup complete!');
  },
});
