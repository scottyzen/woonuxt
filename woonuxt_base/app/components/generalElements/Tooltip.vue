<script setup lang="ts">
const { text } = defineProps({ text: { type: String, required: true } });
</script>

<template>
  <div class="relative inline-block group">
    <!-- Slot for the element the tooltip is attached to -->
    <slot></slot>
    <div
      class="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-4 invisible group-hover:visible opacity-0 group-hover:opacity-100 bg-gray-900 dark:bg-gray-700 bg-opacity-95 dark:bg-opacity-95 text-white text-sm rounded px-2 py-2 transition-opacity duration-300 whitespace-nowrap shadow-lg">
      {{ text }}
      <div
        class="absolute left-1/2 transform -translate-x-1/2 top-full w-0 h-0 border-8 border-transparent border-t-gray-900 dark:border-t-gray-700 opacity-95"></div>
    </div>
  </div>
</template>
