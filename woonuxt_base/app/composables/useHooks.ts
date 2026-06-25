import type { Component } from 'vue';

export interface HookEntry {
  id: string;
  component: Component;
  priority?: number;
}

export interface HookContextMap {
  'layout.header.beforeNav': Record<string, never>;
  'layout.footer.bottom': Record<string, never>;
  'product.summary.beforeTitle': { product: any };
  'product.summary.afterPrice': { product: any };
  'product.tabs.after': { product: any };
  'checkout.review.after': { checkout: any };
}

export type HookName = keyof HookContextMap;

export type HookContext<T extends HookName> = HookContextMap[T];

export interface RegisterHookOptions<T extends HookName = HookName> {
  name: T;
  id: string;
  component: Component;
  priority?: number;
}

const hookRegistry = new Map<HookName, HookEntry[]>();

export function useHooks() {
  const register = <T extends HookName>(options: RegisterHookOptions<T>): void => {
    const { name, id, component, priority = 10 } = options;

    const entries = hookRegistry.get(name) || [];

    // Create the hook entry
    const entry: HookEntry = {
      id,
      component,
      priority,
    };

    // Add to registry
    entries.push(entry);

    // Sort by priority (lower first)
    entries.sort((a, b) => (a.priority ?? 10) - (b.priority ?? 10));

    hookRegistry.set(name, entries);
  };

  const get = (name: HookName): HookEntry[] => {
    return hookRegistry.get(name) || [];
  };

  return {
    register,
    get,
  };
}

export const registerHook = <T extends HookName>(options: RegisterHookOptions<T>): void => {
  const hooks = useHooks();
  hooks.register(options);
};
