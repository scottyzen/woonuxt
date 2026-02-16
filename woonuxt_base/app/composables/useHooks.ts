import type { Component, VNode } from 'vue';

/**
 * Hook entry that can be registered at a specific outlet
 */
export interface HookEntry {
  /** Unique identifier for this hook entry */
  id: string;
  /** Priority for sorting (lower numbers execute first) */
  priority?: number;
  /** Conditional function to determine if hook should render */
  when?: (ctx: any) => boolean;
  /** The component or render function to execute */
  renderer: Component | ((ctx: any) => VNode | VNode[] | null);
  /** Source module/plugin name for debugging */
  source?: string;
}

/**
 * Context types for different hook locations
 */
export interface HookContextMap {
  // Layout hooks
  'layout.header.beforeNav': Record<string, never>;
  'layout.header.afterNav': Record<string, never>;
  'layout.footer.top': Record<string, never>;
  'layout.footer.bottom': Record<string, never>;

  // Product page hooks
  'product.summary.beforeTitle': { product: any };
  'product.summary.afterPrice': { product: any };
  'product.summary.afterDescription': { product: any };
  'product.gallery.after': { product: any };
  'product.tabs.after': { product: any };

  // Cart hooks
  'cart.lineItem.afterName': { item: any; cart: any };
  'cart.summary.beforeTotals': { cart: any };
  'cart.summary.afterTotals': { cart: any };

  // Checkout hooks
  'checkout.customer.before': { checkout: any };
  'checkout.shipping.afterMethods': { checkout: any };
  'checkout.payment.beforeMethods': { checkout: any };
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
export interface RegisterHookOptions<T extends HookName> {
  /** Hook location name */
  name: T;
  /** Unique identifier for this hook entry */
  id: string;
  /** The component or render function */
  renderer: Component | ((ctx: HookContext<T>) => VNode | VNode[] | null);
  /** Priority for sorting (lower numbers execute first, default: 10) */
  priority?: number;
  /** Conditional function to determine if hook should render */
  when?: (ctx: HookContext<T>) => boolean;
  /** Source module/plugin name for debugging */
  source?: string;
}

/**
 * Hook registry interface
 */
export interface HookRegistry {
  register<T extends HookName>(options: RegisterHookOptions<T>): void;
  get(name: HookName): HookEntry[];
  clear(name?: HookName): void;
  getAll(): Map<HookName, HookEntry[]>;
}

/**
 * Global hook registry
 * Uses a Map to store hook entries by name
 */
const hookRegistry = new Map<HookName, HookEntry[]>();

/**
 * Composable for managing WooNuxt hooks
 * Provides registration, retrieval, and management of hook entries
 */
export const useHooks = (): HookRegistry => {
  /**
   * Register a new hook entry
   */
  const register = <T extends HookName>(options: RegisterHookOptions<T>): void => {
    const { name, id, renderer, priority = 10, when, source } = options;

    // Get existing entries for this hook name
    const entries = hookRegistry.get(name) || [];

    // Check for duplicate IDs
    if (entries.some((entry) => entry.id === id)) {
      return;
    }

    // Create the hook entry
    const entry: HookEntry = {
      id,
      priority,
      when,
      renderer,
      source: source || 'unknown',
    };

    // Add to registry
    entries.push(entry);

    // Sort by priority (lower first), then by stable order (ID)
    entries.sort((a, b) => {
      if (a.priority !== b.priority) {
        return (a.priority || 10) - (b.priority || 10);
      }
      return a.id.localeCompare(b.id);
    });

    hookRegistry.set(name, entries);
  };

  /**
   * Get all hook entries for a specific hook name
   */
  const get = (name: HookName): HookEntry[] => {
    return hookRegistry.get(name) || [];
  };

  /**
   * Clear hooks (useful for testing)
   */
  const clear = (name?: HookName): void => {
    if (name) {
      hookRegistry.delete(name);
    } else {
      hookRegistry.clear();
    }
  };

  /**
   * Get all registered hooks (for debugging)
   */
  const getAll = (): Map<HookName, HookEntry[]> => {
    return new Map(hookRegistry);
  };

  return {
    register,
    get,
    clear,
    getAll,
  };
};

/**
 * Register a hook at a specific outlet
 *
 * @example
 * ```ts
 * // In a plugin or module
 * export default defineNuxtPlugin(() => {
 *   registerHook({
 *     name: 'product.summary.afterPrice',
 *     id: 'trust-badge',
 *     renderer: TrustBadge,
 *     priority: 5
 *   });
 * });
 * ```
 */
export const registerHook = <T extends HookName>(options: {
  name: T;
  id: string;
  renderer: Component | ((ctx: HookContext<T>) => VNode | VNode[] | null);
  priority?: number;
  when?: (ctx: HookContext<T>) => boolean;
  source?: string;
}): void => {
  const hooks = useHooks();

  // Auto-detect source from stack trace in dev mode
  let source = options.source;
  if (!source && process.dev) {
    try {
      const stack = new Error().stack;
      const match = stack?.match(/at.*\((.*?):\d+:\d+\)/);
      if (match && match[1]) {
        const filePath = match[1];
        const fileName = filePath.split('/').pop();
        source = fileName || 'unknown';
      }
    } catch (e) {
      // Ignore errors in source detection
    }
  }

  hooks.register({
    ...options,
    source: source || 'custom-plugin',
  });
};

/**
 * Register multiple hooks at once
 *
 * @example
 * ```ts
 * registerHooks([
 *   {
 *     name: 'product.summary.afterPrice',
 *     id: 'trust-badge',
 *     renderer: TrustBadge
 *   },
 *   {
 *     name: 'cart.summary.afterTotals',
 *     id: 'cart-upsell',
 *     renderer: CartUpsell
 *   }
 * ]);
 * ```
 */
export const registerHooks = (
  hooks: Array<{
    name: HookName;
    id: string;
    renderer: Component | ((ctx: any) => VNode | VNode[] | null);
    priority?: number;
    when?: (ctx: any) => boolean;
    source?: string;
  }>,
): void => {
  hooks.forEach((hook) => registerHook(hook as any));
};
