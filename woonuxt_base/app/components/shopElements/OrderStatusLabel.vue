<script setup lang="ts">
const props = defineProps<{ order: Order }>();

const readableStatus = computed(() => props.order?.status?.replace(/_/g, ' ') || '');
</script>

<template>
  <span :class="`order-${order?.status}`" class="order-status">{{ readableStatus }}</span>
</template>

<style scoped>
@reference "#tailwind";

.order-status {
  @apply border rounded-md font-semibold bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 text-xs leading-none p-1.5 inline-block;
}

.order-COMPLETED {
  @apply bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800 text-green-600 dark:text-green-400;
}

.order-CANCELLED {
  @apply bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800 text-red-600 dark:text-red-400;
}

.order-PENDING {
  @apply bg-yellow-50 dark:bg-yellow-900/20 border-yellow-100 dark:border-yellow-800 text-yellow-600 dark:text-yellow-400;
}

.order-PROCESSING {
  @apply bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400;
}
</style>
