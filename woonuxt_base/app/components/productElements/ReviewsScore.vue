<script setup lang="ts">
const { viewer } = useAuth();

const props = defineProps({
  reviews: { type: Object, default: null },
  productId: { type: Number, default: null },
  reviewCount: { type: Number, default: null },
  size: { type: Number, default: 21 },
});

const numberAndPercentageOfEachRating = computed(() => {
  const ratings = [0, 0, 0, 0, 0];
  props.reviews.edges.forEach((review: any) => {
    const idx = review.rating - 1;
    if (idx >= 0 && idx < ratings.length) ratings[idx]!++;
  });
  const total = ratings.reduce((a: number, b: number) => a + b, 0);
  return ratings
    .map((count, index) => {
      const percentage = (count / total) * 100;
      return { count, percentage, rating: index + 1 };
    })
    .reverse();
});

const show = ref(false);
const hovered = ref(0);
const rating = ref<number | null>(null);
const content = ref('');
const authorNameInput = ref('');
const authorEmailInput = ref('');
const viewerName = computed(() => {
  if (!viewer.value) return '';
  return (
    `${viewer.value.firstName ?? ''} ${viewer.value.lastName ?? ''}`.trim() ||
    viewer.value.username ||
    viewer.value.nicename ||
    viewer.value.email?.split('@')[0] ||
    ''
  );
});
const viewerEmail = computed(() => viewer.value?.email || '');
const needsAuthorNameInput = computed(() => !viewerName.value);
const needsAuthorEmailInput = computed(() => !viewerEmail.value);
const authorName = computed(() => viewerName.value || authorNameInput.value);
const authorEmail = computed(() => viewerEmail.value || authorEmailInput.value);
const errorMessage = ref('');
const successMessage = ref('');
const isPending = ref(false);
let successTimer: ReturnType<typeof setTimeout> | null = null;
let errorTimer: ReturnType<typeof setTimeout> | null = null;

onUnmounted(() => {
  if (successTimer) clearTimeout(successTimer);
  if (errorTimer) clearTimeout(errorTimer);
});

function setHovered(i: number) {
  hovered.value = i;
}

function resetHovered() {
  hovered.value = 0;
}

async function addComment() {
  const variables = {
    commentOn: props.productId,
    author: authorName.value,
    content: content.value,
    rating: rating.value,
    authorEmail: authorEmail.value,
  };
  try {
    if (!rating.value) return;
    isPending.value = true;
    await GqlWriteReview({ ...variables, rating: rating.value });
    successMessage.value = 'Your review is awaiting approval';
    successTimer = setTimeout(() => {
      successMessage.value = '';
      show.value = false;
    }, 4000);
  } catch (error: any) {
    errorMessage.value = error?.gqlErrors?.[0].message;
    errorTimer = setTimeout(() => {
      errorMessage.value = '';
    }, 5000);
  } finally {
    isPending.value = false;
  }
}
</script>

