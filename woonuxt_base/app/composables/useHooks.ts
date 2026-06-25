import type { Component, VNode } from 'vue';
import { HOOKS, ALL_HOOK_NAMES, type AllHookNames } from './hookConstants';

export type HookRenderResult = VNode | VNode[] | null;
export type HookRenderFunction<T extends HookName> = (ctx: HookContext<T>) => HookRenderResult;

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
  /** The component to render with the hook context as a ctx prop */
  component?: Component;
  /** Custom render function for advanced hook output */
  render?: (ctx: any) => HookRenderResult;
  /** Internal registration order for stable same-priority sorting */
  order: number;
  /** Source module/plugin name for debugging */
  source?: string;
}

/**
 * Context types for different hook locations
 * Mapped from the HOOKS constants to ensure single source of truth
 */
export interface HookContextMap {
  // Layout hooks
  [HOOKS.layout.header.beforeNav]: Record<string, never>;
  [HOOKS.layout.footer.bottom]: Record<string, never>;

  // Product page hooks
  [HOOKS.product.summary.beforeTitle]: { product: any };
  [HOOKS.product.summary.afterPrice]: { product: any };
  [HOOKS.product.tabs.after]: { product: any };

  // Checkout hooks
  [HOOKS.checkout.review.after]: { checkout: any };
}

/**
 * Hook names that can be used in the system
 * Derived from HookContextMap keys and validated against constants
 */
export type HookName = keyof HookContextMap;

/**
 * Get the context type for a specific hook name
 */
export type HookContext<T extends HookName> = HookContextMap[T];

interface RegisterHookBase<T extends HookName> {
  /** Hook location name */
  name: T;
  /** Unique identifier for this hook entry */
  id: string;
  /** Priority for sorting (lower numbers execute first, default: 10) */
  priority?: number;
  /** Conditional function to determine if hook should render */
  when?: (ctx: HookContext<T>) => boolean;
  /** Source module/plugin name for debugging */
  source?: string;
}

export type RegisterHookComponentOptions<T extends HookName> = RegisterHookBase<T> & {
  /** Component rendered with the hook context as a ctx prop */
  component: Component;
  render?: never;
};

export type RegisterHookRenderOptions<T extends HookName> = RegisterHookBase<T> & {
  /** Custom render function for advanced hook output */
  render: HookRenderFunction<T>;
  component?: never;
};

/**
 * Options for registering a hook
 */
export type RegisterHookOptions<T extends HookName> = RegisterHookComponentOptions<T> | RegisterHookRenderOptions<T>;
export type AnyRegisterHookOptions = { [Name in HookName]: RegisterHookOptions<Name> }[HookName];

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
let hookRegistrationOrder = 0;

/**
 * Composable for managing WooNuxt hooks
 * Provides registration, retrieval, and management of hook entries
 */
export const useHooks = (): HookRegistry => {
  /**
   * Register a new hook entry
   */
  const register = <T extends HookName>(options: RegisterHookOptions<T>): void => {
    const { name, id, priority = 10, when, source } = options;

    // Get existing entries for this hook name
    const entries = hookRegistry.get(name) || [];

    const hasComponent = 'component' in options && Boolean(options.component);
    const hasRender = 'render' in options && Boolean(options.render);
    if (!hasComponent && !hasRender) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(
          `[useHooks] Hook "${id}" for "${name}" must provide either a component or render function.` +
            (source ? ` Source: ${source}.` : '') +
            ' This registration will be ignored.',
        );
      }
      return;
    }

    // Check for duplicate IDs
    const isDuplicate = entries.some((entry) => entry.id === id);
    if (isDuplicate) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(
          `[useHooks] Duplicate hook id "${id}" detected for hook "${name}".` + (source ? ` Source: ${source}.` : '') + ' This registration will be ignored.',
        );
      }
      return;
    }

    // Create the hook entry
    const entry: HookEntry = {
      id,
      priority,
      when,
      component: 'component' in options ? options.component : undefined,
      render: 'render' in options ? options.render : undefined,
      order: hookRegistrationOrder++,
      source: source || 'unknown',
    };

    // Add to registry
    entries.push(entry);

    // Sort by priority (lower first), then by registration order.
    entries.sort((a, b) => {
      if (a.priority !== b.priority) {
        return (a.priority ?? 10) - (b.priority ?? 10);
      }
      return a.order - b.order;
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
 * // In hooks/product.ts
 * import { registerHook, HOOKS } from '~/composables/useHooks'
 *
 * export default () => {
 *   registerHook({
 *     name: HOOKS.product.summary.afterPrice,
 *     id: 'trust-badge',
 *     component: TrustBadge,
 *     priority: 5
 *   });
 * };
 * ```
 */
export const registerHook = <T extends HookName>(options: RegisterHookOptions<T>): void => {
  const hooks = useHooks();

  // Auto-detect source from stack trace in dev mode
  let source = options.source;
  if (!source && import.meta.dev) {
    try {
      const stack = new Error().stack;
      const match = stack?.match(/at.*\((.*?):\d+:\d+\)/);
      if (match && match[1]) {
        const filePath = match[1];
        const fileName = filePath.split('/').pop();
        source = fileName || 'unknown';
      }
    } catch {
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
 *     name: HOOKS.product.summary.afterPrice,
 *     id: 'trust-badge',
 *     component: TrustBadge
 *   },
 *   {
 *     name: HOOKS.checkout.review.after,
 *     id: 'checkout-message',
 *     component: CheckoutMessage
 *   }
 * ]);
 * ```
 */
export const registerHooks = (hooks: AnyRegisterHookOptions[]): void => {
  hooks.forEach((hook) => registerHook(hook as never));
};

/**
 * Re-export hook constants for easy access throughout the app
 */
export { HOOKS, ALL_HOOK_NAMES, type AllHookNames } from './hookConstants';
