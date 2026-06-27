import type { Ref } from 'vue';

type WooNuxtRuntimeGraphQLClient = {
  host: string;
  headers?: Record<string, string | undefined>;
  tokenStorage?: boolean;
  fetchOptions?: {
    mode?: RequestMode;
    credentials?: RequestCredentials;
  };
};

type WooNuxtFilterConfig = {
  slug?: string | null;
  showCount?: boolean | null;
  openByDefault?: boolean | null;
  label?: string | null;
  hideEmpty?: boolean | null;
};

type WooNuxtSEOConfig = {
  provider?: string | null;
  url?: string | null;
  handle?: string | null;
};

type GqlAuthInitHookParams = {
  client: string;
  token: Ref<string | undefined>;
};

declare module 'nuxt/schema' {
  interface PublicRuntimeConfig {
    PRIMARY_COLOR: string;
    LOGO: string | null;
    PRODUCTS_PER_PAGE: number;
    GLOBAL_PRODUCT_ATTRIBUTES: WooNuxtFilterConfig[];
    MAX_PRICE: number;
    FRONT_END_URL: string | null;
    BACKEND_URL: string | null;
    CURRENCY_CODE: string | null;
    CURRENCY_SYMBOL: string | null;
    WOO_NUXT_SEO: WooNuxtSEOConfig[] | null;
    STRIPE_PUBLISHABLE_KEY?: string | null;
    'graphql-client': {
      clients: {
        default: WooNuxtRuntimeGraphQLClient;
      };
    };
  }
}

declare module 'nuxt/app' {
  interface RuntimeNuxtHooks {
    'gql:auth:init': (params: GqlAuthInitHookParams) => void | Promise<void>;
  }
}

declare module '#app' {
  interface RuntimeNuxtHooks {
    'gql:auth:init': (params: GqlAuthInitHookParams) => void | Promise<void>;
  }
}

export {};
