/**
 * Example Hook Registrations
 *
 * This file demonstrates how to register hooks in WooNuxt.
 * Copy this pattern to create your own custom hooks.
 *
 * These are examples only. To enable them:
 * 1. Add this plugin to nuxt.config.ts plugins array:
 *    resolve('./app/plugins/hooks-examples.ts')
 * 2. Or copy the patterns to your own custom layer
 *
 * NOTE: Hooks registered here will be included in SSR/SSG builds.
 * If you want client-only hooks, check the imports and add them conditionally.
 */

import CartUpsell from '../components/examples/CartUpsell.vue';

export default defineNuxtPlugin(() => {
  // Example 1: Add cart upsell before checkout button
  registerHook({
    name: 'cart.summary.beforeTotals',
    id: 'cart-upsell',
    renderer: CartUpsell,
    priority: 10,
  });

  // Example 2: Conditional hook - only show on product pages with sale items
  registerHook({
    name: 'product.summary.beforeTitle',
    id: 'sale-label',
    renderer: () =>
      h(
        'div',
        {
          class: 'text-xs font-semibold text-red-500 dark:text-red-400 mb-2',
        },
        '🔥 ON SALE NOW!',
      ),
    priority: 1,
    // Only show when product has a sale price
    when: (ctx: any) => !!ctx.product?.salePrice,
  });
});
