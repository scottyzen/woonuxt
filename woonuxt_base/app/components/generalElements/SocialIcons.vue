<script setup lang="ts">
import type { WooNuxtSEOItem } from '#types/gql';

const { wooNuxtSEO } = useHelpers();
const socialItems = computed(() =>
  ((wooNuxtSEO as WooNuxtSEOItem[] | undefined) ?? []).map((item) => {
    const provider = item.provider.toLowerCase();
    const isX = provider === 'x' || provider === 'twitter';

    return {
      ...item,
      icon: `ion:logo-${isX ? 'x' : provider}`,
      label: isX ? 'X' : item.provider,
    };
  }),
);
</script>

<template>
  <div v-if="socialItems.length" class="flex gap-4 text-xl">
    <a v-for="item in socialItems" :key="`${item.provider}-${item.url}`" :href="item.url" target="_blank" rel="noreferrer" :aria-label="item.label">
      <Icon class="text-gray-700 hover:text-gray-900" :name="item.icon" />
    </a>
  </div>
</template>
