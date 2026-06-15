/**
 * Example WooNuxt hook registrations.
 *
 * Copy this file to `hooks/product.ts` in your app or custom layer to enable it.
 * Files inside `hooks/` are loaded automatically by WooNuxt.
 */
export default () => {
  registerHook({
    name: 'product.summary.beforeTitle',
    id: 'sale-label',
    renderer: () =>
      h(
        'div',
        {
          class: 'mb-2 text-xs font-semibold text-red-500 dark:text-red-400',
        },
        'ON SALE NOW!',
      ),
    priority: 1,
    when: (ctx: { product?: { salePrice?: string | null } }) => !!ctx.product?.salePrice,
  });

  registerHook({
    name: 'product.summary.afterPrice',
    id: 'product-after-price-notice',
    renderer: ({ product }: { product?: { name?: string } }) =>
      h(
        'div',
        {
          class: 'mt-4 rounded-md border border-green-200 bg-green-50 p-3 text-sm leading-relaxed text-green-800',
        },
        `Secure checkout, fast shipping, and easy returns for ${product?.name || 'this product'}.`,
      ),
    priority: 10,
  });
};
