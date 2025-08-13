import { $fetch } from 'ofetch';
import { createResolver, useLogger } from '@nuxt/kit';

const { resolve } = createResolver(import.meta.url);

/**
 * Deep merge two objects recursively
 */
export function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const result = { ...target };

  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      const sourceValue = source[key];
      const targetValue = result[key];

      if (
        sourceValue &&
        typeof sourceValue === 'object' &&
        !Array.isArray(sourceValue) &&
        targetValue &&
        typeof targetValue === 'object' &&
        !Array.isArray(targetValue)
      ) {
        (result as any)[key] = deepMerge(targetValue, sourceValue);
      } else if (sourceValue !== undefined) {
        (result as any)[key] = sourceValue;
      }
    }
  }

  return result;
}

/**
 * Environment variable validation
 */
export function validateEnvironment(): void {
  const required = {
    GQL_HOST: {
      validate: (val: string) => val.startsWith('http'),
      hint: 'Must be a valid URL starting with http',
    },
  };

  const errs: string[] = [];
  for (const [key, { validate, hint }] of Object.entries(required)) {
    const val = process.env[key];
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

/**
 * Load app.config.ts defaults
 */
export async function loadAppConfig(): Promise<any> {
  try {
    // Try to read the app.config.ts file and extract its default export
    const fs = await import('fs/promises');
    const configPath = resolve('../../app/app.config.ts');
    const configContent = await fs.readFile(configPath, 'utf-8');
    
    // Extract the configuration object from defineAppConfig call
    const configMatch = configContent.match(/defineAppConfig\(\s*(\{[\s\S]*?\})\s*\)/);
    if (configMatch) {
      // Use Function constructor to safely evaluate the config object
      const configObject = new Function('return ' + configMatch[1])();
      return configObject;
    }
    
    return {};
  } catch (error) {
    console.warn('Could not load app.config.ts:', error);
    return {};
  }
}

/**
 * Fetch WooNuxt settings from WordPress GraphQL endpoint
 */
export async function fetchWoonuxtSettings(gqlHost: string): Promise<any> {
  // Check plugin version first
  const versionQuery = `query getVersion {
    woonuxtSettings {
      wooCommerceSettingsVersion
    }
  }`;

  let pluginVersion = 0;
  try {
    const { data: versionData } = await $fetch(gqlHost, {
      method: 'POST',
      body: {
        query: versionQuery,
      },
    });

    pluginVersion = versionData?.woonuxtSettings?.wooCommerceSettingsVersion || 0;
  } catch (error) {
    // Silently fall back to version 0 if version check fails
    pluginVersion = 0;
  }

  // Build query based on version
  let settingsQuery: string;
  if (pluginVersion >= 1) {
    // Version 1+ supports all fields
    settingsQuery = `query getWooNuxtSettings {
      woonuxtSettings {
        wooCommerceSettingsVersion
        siteName
        shortDescription
        description
        siteImage
        baseUrl
        frontEndUrl
        backendUrl
        primary_color
        storeSettings {
          autoOpenCart
          showReviews
          showFilters
          showOrderByDropdown
          showSKU
          showRelatedProducts
          showProductCategoriesOnSingleProduct
          showBreadcrumbOnSingleProduct
          showMoveToWishlist
          hideBillingAddressForVirtualProducts
          initStoreOnUserActionToReduceServerLoad
          saleBadge
          socialLoginsDisplay
        }
        logo
        logo_width
        logo_height
        logo_mobile
        logo_mobile_width
        logo_mobile_height
        productsPerPage
        maxPrice
        currencyCode
        currencySymbol
        global_attributes
        wooNuxtSEO {
          title
          description
          ogImage
          isEnabled
        }
        stripePublishableKey
      }
    }`;
  } else {
    // Fallback for older versions or if version check fails
    settingsQuery = `query getWooNuxtSettings {
      woonuxtSettings {
        siteName
        shortDescription
        description
        baseUrl
        primary_color
        logo
        productsPerPage
        maxPrice
        currencyCode
        currencySymbol
      }
    }`;
  }

  try {
    const { data } = await $fetch(gqlHost, {
      method: 'POST',
      body: {
        query: settingsQuery,
      },
    });

    return data?.woonuxtSettings || {};
  } catch (error) {
    console.warn('WordPress endpoint unreachable, using defaults:', error);
    return {};
  }
}

/**
 * Apply legacy compatibility mappings to runtime config
 */
export function applyLegacyConfig(nuxt: any, merged: any): void {
  // Legacy compatibility - maintain existing runtime config structure
  nuxt.options.runtimeConfig.public.LOGO = merged.logo || '';
  nuxt.options.runtimeConfig.public.PRODUCTS_PER_PAGE = merged.productsPerPage || 24;
  nuxt.options.runtimeConfig.public.GLOBAL_PRODUCT_ATTRIBUTES = merged.global_attributes || [];
  nuxt.options.runtimeConfig.public.MAX_PRICE = merged.maxPrice || 1000;
  nuxt.options.runtimeConfig.public.FRONT_END_URL = merged.frontEndUrl || '';
  nuxt.options.runtimeConfig.public.BACKEND_URL = merged.backendUrl || '';
  nuxt.options.runtimeConfig.public.CURRENCY_CODE = merged.currencyCode || '';
  nuxt.options.runtimeConfig.public.CURRENCY_SYMBOL = merged.currencySymbol || '';
  nuxt.options.runtimeConfig.public.WOO_NUXT_SEO = merged.wooNuxtSEO || [];
  nuxt.options.runtimeConfig.public.STRIPE_PUBLISHABLE_KEY = merged.stripePublishableKey || '';

  // Set environment variables for compatibility
  process.env.PRIMARY_COLOR = merged.primary_color || '#7F54B2';
  process.env.SITE_TITLE = merged.siteName || 'WooNuxt';
}