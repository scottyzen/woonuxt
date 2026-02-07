<script setup lang="ts">
import type { WooNuxtSEOItem } from '#types/gql';

const { wooNuxtSEO } = useHelpers();
const seoItems = computed(() => (wooNuxtSEO as WooNuxtSEOItem[] | undefined) ?? []);
</script>

<template>
  <div v-if="seoItems.length" class="flex gap-4 text-xl">
    <a v-for="item in seoItems" :key="item.provider" :href="item.url" target="_blank" rel="noreferrer" :aria-label="item.provider">
      <Icon class="text-gray-700 hover:text-gray-900" :name="`ion:logo-${item.provider}`" />
    </a>
  </div>
</template>
