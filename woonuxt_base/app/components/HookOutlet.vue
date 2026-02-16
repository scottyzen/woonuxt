<script setup lang="ts" generic="T extends HookName">
import type { Component } from 'vue';
import type { HookName, HookContext } from '../composables/useHooks';

interface Props {
  /** The name of the hook outlet */
  name: T;
  /** Context data to pass to hook renderers */
  ctx?: HookContext<T>;
  /** Optional wrapper element or component */
  as?: string | Component;
  /** Whether this outlet is required (warns in dev if no hooks registered) */
  required?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  ctx: () => ({}) as HookContext<T>,
  as: 'div',
  required: false,
});

const { get } = useHooks();

// Warn in development if required outlet has no hooks
if (process.env.NODE_ENV !== 'production') {
  watchEffect(() => {
    if (props.required) {
      const allEntries = get(props.name);
      if (allEntries.length === 0) {
        console.warn(`[HookOutlet] Required outlet "${props.name}" has no hooks registered.`);
      }
    }
  });
}

// Get hook entries for this outlet
const entries = computed(() => {
  const allEntries = get(props.name);

  // Filter by when condition
  return allEntries.filter((entry: any) => {
    if (!entry.when) return true;
    try {
      return entry.when(props.ctx);
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`[HookOutlet] Error evaluating "when" condition for hook "${entry.id}" at outlet "${props.name}":`, error);
      }
      return false;
    }
  });
});

/**
 * Render a single hook entry
 */
const renderEntry = (entry: any) => {
  try {
    if (typeof entry.renderer === 'function') {
      return entry.renderer(props.ctx);
    }
    return h(entry.renderer, { ctx: props.ctx });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(`[HookOutlet] Error rendering hook "${entry.id}" at outlet "${props.name}":`, error);
    }
    return null;
  }
};
</script>

<template>
  <template v-if="entries.length > 0">
    <component :is="as">
      <component :is="() => renderEntry(entry)" v-for="entry in entries" :key="entry.id" />
    </component>
  </template>
</template>
