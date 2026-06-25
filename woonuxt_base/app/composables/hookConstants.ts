export const HOOKS = {
  layout: {
    header: { beforeNav: 'layout.header.beforeNav' },
    footer: { bottom: 'layout.footer.bottom' },
  },
  product: {
    summary: { beforeTitle: 'product.summary.beforeTitle', afterPrice: 'product.summary.afterPrice' },
    tabs: { after: 'product.tabs.after' },
  },
  checkout: {
    review: { after: 'checkout.review.after' },
  },
} as const;

export const ALL_HOOK_NAMES = [
  HOOKS.layout.header.beforeNav,
  HOOKS.layout.footer.bottom,
  HOOKS.product.summary.beforeTitle,
  HOOKS.product.summary.afterPrice,
  HOOKS.product.tabs.after,
  HOOKS.checkout.review.after,
] as const;

export type AllHookNames = (typeof ALL_HOOK_NAMES)[number];

export default HOOKS;
