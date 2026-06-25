import type { Component } from 'vue';

/**
 * Hook entry that can be registered at a specific outlet
 */
export interface HookEntry {
  /** Unique identifier for this hook */
  id: string;
  /** Component to render at this outlet */
  component: Component;
  /** Priority for sorting (lower numbers render first) */
  priority?: number;
}

/**
 * Context types for different hook locations
 */
export interface HookContextMap {
  // Layout hooks
  'layout.header.beforeNav': Record<string, never>;
  'layout.footer.bottom': Record<string, never>;

  // Product page hooks
  'product.summary.beforeTitle': { product: any };
  'product.summary.afterPrice': { product: any };
  'product.tabs.after': { product: any };

  // Checkout hooks
  'checkout.review.after': { checkout: any };
}

/**
 * Hook names that can be used in the system
 */
export type HookName = keyof HookContextMap;

/**
 * Get the context type for a specific hook name
 */
export type HookContext<T extends HookName> = HookContextMap[T];

/**
 * Options for registering a hook
 */
export interface RegisterHookOptions<T extends HookName = HookName> {
  /** Hook location name */
  name: T;
  /** Unique identifier for this hook */
  id: string;
  /** Component to render at this outlet */
  component: Component;
  /** Priority for sorting (lower numbers render first, default: 10) */
  priority?: number;
}

/**
 * Global hook registry
 */
const hookRegistry = new Map<HookName, HookEntry[]>();

/**
 * Composable to manage hooks registration and retrieval
 */
export function useHooks() {
  /**
   * Register a hook at a specific outlet
   */
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

  /**
   * Get all hook entries for a specific hook name
   */
  const get = (name: HookName): HookEntry[] => {
    return hookRegistry.get(name) || [];
  };

  return {
    register,
    get,
  };
}

/**
 * Register a hook at a specific outlet
 *
 * @example
 * ```ts
 * // In hooks/product.ts
 * import TrustBadge from '~/components/TrustBadge.vue'
 *
 * export default () => {
 *   registerHook({
 *     name: 'product.summary.afterPrice',
 *     id: 'trust-badge',
 *     component: TrustBadge
 *   });
 * };
 * ```
 */
export const registerHook = <T extends HookName>(options: RegisterHookOptions<T>): void => {
  const hooks = useHooks();
  hooks.register(options);
};
