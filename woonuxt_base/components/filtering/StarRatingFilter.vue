<script setup>
const { getFilter, setFilter, isFiltersActive } = await useFiltering();
const selectedTerms = ref(getFilter('rating') || []);

const isOpen = ref(true);

watch(isFiltersActive, () => {
  // uncheck all radio boxes when filters are cleared
  if (!isFiltersActive.value) selectedTerms.value = [];
});

const radioClicked = (e) => {
  if (selectedTerms.value === parseInt(e.target.value)) {
    selectedTerms.value = [];
    setFilter('rating', []);
  } else {
    selectedTerms.value = parseInt(e.target.value);
    setFilter('rating', [e.target.value]);
  }
};
</script>

<template>
  <div>
    <div class="flex font-semibold mt-8 leading-none justify-between items-center" @click="isOpen = !isOpen">
      <span>{{ $t('messages.shop.rating') }}</span>
      <Icon v-show="isOpen" name="ion:chevron-up-outline" />
      <Icon v-show="!isOpen" name="ion:chevron-down-outline" />
    </div>
    <div v-if="isOpen" class="mt-3 text-sm grid text-gray-500 gap-2">
      <div class="cursor-pointer flex gap-2 items-center">
        <input id="star-five" v-model="selectedTerms" type="radio" :value="5" aria-label="5 stars" @click="radioClicked" />
        <label for="star-five">
          <StarRating :rating="5" :size="16" />
        </label>
      </div>
      <div class="cursor-pointer flex gap-2 items-center">
        <input id="star-four" v-model="selectedTerms" type="radio" :value="4" aria-label="4 stars" @click="radioClicked" />
        <label for="star-four"> <StarRating :rating="4" :size="16" /> & {{ $t('messages.general.up') }} </label>
      </div>
      <div class="cursor-pointer flex gap-2 items-center">
        <input id="star-three" v-model="selectedTerms" type="radio" :value="3" aria-label="3 stars" @click="radioClicked" />
        <label for="star-three"> <StarRating :rating="3" :size="16" /> & {{ $t('messages.general.up') }} </label>
      </div>
      <div class="cursor-pointer flex gap-2 items-center">
        <input id="star-two" v-model="selectedTerms" type="radio" :value="2" aria-label="2 stars" @click="radioClicked" />
        <label for="star-two"> <StarRating :rating="2" :size="16" /> & {{ $t('messages.general.up') }} </label>
      </div>
      <div class="cursor-pointer flex gap-2 items-center">
        <input id="star-one" v-model="selectedTerms" type="radio" :value="1" aria-label="1 star" @click="radioClicked" />
        <label for="star-one"> <StarRating :rating="1" :size="16" /> & {{ $t('messages.general.up') }} </label>
      </div>
    </div>
  </div>
</template>
