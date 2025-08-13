import { createResolver } from '@nuxt/kit';
import { deepMerge } from './utils';
import { defaultConfig } from './defaults';

const { resolve } = createResolver(import.meta.url);

/**
 * Load app.config.ts defaults
 */
export async function loadAppConfig(): Promise<any> {
  try {
    // For now, use the defaults from our defaults file
    // This avoids the issue with defineAppConfig not being available in Node.js context
    return defaultConfig;
  } catch (error) {
    console.warn('Could not load app.config.ts:', error);
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

/**
 * Merge app config with WordPress data
 */
export function mergeConfigurations(appConfig: any, wpData: any): any {
  return deepMerge(appConfig, wpData);
}
