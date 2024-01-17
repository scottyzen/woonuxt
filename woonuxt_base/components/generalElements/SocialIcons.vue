<script setup lang="ts">
const { wooNuxtSEO } = useHelpers();
</script>

<template>
  <div v-if="wooNuxtSEO.length" class="flex gap-4 text-xl">
    <a v-for="item in wooNuxtSEO" :key="item.provider" :href="item.url" target="_blank" rel="noreferrer" :aria-label="item.provider">
      <Icon class="text-gray-700 hover:text-gray-900" :name="`ion:logo-${item.provider}`" />
    </a>
  </div>
</template>
