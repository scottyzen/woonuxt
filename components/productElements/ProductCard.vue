<script setup>
const route = useRoute();
const props = defineProps({
  node: { type: Object, default: null },
  index: { type: Number, default: 1 },
});

const imgWidth = 400;
const imgHeight = 500;
const mainImage = ref(props.node?.image?.sourceUrl || '/images/placeholder.jpg');

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

const colorVariableImage = computed(async () => {
  if (paColor.value.length) {
    const activeColorImage = props.node?.variations?.nodes.filter((variation) => paColor.value.some((color) => variation.slug.includes(color)));
    if (activeColorImage && activeColorImage.length) {
      const image = activeColorImage[0]?.image?.sourceUrl;
      // check if image url returns 200
      // const response = await fetch(image);
      // if (response.ok) return image;
      try {
        const response = await fetch(image);
        console.log(response);
        if (response.ok) return image;
      } catch (error) {
        console.log(error);
      }
    }
  }
  return null;
});

watch(
  () => colorVariableImage.value,
  () => {
    if (colorVariableImage.value) {
      mainImage.value = colorVariableImage.value;
    } else {
      mainImage.value = props.node?.image?.sourceUrl || '/images/placeholder.jpg';
    }
  }
);

const fallbackIf404 = () => {
  if (mainImage.value === '/images/placeholder.jpg') return;
  const img = new Image();
  img.src = mainImage.value;
  img.onload = () => {
    if (img.naturalWidth === 404) {
      mainImage.value = '/images/placeholder.jpg';
    }
  };
};
</script>

<template>
  <NuxtLink :to="`/product/${node.slug}`" class="relative product-card">
    <SaleBadge :node="node" class="absolute top-2 right-2" />
    <NuxtImg
      v-if="mainImage"
      :width="imgWidth"
      :height="imgHeight"
      :src="mainImage"
      :alt="node.image?.altText || node.name"
      :title="node.image?.title || node.name"
      :loading="index <= 1 ? 'eager' : 'lazy'"
      format="webp"
      @load="fallbackIf404" />

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
