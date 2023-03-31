<script setup>
const props = defineProps({
  reviews: { type: Object, default: null },
  size: { type: Number, default: 24 }
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

const show = ref(false)
const hovered = ref(0);
const rating = ref(null)
const content = ref(null)
const authorEmail = ref(null)

function setRating(i) {
  rating.value = i;
}

function setHovered(i) {
  hovered.value = i;
}

function resetHovered() {
  hovered.value = 0;
}

async function addComment() {
  const variables = {
    commentOn: 97,
    author: authorEmail.value.split('@')[0],
    content: content.value,
    rating: rating.value,
    authorEmail: authorEmail.value
  }
  try {
    await GqlWriteReview(variables);
  } catch (error) {
    console.error(error)
  }
}
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
          <div class="rounded-full bg-yellow-400 h-2.5 top-0 left-0 absolute" :style="{ width: rating.percentage + '%' }"></div>
        </div>
      </div>
    </div>
    <div class="mt-10 text-xl mb-2 text-gray-900">Share your thoughts</div>
    <div class="text-sm mb-4">If you have used this product, we would love to hear about your experience.</div>
    <button @click="show = !show" class="border rounded-lg text-center w-full p-2">{{ show ? $t('messages.shop.close') : $t('messages.shop.writeReview') }}</button>
    <transition class="ease-in-out transform transition-all" name="form">
      <form v-if="show" @submit.prevent="addComment">
        <div>
          <Icon 
            v-for="i in 5" 
            :key="i" 
            name="ion:star" 
            @click="setRating(i)"
            @mouseover="setHovered(i)"
            @mouseout="resetHovered"
            :size="size + ''"
            :class="(rating < i && i > hovered) ? 'disable-star' : 'checked-star'"
          />
        </div>
        <br>
        <div>
          <label for="content">Comment:</label>
          <textarea id="content" v-model="content" required></textarea>
        </div>
        <br>
        <div>
          <label for="author">Your Email:</label>
          <input id="author" type="email" v-model="authorEmail" required>
        </div>
        <br>
        <button type="submit">Add Comment</button>
      </form>
    </transition>
  </div>
</template>

<style lang="postcss">
.form-enter-from,
.form-leave-to {
  @apply opacity-0 max-h-0;
  transition: opacity 0.25s ease-out, max-height 0.2s ease-out;
}

.form-enter-to,
.form-leave-from {
  @apply opacity-100 max-h-80;
  transition: opacity 0.25s ease-in-out, max-height 0.2s ease-in-out;
}
.disable-star {
  transition: 0.15s ease-in-out;
  color: #ccc;
}
.checked-star {
  transition: 0.15s ease-in-out;
  color: #F9BF3B;
	filter: drop-shadow(0 0 2px #F9BF3B);
}
</style>
