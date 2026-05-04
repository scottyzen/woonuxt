// Custom type declarations to ensure module types are available
/// <reference path="../../.nuxt/types/modules.d.ts" />

import type { Ref } from 'vue';

declare module 'nuxt/app' {
  interface RuntimeNuxtHooks {
    'gql:auth:init': (params: { client: string; token: Ref<string | undefined> }) => void;
  }
}

export {};