<template>
  <div>
    <h4 v-if="reviewCount" class="font-semibold text-2xl text-gray-900">{{ $t('shop.customerReviews') }}</h4>
    <h4 v-else class="font-semibold text-2xl text-gray-900">{{ $t('shop.noReviews') }}</h4>
    <div v-if="reviewCount" class="my-2">
      <StarRating :rating="reviews.averageRating" :hide-count="true" class="text-sm mr-2" />
      <span class="text-sm"> {{ $t('general.basedOn') }} {{ reviewCount }} {{ $t('shop.reviews') }}</span>
    </div>
    <div class="my-4 bars">
      <div v-for="ratingBar in numberAndPercentageOfEachRating" :key="ratingBar.rating" class="flex gap-4 items-center">
        <div class="flex text-sm gap-1 items-center">
          {{ ratingBar.rating }}
          <Icon class="text-yellow-400" name="ion:star" />
        </div>
        <div class="flex-1 relative">
          <div class="rounded-full bg-gray-200 h-2.5 w-full"></div>
          <div class="rounded-full bg-yellow-400 h-2.5 top-0 left-0 absolute" :style="{ width: ratingBar.percentage + '%' }"></div>
        </div>
      </div>
    </div>
    <div class="mt-10 text-xl mb-2 text-gray-900 font-semibold">Share your thoughts</div>
    <div class="text-sm mb-4 text-gray-600">If you have used this product, we would love to hear about your experience.</div>
    <Button variant="outline" class="w-full mb-4" @click="show = !show">
      {{ show ? $t('shop.close') : $t('shop.writeReview') }}
    </Button>
    <transition class="ease-in-out transform transition-all" name="scale-y">
      <form v-if="show" class="writeReview" @submit.prevent="addComment">
        <div class="w-full text-gray-500">
          <div class="p-5 mt-3 grid gap-2 border border-gray-300 rounded-lg bg-gray-50">
            <div class="block text-center mb-1.5">
              <label class="text-center text-sm block relative m-auto">{{ $t('shop.rateReview') }} <span class="text-red-500">*</span></label>
              <div class="gap-1 flex justify-center mt-2 relative">
                <label
                  v-for="i in 5"
                  :key="i"
                  class="grid p-1 rounded-sm"
                  :class="(rating ?? 0) < i && i > hovered ? 'disable-star' : 'checked-star'"
                  @mouseover="setHovered(i)"
                  @mouseout="resetHovered">
                  <input v-model="rating" type="radio" class="overflow-hidden hidden appearance-none opacity-0 absolute" name="rating" :value="i" required />
                  <Icon name="ion:star" :size="size + ''" />
                </label>
              </div>
            </div>
            <div class="w-full col-span-full">
              <label for="content" class="text-sm mb-0.5">{{ $t('shop.rateContent') }} <span class="text-red-500">*</span></label>
              <textarea id="content" v-model="content" class="w-full" placeholder="Great Quality" required></textarea>
            </div>
            <div v-if="needsAuthorNameInput" class="w-full col-span-full">
              <label for="authorName" class="text-sm mb-0.5">{{ $t('shop.rateName') }} <span class="text-red-500">*</span></label>
              <input id="authorName" v-model="authorNameInput" class="w-full" placeholder="Jane Doe" type="text" required />
            </div>
            <div v-if="needsAuthorEmailInput" class="w-full col-span-full">
              <label for="author" class="text-sm mb-0.5">{{ $t('shop.rateEmail') }} <span class="text-red-500">*</span></label>
              <input
                id="author"
                v-model="authorEmailInput"
                class="w-full"
                placeholder="example@example.com"
                type="email"
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                required />
            </div>
            <Transition name="scale-y" mode="out-in">
              <div v-if="errorMessage" class="my-4 text-sm text-red-500" v-html="errorMessage"></div>
            </Transition>
            <Transition name="scale-y" mode="out-in">
              <div v-if="successMessage" class="my-4 text-sm text-green-500" v-html="successMessage"></div>
            </Transition>
            <div class="w-full col-span-full text-center mt-3">
              <Button :loading="isPending" type="submit" variant="primary" class="w-full">
                {{ $t('shop.submit') }}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </transition>
  </div>
</template>

<style scoped>
@reference "#tailwind";

.disable-star {
  @apply bg-white  shadow-xs text-gray-300  border border-gray-300;
  transition: 0.15s ease-in-out;
}
.checked-star {
  @apply text-amber-400 bg-amber-50  border border-amber-400;
  transition: 0.15s ease-in-out;
  box-shadow: 0 0px 4px 0 rgb(249 191 59 / 21%);
}
.writeReview input,
.writeReview textarea {
  @apply bg-white  border rounded-md outline-hidden border-gray-300  shadow-inner w-full py-2 px-4 text-gray-900  placeholder:text-gray-400;
}

.writeReview input:focus,
.writeReview textarea:focus {
  @apply ring-2 ring-primary/20 border-primary;
}
</style>
