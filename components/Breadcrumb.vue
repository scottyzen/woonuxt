<template>
  <div class="flex gap-1 items-center leading-none text-gray-400 text-sm">
    <!-- {{ format }} -->
    <span v-for="(link, i) in format" :key="link.name">
      <NuxtLink v-if="link.slug" :to="link.slug" class="hover:text-primary">{{ link.name }}</NuxtLink>
      <span v-else class="text-gray-800">{{ link.name }}</span>
      <span v-if="i + 1 < format.length">/</span>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    format: { type: Array, default: [] },
  },
};
</script>

<style></style>
