<script setup lang="ts">
const props = defineProps<{ order: Order }>();

const readableStatus = computed(() => props.order?.status?.replace(/_/g, ' ') || '');
</script>

<template>
  <span :class="`order-${order?.status}`" class="order-status">{{ readableStatus }}</span>
</template>

<style lang="postcss" scoped>
.order-status {
  @apply border rounded-md font-semibold bg-gray-100 text-xs leading-none p-1.5 inline-block;
}

.order-COMPLETED {
  @apply bg-green-50 border-green-100 text-green-600;
}

.order-CANCELLED {
  @apply bg-red-50 border-red-100 text-red-600;
}

.order-PENDING {
  @apply bg-yellow-50 border-yellow-100 text-yellow-600;
}

.order-PROCESSING {
  @apply bg-blue-50 border-blue-100 text-blue-600;
}
</style>
