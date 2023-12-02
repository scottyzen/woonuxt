<script setup>
const props = defineProps({
  product: { type: Object, default: null },
});
</script>

<template>
  <div class="flex flex-wrap gap-32 items-start">
    <div class="flex max-w-sm gap-4 prose">
      <ReviewsScore v-if="product.reviews" :reviews="product.reviews" :productId="product.databaseId" />
    </div>
    <div class="divide-y flex-1" v-if="product.reviews?.edges && product.reviews.edges.length">
      <div v-for="review in product.reviews.edges" :key="review.id" class="my-2 py-8">
        <div class="flex gap-4 items-center">
          <img v-if="review.node.author.node.avatar" :src="review.node.author.node.avatar.url" class="rounded-full h-12 w-12" />
          <div class="grid gap-1">
            <div class="text-sm">
              <span class="font-semibold">{{ review.node.author.node.name }}</span>
              <span class="italic text-gray-400">
                – {{ new Date(review.node.date).toLocaleString($t('messages.general.langCode'), { month: 'long', day: 'numeric', year: 'numeric' }) }}</span
              >
            </div>
            <StarRating :rating="review.rating" :hide-count="true" class="text-sm" />
          </div>
        </div>
        <div class="mt-4 text-gray-700 italic prose-sm" v-html="review.node.content"></div>
      </div>
    </div>
  </div>
</template>
