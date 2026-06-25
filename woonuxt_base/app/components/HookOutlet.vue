<script setup lang="ts" generic="T extends HookName">
import type { HookName, HookContext } from '../composables/useHooks';

interface Props {
  /** The name of the hook outlet */
  name: T;
  /** Context data to pass to hook components */
  ctx?: HookContext<T>;
}

const props = withDefaults(defineProps<Props>(), {
  ctx: () => ({}) as HookContext<T>,
});

const { get } = useHooks();

// Get all hook entries for this outlet
const entries = computed(() => {
  return get(props.name);
});

/**
 * Render a single hook component
 */
const renderEntry = (entry: any) => {
  return h(entry.component, { ctx: props.ctx });
};
</script>

<template>
  <div>
    <component :is="() => renderEntry(entry)" v-for="entry in entries" :key="entry.id" />
  </div>
</template>
