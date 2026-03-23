import { defineNuxtModule, useLogger } from '@nuxt/kit';

import { $fetch } from 'ofetch';

type EnvSpec = {
  key: string;
  validate?: (v: string) => boolean;
  hint?: string;
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

function parsePriceValue(value: unknown): number {
  if (typeof value === 'number') return Number.isFinite(value) ? value : NaN;
  if (typeof value !== 'string') return NaN;

  const sanitized = value.replace(/[^\d.,-]/g, '');
  if (!sanitized) return NaN;

  const lastComma = sanitized.lastIndexOf(',');
  const lastDot = sanitized.lastIndexOf('.');
  let normalized = sanitized;

  // Normalize both common decimal separators and strip thousands separators.
  if (lastComma > -1 && lastDot > -1) {
    normalized = lastComma > lastDot ? sanitized.replace(/\./g, '').replace(',', '.') : sanitized.replace(/,/g, '');
  } else if (lastComma > -1) {
    normalized = sanitized.split(',').length > 2 ? sanitized.replace(/,/g, '') : sanitized.replace(',', '.');
  } else if (lastDot > -1 && sanitized.split('.').length > 2) {
    const parts = sanitized.split('.');
    normalized = `${parts.slice(0, -1).join('')}.${parts.at(-1)}`;
  }

  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : NaN;
}

const getVersionQuery = `query getVersion {
  woonuxtSettings {
    wooCommerceSettingsVersion
  }
}`;

// Validate environment variables before module setup
validateEnvironment();

export default defineNuxtModule({
  meta: {
    name: 'woonuxt-bridge',
    configKey: 'woonuxtBridge',
  },
  async setup(_, nuxt) {
    const logger = useLogger('woonuxt-bridge');

    // Environment variables are guaranteed to be valid at this point
    const GQL_HOST = process.env.GQL_HOST!;
    let WOONUXT_SETTINGS_PLUGIN_VERSION = 0;

    // Get the version of the woonuxt-settings plugin
    try {
      const { data } = await $fetch(GQL_HOST, {
        method: 'POST',
        body: JSON.stringify({ query: getVersionQuery }),
        headers: { Origin: process.env.APP_HOST || 'http://localhost:3000' },
      });

      const versionString = data.woonuxtSettings?.wooCommerceSettingsVersion || '0.0.0';
      logger.success(`WooNuxt Settings Plugin: v${versionString}`);

      // Convert semantic version to comparable number (e.g., "2.2.1" -> 20201, "1.0.55" -> 10055)
      const versionParts = versionString.split('.').map((part: string) => parseInt(part.replace(/\D/g, ''), 10) || 0);
      WOONUXT_SETTINGS_PLUGIN_VERSION = versionParts[0] * 10000 + versionParts[1] * 100 + versionParts[2];
    } catch (error) {
      logger.error(error);
    }

    const wooNuxtSEO = WOONUXT_SETTINGS_PLUGIN_VERSION > 10043 ? 'wooNuxtSEO { provider url handle }' : '';
    const currencyCode = WOONUXT_SETTINGS_PLUGIN_VERSION > 10055 ? 'currencyCode' : '';
    const currencySymbol = WOONUXT_SETTINGS_PLUGIN_VERSION > 10055 ? 'currencySymbol' : '';

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
        ${wooNuxtSEO}
        ${currencyCode}
        ${currencySymbol}
    }`;

    const query = `
    query getWooNuxtSettings {
      woonuxtSettings ${woonuxtSettings}
      generalSettings { title }
      allSettings { generalSettingsUrl }
      collectionStats(calculatePriceRange: true, where: { visibility: VISIBLE }) {
        priceRange {
          maxPrice
        }
      }
    }`;

    try {
      const { data } = await $fetch(GQL_HOST, {
        method: 'POST',
        body: JSON.stringify({ query }),
        headers: { Origin: process.env.APP_HOST || 'http://localhost:3000' },
      });

      // Default env variables
      process.env.PRIMARY_COLOR = data.woonuxtSettings?.primary_color || '#7F54B2';

      const configuredMaxPrice = parsePriceValue(data.woonuxtSettings?.maxPrice);
      const statsMaxPrice = parsePriceValue(data.collectionStats?.priceRange?.maxPrice);
      const resolvedMaxPrice =
        Number.isFinite(statsMaxPrice) && statsMaxPrice > 0
          ? Math.ceil(statsMaxPrice)
          : Number.isFinite(configuredMaxPrice) && configuredMaxPrice > 0
            ? Math.ceil(configuredMaxPrice)
            : 1000;

      // Default runtimeConfig
      nuxt.options.runtimeConfig.public.PRIMARY_COLOR = data.woonuxtSettings?.primary_color || '#7F54B2';
      nuxt.options.runtimeConfig.public.LOGO = data.woonuxtSettings?.logo || null;
      nuxt.options.runtimeConfig.public.PRODUCTS_PER_PAGE = data.woonuxtSettings?.productsPerPage || process.env.PRODUCTS_PER_PAGE || 24;
      nuxt.options.runtimeConfig.public.GLOBAL_PRODUCT_ATTRIBUTES = data.woonuxtSettings?.global_attributes || [];
      nuxt.options.runtimeConfig.public.MAX_PRICE = resolvedMaxPrice;
      nuxt.options.runtimeConfig.public.FRONT_END_URL = data.woonuxtSettings?.frontEndUrl || null;
      nuxt.options.runtimeConfig.public.BACKEND_URL = data.allSettings?.generalSettingsUrl || null;
      nuxt.options.runtimeConfig.public.CURRENCY_CODE = data.woonuxtSettings?.currencyCode || null;
      nuxt.options.runtimeConfig.public.CURRENCY_SYMBOL = data.woonuxtSettings?.currencySymbol || null;
      nuxt.options.runtimeConfig.public.WOO_NUXT_SEO = data.woonuxtSettings?.wooNuxtSEO || null;
      // Site title
      process.env.SITE_TITLE = data.generalSettings?.title || 'WooNuxt';

      // Stripe
      if (data.woonuxtSettings?.stripeSettings?.enabled) {
        nuxt.options.runtimeConfig.public.STRIPE_PUBLISHABLE_KEY =
          data.woonuxtSettings?.stripeSettings?.testmode === 'yes'
            ? data.woonuxtSettings?.stripeSettings?.test_publishable_key
            : data.woonuxtSettings?.stripeSettings?.publishable_key;
      }
    } catch (error) {
      logger.error(error);
      logger.warn(
        'Error fetching woonuxt settings. Make sure you have the latest version woonuxt-settings plugin installed on WordPress. https://github.com/scottyzen/woonuxt-settings',
      );
    }
  },
});
