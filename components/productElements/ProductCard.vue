<script setup>
const route = useRoute();
const props = defineProps({
  node: { type: Object, default: null },
  index: { type: Number, default: 1 },
});

const fallbackImage = '/images/placeholder.jpg';
const imgWidth = 400;
const imgHeight = 500;

// example: ?filter=pa_color[green,blue],pa_size[large]
const filterQuery = ref(route.query.filter);
const paColor = ref(filterQuery.value?.split('pa_color[')[1]?.split(']')[0]?.split(',') || []);

// watch filterQuery
watch(
  () => route.query,
  () => {
    filterQuery.value = route.query.filter;
    paColor.value = filterQuery.value?.split('pa_color[')[1]?.split(']')[0]?.split(',') || [];
  }
);

const mainImage = computed(() => props.node?.image?.sourceUrl);

const colorVariableImage = computed(() => {
  if (paColor.value.length) {
    const activeColorImage = props.node?.variations?.nodes.filter((variation) => paColor.value.some((color) => variation.slug.includes(color)));
    if (activeColorImage && activeColorImage.length) {
      return activeColorImage[0].image?.sourceUrl;
    }
  }
  return null;
});
</script>

<template>
  <NuxtLink :to="`/product/${node.slug}`" class="relative product-card">
    <SaleBadge :node="node" class="absolute top-2 right-2" />
    <img
      v-if="colorVariableImage"
      :src="colorVariableImage"
      :alt="node.image?.altText || node.name"
      :title="node.image?.title || node.name"
      :loading="index <= 1 ? 'eager' : 'lazy'" />
    <NuxtImg
      v-else
      :width="imgWidth"
      :height="imgHeight"
      :src="mainImage || fallbackImage"
      :alt="node.image?.altText || node.name"
      :title="node.image?.title || node.name"
      :loading="index <= 1 ? 'eager' : 'lazy'"
      format="webp" />

    <div class="p-2">
      <StarRating :rating="node.averageRating" :count="node.reviewCount" />
      <h2 class="mb-2 font-light leading-tight">{{ node.name }}</h2>
      <ProductPrice class="text-sm" :sale-price="node.salePrice" :regular-price="node.regularPrice" />
    </div>
  </NuxtLink>
</template>

<style lang="postcss">
.product-card img {
  @apply rounded-lg object-top object-cover w-full;
  aspect-ratio: 1/1.125;
}
</style>
