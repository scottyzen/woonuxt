<script setup>
const props = defineProps({
  product: { type: Object, default: null },
});

const show = ref(0);
</script>

<template>
  <div>
    <nav class="border-b flex gap-8 tabs">
      <a :class="show === 0 ? 'active' : ''" @click.prevent="show = 0">{{ $t('messages.shop.productDescription') }}</a>
      <a :class="show === 1 ? 'active' : ''" @click.prevent="show = 1">{{ $t('messages.shop.reviews') }} ({{ product.reviewCount }})</a>
    </nav>
    <div class="tab-contents">
      <div v-if="show === 0" class="font-light mt-8 prose" v-html="product.description"></div>
      <div v-if="show === 1">
        <div class="flex flex-wrap gap-32 items-start">
          <div class="flex max-w-sm gap-4 prose">
            <ReviewsScore :reviews="product.reviews" />
          </div>
          <div class="divide-y flex-1">
            <div v-for="review in product.reviews.edges" :key="review.id" class="my-2 py-8">
              <div class="flex gap-4 items-center">
                <img
                  v-if="review.node.author.node.avatar"
                  :src="review.node.author.node.avatar.url"
                  class="rounded-full h-12 w-12" />
                <div class="grid gap-1">
                  <span class="font-semibold text-sm">{{ review.node.author.node.name }}</span>
                  <StarRating :rating="review.rating" :hide-count="true" class="text-sm" />
                </div>
              </div>
              <div class="mt-4 text-gray-700 italic prose-sm" v-html="review.node.content"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss">
.tabs a {
  @apply border-transparent border-b-2 text-lg pb-8;
  margin-bottom: -1px;
}

.tabs a.active {
  @apply border-primary text-primary;
}
</style>
