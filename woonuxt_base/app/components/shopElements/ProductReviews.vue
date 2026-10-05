<script setup>
const props = defineProps({
  product: { type: Object, default: null },
});
</script>
<template>
  <div class="flex flex-wrap gap-32 items-start mt-8">
    <div class="flex max-w-sm gap-4 prose">
      <ReviewsScore v-if="product.reviews" :reviews="product.reviews" :product-id="product.databaseId" />
    </div>

    <div v-if="product.reviews?.edges && product.reviews.edges.length" class="divide-y border-color flex-1">
      <!-- 1. Filter out rating === 0 so replies don't render twice as top-level reviews -->
      <div v-for="review in product.reviews.edges.filter((e) => e.rating > 0)" :key="review.node.id" class="my-2 py-8">
        <!-- Parent Review Header -->
        <div class="flex gap-4 items-center">
          <img
            v-if="review.node.author?.node?.avatar"
            :src="review.node.author.node.avatar.url"
            :alt="review.node.author?.node?.name || 'Reviewer avatar'"
            class="rounded-full h-12 w-12" />
          <div class="grid gap-1">
            <div class="text-sm">
              <span class="font-semibold">{{ review.node.author?.node?.name }}</span>
              <span class="italic alt-text">
                - {{ new Date(review.node.date).toLocaleString($t('general.langCode'), { month: 'long', day: 'numeric', year: 'numeric' }) }}
              </span>
            </div>
            <StarRating :rating="review.rating" :hide-count="true" class="text-sm" />
          </div>
        </div>

        <!-- Parent Review Content -->
        <div class="mt-4 text-color italic prose-sm" v-html="review.node.content"></div>

        <!-- 2. Nested Replies Loop with Indentation -->
        <div v-if="review.node.replies?.nodes && review.node.replies.nodes.length" class="ml-6 sm:ml-10 mt-6 pl-4 sm:pl-6 border-l-2 border-gray-200 space-y-6">
          <div v-for="reply in review.node.replies.nodes" :key="reply.id" class="pt-2">
            <div class="flex gap-3 items-center">
              <img
                v-if="reply.author?.node?.avatar"
                :src="reply.author.node.avatar.url"
                :alt="reply.author?.node?.name || 'Reply author avatar'"
                class="rounded-full h-8 w-8" />
              <div class="text-xs">
                <span class="font-semibold">{{ reply.author?.node?.name }}</span>
                <span class="italic alt-text">
                  – {{ new Date(reply.date).toLocaleString($t('general.langCode'), { month: 'long', day: 'numeric', year: 'numeric' }) }}
                </span>
              </div>
            </div>

            <div class="mt-2 text-color italic prose-sm" v-html="reply.content"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
