<script setup>
const props = defineProps({
  reviews: { type: Object, default: null },
  productId: { type: Number, default: null },
  size: { type: Number, default: 21 },
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

const show = ref(false);
const hovered = ref(0);
const rating = ref(null);
const content = ref(null);
const authorEmail = ref(null);
const errorMessage = ref('');
const successMessage = ref('');
const isPending = ref(false);

function setHovered(i) {
  hovered.value = i;
}

function resetHovered() {
  hovered.value = 0;
}

async function addComment() {
  const variables = {
    commentOn: props.productId,
    author: authorEmail.value.split('@')[0],
    content: content.value,
    rating: rating.value,
    authorEmail: authorEmail.value,
  };
  try {
    isPending.value = true;
    await GqlWriteReview(variables);
    successMessage.value = 'Your review is awaiting approval';
    setTimeout(() => {
      successMessage.value = '';
      show.value = false;
    }, 4000);
  } catch (error) {
    errorMessage.value = error?.gqlErrors?.[0].message;
    setTimeout(() => {
      errorMessage.value = '';
    }, 5000);
  } finally {
    isPending.value = false;
  }
}
</script>

<template>
  <div>
    <h4 v-if="reviews.edges.length" class="font-semibold text-2xl text-gray-900">{{ $t('messages.shop.customerReviews') }}</h4>
    <h4 v-else class="font-semibold text-2xl text-gray-900">{{ $t('messages.shop.noReviews') }}</h4>
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
    <button @click="show = !show" class="border rounded-lg text-center w-full p-2">
      {{ show ? $t('messages.shop.close') : $t('messages.shop.writeReview') }}
    </button>
    <transition class="ease-in-out transform transition-all" name="scale-y">
      <form v-if="show" @submit.prevent="addComment" class="writeReview">
        <div class="w-full text-gray-500">
          <div class="p-5 mt-3 grid gap-2 border rounded-lg">
            <div class="block text-center mb-1.5">
              <label class="text-center text-sm block relative m-auto">{{ $t('messages.shop.rateReview') }} <span class="text-red-500">*</span></label>
              <div class="gap-1 flex justify-center mt-2 relative">
                <label
                  v-for="i in 5"
                  :key="i"
                  class="grid p-1 rounded"
                  :class="rating < i && i > hovered ? 'disable-star' : 'checked-star'"
                  @mouseover="setHovered(i)"
                  @mouseout="resetHovered">
                  <input type="radio" class="overflow-hidden appearance-none opacity-0 absolute" name="rating" :value="i" v-model="rating" required />
                  <Icon name="ion:star" :size="size + ''" />
                </label>
              </div>
            </div>
            <div class="w-full col-span-full">
              <label for="content" class="text-sm mb-0.5">{{ $t('messages.shop.rateContent') }} <span class="text-red-500">*</span></label>
              <textarea class="w-full" id="content" placeholder="Great Quality" v-model="content" required></textarea>
            </div>
            <div class="w-full col-span-full">
              <label for="author" class="text-sm mb-0.5">{{ $t('messages.shop.rateEmail') }} <span class="text-red-500">*</span></label>
              <input
                class="w-full"
                id="author"
                placeholder="example@example.com"
                type="email"
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                v-model="authorEmail"
                required />
            </div>
            <Transition name="scale-y" mode="out-in">
              <div v-if="errorMessage" class="my-4 text-sm text-red-500" v-html="errorMessage"></div>
            </Transition>
            <Transition name="scale-y" mode="out-in">
              <div v-if="successMessage" class="my-4 text-sm text-green-500" v-html="successMessage"></div>
            </Transition>
            <div class="w-full col-span-full text-center mt-3">
              <button
                class="flex gap-4 justify-center items-center transition font-semibold rounded-md w-full p-2 bg-amber-300 text-amber-900 hover:bg-amber-400"
                type="submit">
                <LoadingIcon v-if="isPending" stroke="4" size="16" color="#78350F" />
                <span>{{ $t('messages.shop.submit') }}</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </transition>
  </div>
</template>

<style lang="postcss" scoped>
.disable-star {
  @apply bg-white shadow-sm text-gray-300 border border-gray-300;
  transition: 0.15s ease-in-out;
}
.checked-star {
  @apply text-amber-400 bg-amber-50 border border-amber-400;
  transition: 0.15s ease-in-out;
  box-shadow: 0 0px 4px 0 rgb(249 191 59 / 21%);
}
.writeReview input,
.writeReview textarea {
  @apply bg-white border rounded-md outline-none border-gray-300 shadow-sm w-full py-2 px-4;
}
</style>
