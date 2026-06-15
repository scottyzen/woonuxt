import { addPluginTemplate, defineNuxtModule, useLogger } from '@nuxt/kit';

import { $fetch } from 'ofetch';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

type EnvSpec = {
  key: string;
  validate?: (v: string) => boolean;
  hint?: string;
};

type WooNuxtSettings = {
  primary_color?: string | null;
  logo?: string | null;
  publicIntrospectionEnabled?: boolean | null;
  frontEndUrl?: string | null;
  productsPerPage?: number | string | null;
  maxPrice?: number | string | null;
  global_attributes?: Record<string, unknown>[] | null;
  stripeSettings?: {
    enabled?: boolean | null;
    testmode?: string | null;
    test_publishable_key?: string | null;
    publishable_key?: string | null;
  } | null;
  wooNuxtSEO?: Record<string, unknown>[] | null;
  currencyCode?: string | null;
  currencySymbol?: string | null;
};

const REQUIRED_ENV: EnvSpec[] = [
  {
    key: 'GQL_HOST',
    hint: 'Format: https://your-site.com/graphql',
  },
  {
    key: 'NUXT_IMAGE_DOMAINS',
    hint: 'Format: domain.com (single domain, comma separated if multiple)',
  },
];

function validateEnvironment() {
  const errs: string[] = [];
  for (const { key, validate, hint } of REQUIRED_ENV) {
    const val = process.env[key]?.trim();
    if (!val) {
      errs.push(`Missing env: ${key}${hint ? ` (${hint})` : ''}`);
      continue;
    }
    if (validate && !validate(val)) {
      errs.push(`Invalid env: ${key}${hint ? ` (${hint})` : ''}`);
    }
  }
  if (errs.length) {
    const logger = useLogger('woonuxt-bridge');
    logger.error('\nEnvironment validation failed:\n- ' + errs.join('\n- '));
    logger.error('\nFix your .env (see .env.example) and rerun.\n');
    process.exit(1);
  }
}

// Validate environment variables before module setup
validateEnvironment();

function findHookFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];

  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    const stat = statSync(path);

    if (stat.isDirectory()) return findHookFiles(path);
    if (/\.(ts|js|mjs)$/.test(entry) && !entry.endsWith('.d.ts')) return [path];

    return [];
  });
}

export default defineNuxtModule({
  meta: {
    name: 'woonuxt-bridge',
    configKey: 'woonuxtBridge',
  },
  async setup(_, nuxt) {
    const logger = useLogger('woonuxt-bridge');
    const hookFiles = nuxt.options._layers
      .flatMap((layer) => [join(layer.cwd, 'hooks'), join(layer.cwd, 'app/hooks')])
      .flatMap(findHookFiles)
      .filter((path, index, files) => files.indexOf(path) === index)
      .sort();

    if (hookFiles.length) {
      addPluginTemplate({
        filename: 'woonuxt-hooks.mjs',
        getContents: () => {
          const imports = hookFiles
            .map((path, index) => `import hook${index} from ${JSON.stringify(path)};`)
            .join('\n');
          const calls = hookFiles
            .map((path, index) => {
              const label = relative(nuxt.options.rootDir, path);
              return `  if (typeof hook${index} === 'function') hook${index}({ source: ${JSON.stringify(label)} });`;
            })
            .join('\n');

          return `${imports}

export default defineNuxtPlugin(() => {
${calls}
});
`;
        },
      });
    }

    // Environment variables are guaranteed to be valid at this point
    const GQL_HOST = process.env.GQL_HOST!;
    const requestHeaders = { Origin: process.env.APP_HOST || 'http://localhost:3000' };

    const woonuxtSettings = `{
        primary_color
        logo
        publicIntrospectionEnabled
        frontEndUrl
        productsPerPage
        maxPrice
        global_attributes {
          slug
          showCount
          openByDefault
          label
          hideEmpty
        }
        stripeSettings {
          enabled
          testmode
          test_publishable_key
          publishable_key
        }
        wooNuxtSEO { provider url handle }
        currencyCode
        currencySymbol
    }`;

    const coreSettingsQuery = `
    query getWordPressSettings {
      generalSettings { title }
      allSettings { generalSettingsUrl }
    }`;

    const woonuxtSettingsQuery = `
    query getWooNuxtSettings {
      woonuxtSettings ${woonuxtSettings}
    }`;

    let siteTitle = 'WooNuxt';
    let backendUrl = '';
    let settings: WooNuxtSettings = {};

    try {
      const { data } = await $fetch(GQL_HOST, {
        method: 'POST',
        body: JSON.stringify({ query: coreSettingsQuery }),
        headers: requestHeaders,
      });

      siteTitle = data?.generalSettings?.title || siteTitle;
      backendUrl = data?.allSettings?.generalSettingsUrl || backendUrl;
    } catch (error) {
      logger.error(error);
      logger.warn('Error fetching WordPress settings. WooNuxt will continue with defaults.');
    }

    try {
      const { data } = await $fetch(GQL_HOST, {
        method: 'POST',
        body: JSON.stringify({ query: woonuxtSettingsQuery }),
        headers: requestHeaders,
      });

      settings = data?.woonuxtSettings || {};
    } catch {
      logger.warn(
        'WooNuxt settings plugin not detected. Continuing with defaults so the store can run. Install the latest WooNuxt WordPress plugin to unlock store settings, Stripe keys, SEO profiles, colors, and filter defaults: https://github.com/scottyzen/woonuxt/releases',
      );
    }

    // Default env variables
    process.env.PRIMARY_COLOR = settings.primary_color || '#7F54B2';

    const configuredMaxPrice = Number(settings.maxPrice);
    const resolvedMaxPrice = Number.isFinite(configuredMaxPrice) && configuredMaxPrice > 0 ? Math.ceil(configuredMaxPrice) : 1000;
    const configuredProductsPerPage = Number(settings.productsPerPage || process.env.PRODUCTS_PER_PAGE);
    const resolvedProductsPerPage = Number.isFinite(configuredProductsPerPage) && configuredProductsPerPage > 0 ? configuredProductsPerPage : 24;

    // Default runtimeConfig
    nuxt.options.runtimeConfig.public.PRIMARY_COLOR = settings.primary_color || '#7F54B2';
    nuxt.options.runtimeConfig.public.LOGO = settings.logo || '';
    nuxt.options.runtimeConfig.public.PRODUCTS_PER_PAGE = resolvedProductsPerPage;
    nuxt.options.runtimeConfig.public.GLOBAL_PRODUCT_ATTRIBUTES = settings.global_attributes || [];
    nuxt.options.runtimeConfig.public.MAX_PRICE = resolvedMaxPrice;
    nuxt.options.runtimeConfig.public.FRONT_END_URL = settings.frontEndUrl || '';
    nuxt.options.runtimeConfig.public.BACKEND_URL = backendUrl;
    nuxt.options.runtimeConfig.public.CURRENCY_CODE = settings.currencyCode || '';
    nuxt.options.runtimeConfig.public.CURRENCY_SYMBOL = settings.currencySymbol || '';
    nuxt.options.runtimeConfig.public.WOO_NUXT_SEO = settings.wooNuxtSEO || [];
    // Site title
    process.env.SITE_TITLE = siteTitle;

    // Stripe
    if (settings.stripeSettings?.enabled) {
      const stripePublishableKey =
        settings.stripeSettings?.testmode === 'yes' ? settings.stripeSettings?.test_publishable_key : settings.stripeSettings?.publishable_key;
      if (stripePublishableKey) nuxt.options.runtimeConfig.public.STRIPE_PUBLISHABLE_KEY = stripePublishableKey;
    }
  },
});
