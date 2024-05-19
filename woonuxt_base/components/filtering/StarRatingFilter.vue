<script setup lang="ts">
const { getFilter, setFilter, isFiltersActive } = await useFiltering();

const selectedTerms = ref<string[]>(getFilter('rating'));
const isOpen = ref(true);

/**
 * @description This watches the isFiltersActive variable and unchecks all radio boxes when filters are cleared.
 * @example If the user clicks the 'clear filters' button, the isFiltersActive variable would change to false.
 */
watch(isFiltersActive, () => {
  if (!isFiltersActive.value) selectedTerms.value = [];
});

/**
 * @param {string} rating - This is a string instead of a number because the setFilter function is used globally and it only accepts strings.
 * @description This sets the filter to the selected rating. If the rating is already selected, it will be removed from the filter.
 */
const radioClicked = (rating: string): void => {
  setFilter('rating', selectedTerms.value.includes(rating) ? [] : [rating]);
};
</script>

<template>
  <div>
    <div class="cursor-pointer flex font-semibold mt-8 leading-none justify-between items-center" @click="isOpen = !isOpen">
      <span>{{ $t('messages.shop.rating') }}</span>
      <Icon v-show="isOpen" name="ion:chevron-up-outline" />
      <Icon v-show="!isOpen" name="ion:chevron-down-outline" />
    </div>
    <div v-if="isOpen" class="mt-3 text-sm grid text-gray-500 gap-3">
      <div class="cursor-pointer flex gap-2 items-center">
        <input id="star-five" v-model="selectedTerms" type="radio" value="5" aria-label="5 stars" @click="radioClicked('5')" />
        <label class="flex items-center" for="star-five">
          <StarRating :rating="5" :size="16" />
        </label>
      </div>
      <div class="cursor-pointer flex gap-2 items-center">
        <input id="star-four" v-model="selectedTerms" type="radio" value="4" aria-label="4 stars" @click="radioClicked('4')" />
        <label class="flex items-center" for="star-four">
          <StarRating :rating="4" :size="16" />
          <span class="ml-1 text-xs">& {{ $t('messages.general.up') }}</span>
        </label>
      </div>
      <div class="cursor-pointer flex gap-2 items-center">
        <input id="star-three" v-model="selectedTerms" type="radio" value="3" aria-label="3 stars" @click="radioClicked('3')" />
        <label class="flex items-center" for="star-three">
          <StarRating :rating="3" :size="16" />
          <span class="ml-1 text-xs">& {{ $t('messages.general.up') }}</span>
        </label>
      </div>
      <div class="cursor-pointer flex gap-2 items-center">
        <input id="star-two" v-model="selectedTerms" type="radio" value="2" aria-label="2 stars" @click="radioClicked('2')" />
        <label class="flex items-center" for="star-two">
          <StarRating :rating="2" :size="16" />
          <span class="ml-1 text-xs">& {{ $t('messages.general.up') }}</span>
        </label>
      </div>
      <div class="cursor-pointer flex gap-2 items-center">
        <input id="star-one" v-model="selectedTerms" type="radio" value="1" aria-label="1 star" @click="radioClicked('1')" />
        <label class="flex items-center" for="star-one">
          <StarRating :rating="1" :size="16" />
          <span class="ml-1 text-xs">& {{ $t('messages.general.up') }}</span>
        </label>
      </div>
    </div>
  </div>
</template>
