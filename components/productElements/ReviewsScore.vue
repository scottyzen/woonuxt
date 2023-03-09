<script setup>
const props = defineProps({
  reviews: { type: Object, default: null },
});

const numberAndPercentageOfEachRating = computed(() => {
  const ratings = [0, 0, 0, 0, 0];
  props.reviews.edges.forEach((review) => {
    ratings[review.rating - 1] += 1;
  });
  const total = ratings.reduce((a, b) => a + b, 0);
  return ratings
    .map((count, index) => {
      const percentage = (count / total) * 100;
      return { count, percentage, rating: index + 1 };
    })
    .reverse();
});
</script>

<template>
  <div>
    <h4 v-if="reviews.edges.length" class="font-semibold text-sm text-2xl text-gray-900">{{ $t('messages.shop.customerReviews') }}</h4>
    <h4 v-else class="font-semibold text-sm text-2xl text-gray-900">{{ $t('messages.shop.noReviews') }}</h4>
    <div v-if="reviews.edges.length" class="my-2">
      <StarRating :rating="reviews.averageRating" :hide-count="true" class="text-sm mr-2" />
      <span class="text-sm"> {{ $t('messages.general.basedOn') }} {{ reviews.edges.length }} {{ $t('messages.shop.reviews') }}</span>
    </div>
    <div class="my-4 bars">
      <div v-for="rating in numberAndPercentageOfEachRating" :key="rating" class="flex gap-4 items-center">
        <div class="flex text-sm gap-1 items-center">
          {{ rating.rating }}
          <Icon class="text-yellow-400" name="ion:star" />
        </div>
        <div class="flex-1 relative">
          <div class="rounded-full bg-gray-200 h-2.5 w-full"></div>
          <div
            class="rounded-full bg-yellow-400 h-2.5 top-0 left-0 absolute"
            :style="{ width: rating.percentage + '%' }"></div>
        </div>
      </div>
    </div>
    <div class="mt-10 text-xl mb-2 text-gray-900">Share your thoughts</div>
    <div class="text-sm mb-4">If you have used this product, we would love to hear about your experience.</div>
    <button class="border rounded-lg text-center w-full p-2">{{ $t('messages.shop.writeReview') }}</button>
  </div>
</template>
