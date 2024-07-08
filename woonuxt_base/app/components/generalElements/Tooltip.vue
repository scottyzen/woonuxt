<script setup lang="ts">
const { text } = defineProps({ text: { type: String, required: true } });
</script>

<template>
  <div class="relative inline-block group">
    <!-- Slot for the element the tooltip is attached to -->
    <slot></slot>
    <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-4 invisible group-hover:visible opacity-0 group-hover:opacity-100 bg-black bg-opacity-80 text-white text-sm rounded px-2 py-2 transition-opacity duration-300 whitespace-nowrap">
      {{ text }}
      <div class="absolute left-1/2 transform -translate-x-1/2 top-full w-0 h-0 border-8 border-transparent border-t-black border-t-opacity-80"></div>
    </div>
  </div>
</template>
