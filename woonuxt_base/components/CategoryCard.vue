<script setup lang="ts">
const { fallbackImage } = useHelpers();
const props = defineProps({
  node: { type: Object, required: true },
  imageLoading: { type: String as PropType<'lazy' | 'eager'>, default: 'lazy' },
});

const imageWidth = 220;
const ImageHeight = Math.round(imageWidth * 1.25);
</script>

<template>
  <NuxtLink
    v-if="node"
    :to="`/product-category/${decodeURIComponent(node.slug)}`"
    class="relative flex justify-center overflow-hidden border border-white rounded-xl item snap-mandatory snap-x">
    <NuxtImg
      :width="imageWidth"
      :height="ImageHeight"
      class="absolute inset-0 object-cover w-full h-full"
      :src="node.image?.sourceUrl || fallbackImage"
      :alt="node.image?.altText || node.name"
      :title="node.image?.title || node.name"
      :loading="imageLoading"
      placeholder
      placeholder-class="blur-xl" />
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
