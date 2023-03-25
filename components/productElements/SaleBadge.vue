<script setup lang="ts">
const props = defineProps({
  node: { type: Object, default: null },
});

const salePercentage = computed((): number => {
  const salePrice = parseFloat(props.node.salePrice.replace(/[^0-9]/g, ''));
  const regularPrice = parseFloat(props.node.regularPrice.replace(/[^0-9]/g, ''));
  return Math.round(((salePrice - regularPrice) / regularPrice) * 100);
});
</script>

<template>
  <span v-if="node.salePrice" class="red-badge">{{ salePercentage }} %</span>
</template>

<style lang="postcss" scoped>
.red-badge {
  @apply rounded-md bg-red-400 text-xs text-white tracking-tight px-1.5 leading-6 z-10;
  background: #000 linear-gradient(0deg, #f87171, #f87171);
}
</style>
