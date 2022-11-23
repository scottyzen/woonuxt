<template>
  <NuxtLink :to="{ name: 'product-slug', params: { slug: node.slug, page: page } }" class="relative">
    <SaleBadge :node="node" class="top-2 right-2 absolute" />

    <NuxtPicture v-if="image" width="280" height="300" :src="image" :alt="node.image.altText || node.name" :title="node.image.title || node.name" :loading="index <= 1 || index == 5 ? 'eager' : 'lazy'" format="avif"
      :imgAttrs="{ class: 'rounded-xl object-top object-cover w-full product-image' }" fit="outside" />

    <div class="p-2">
      <StarRating :rating="node.averageRating" :count="node.reviewCount" />
      <h2 class="font-light mb-2 leading-tight">{{ node.name }}</h2>
      <ProductPrice class="text-sm" :salePrice="node.salePrice" :regularPrice="node.regularPrice" />
    </div>
  </NuxtLink>
</template>

<script>
export default {
  props: {
    node: { type: Object, default: null },
    index: { type: Number, default: 1 },
    page: { type: Number, default: 1 },
  },
  computed: {
    image() {
      if (this.$store.state.filter?.colors?.length) {
        // If we have a color filter, we need to find the image that matches the color
        const activeColorImage = this.node.variations.nodes.filter((variation) => {
          return this.$store.state.filter.colors.some((color) => variation.slug.includes(color));
        });
        return activeColorImage ? activeColorImage[0].image.sourceUrl : this.node.image.sourceUrl;
      }
      return this.node.image.sourceUrl;
    },
  },
};
</script>

<style lang="postcss">
.product-image {
  aspect-ratio: 1/1.125;
}
</style>
