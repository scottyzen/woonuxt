<script setup lang="ts">
const { decodeURI } = useHelpers();
const props = defineProps({
  node: { type: Object, required: true },
});
</script>

<template>
  <NuxtLink :to="`/product-category/${decodeURI(node.slug)}`" class="relative flex justify-center overflow-hidden border border-white rounded-xl item snap-mandatory snap-x">
    <NuxtImg
      width="220"
      height="280"
      class="absolute inset-0 object-cover w-full h-full"
      :src="node.image?.sourceUrl || '/images/placeholder.jpg'"
      :alt="node.name"
      loading="lazy"
      fit="outside"
      format="webp"
      densities="x1 x2" />
    <div class="absolute inset-x-0 bottom-0 opacity-50 bg-gradient-to-t from-black to-transparent h-1/2"></div>
    <span class="relative z-10 mt-auto mb-2 text-sm font-semibold text-white capitalize md:text-base md:mb-4">{{ node.name }}</span>
  </NuxtLink>
</template>

<style lang="postcss" scoped>
.item {
  scroll-snap-align: start;
  scroll-snap-stop: always;
  aspect-ratio: 4 / 5;
}
</style>
