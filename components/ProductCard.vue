<template>
  <NuxtLink :to="{ name: 'product-slug', params: { slug: node.slug, page: page } }" class="relative">
    <SaleBadge :node="node" class="top-2 right-2 absolute" />

    <NuxtPicture v-if="image" width="300" :src="image" :alt="node.image.altText || node.name" :title="node.image.title || node.name" :loading="index <= 1 || index == 5 ? 'eager' : 'lazy'" format="avif"
      :imgAttrs="{ class: 'rounded-xl object-top object-cover w-full' }" fit="outside" />

    <div class="py-3">
      <h2 class="text-base">{{ node.name }}</h2>
      <div v-if="node.reviewCount !== 0" class="flex my-1 text-sm">
        <svg
          v-for="i in 5"
          :key="i"
          :fill="node.averageRating < i ? '#d8d8d8' : '#FBBE24'"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 576 512"
          class="mr-1 w-3"
        >
          <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/>
        </svg>
        <span class="text-[#999] ml-1">({{node.reviewCount}})</span>
      </div>
      <div v-if="node.salePrice" class="flex-col flex">
        <div class="flex justify-between flex-row items-baseline">
          <div class="flex flex-row items-baseline">
            <p class="text-lg font-bold text-[#eb0037]">{{ node.salePrice }}</p>
          </div>
        </div>
        <div class="flex-wrap items-baseline flex-row flex text-sm leading-2">
          <p class="text-[#66676e]">Originally:</p>
          <p class="text-[#66676e] ml-1 line-through">
            {{ node.regularPrice }}
          </p>
          <p class="text-[#eb0037] ml-1">
            {{Math.round(((parseFloat(node.salePrice.replace(/[^0-9]/g, "")) - parseFloat(node.regularPrice.replace(/[^0-9]/g, ""))) / parseFloat(node.regularPrice.replace(/[^0-9]/g, ""))) * 100)
            }}%
          </p>
        </div>
      </div>
      <div v-else class="flex justify-between flex-row items-baseline">
        <div class="flex flex-row items-baseline">
          <p class="text-lg font-bold text-[#333]">{{ node.regularPrice }}</p>
        </div>
      </div>
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
