<script setup lang="ts">
const { decodeURI } = useHelpers();
interface Props {
  node: ProductCategory;
}

const { node } = defineProps<Props>();
const imgWidth = 280;
const imgHeight = Math.round(imgWidth * 1.25);
</script>

<template>
  <NuxtLink :to="`/product-category/${decodeURI(node.slug)}`" class="relative flex justify-center overflow-hidden border border-white rounded-xl item snap-mandatory snap-x">
    <NuxtImg
      v-if="node.image?.sourceUrl"
      :width="imgWidth"
      :height="imgHeight"
      class="absolute inset-0 object-cover w-full h-full"
      :src="node.image?.sourceUrl || '/images/placeholder.jpg'"
      :alt="node.image?.altText || node.name"
      :title="node.image?.title || node.name"
      loading="lazy"
      fit="outside"
      format="webp"
      densities="x1 x2" />
    <div class="absolute inset-x-0 bottom-0 opacity-50 bg-gradient-to-t from-black to-transparent h-1/2" />
    <span class="relative z-10 mt-auto mb-2 text-sm font-semibold text-white capitalize md:text-base md:mb-4" v-html="node.name" />
  </NuxtLink>
</template>

<style lang="postcss" scoped>
.item {
  scroll-snap-align: start;
  scroll-snap-stop: always;
  aspect-ratio: 4 / 5;
}
</style>
