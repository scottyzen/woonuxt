<script setup>
import Slider from '@vueform/slider';

const { getFilter, setFilter, isFiltersActive } = useFiltering();
const runtimeConfig = useRuntimeConfig();
const maxPrice = runtimeConfig?.public?.MAX_PRICE || 1000;
const currencySymbol = runtimeConfig?.public?.CURRENCY_SYMBOL || '$';

const activeFilters = ref(getFilter('price'));
const price = activeFilters.value.length ? ref(activeFilters.value) : ref([0, maxPrice]);
const isOpen = ref(true);

const resetSlider = () => {
  price.value = [0, maxPrice];
};

const applyPrice = () => {
  setFilter('price', price.value);
};

watch(isFiltersActive, () => {
  if (!isFiltersActive.value) resetSlider();
});
</script>

<template>
  <div>
    <div class="cursor-pointer flex font-semibold mt-8 leading-none justify-between items-center text-gray-900 dark:text-white" @click="isOpen = !isOpen">
      <span>{{ $t('shop.price') }}</span>
      <Icon name="ion:chevron-down-outline" class="transform text-gray-600 dark:text-gray-400" :class="isOpen ? 'rotate-180' : ''" />
    </div>
    <div v-show="isOpen" class="mt-3 grid gap-4 grid-cols-2">
      <div class="flex relative items-center">
        <input
          id="price-from"
          v-model="price[0]"
          class="bg-white dark:bg-gray-700 border rounded-lg max-w-full border-gray-200 dark:border-gray-600 leading-none w-auto p-2 pl-6 md:text-sm text-gray-900 dark:text-white"
          type="number"
          placeholder="From"
          min="0" />
        <label for="price-from" class="leading-none px-2 text-gray-400 dark:text-gray-500 absolute" v-html="currencySymbol" />
      </div>
      <div class="flex relative items-center">
        <input
          id="price-to"
          v-model="price[1]"
          class="bg-white dark:bg-gray-700 border rounded-lg max-w-full border-gray-200 dark:border-gray-600 leading-none w-auto p-2 pl-6 md:text-sm text-gray-900 dark:text-white"
          type="number"
          placeholder="Up to"
          min="1" />
        <label for="price-to" class="leading-none px-2 text-gray-400 dark:text-gray-500 absolute" v-html="currencySymbol" />
      </div>
      <div class="mx-1 mt-1 col-span-full">
        <Slider v-model="price" :tooltips="false" :min="0" :max="maxPrice" ariaLabelledby="price-from price-to" @update="applyPrice" />
      </div>
    </div>
  </div>
</template>

<style src="@vueform/slider/themes/default.css"></style>

<style scoped>
@reference "#tailwind";

:deep(.slider-base) {
  @apply dark:bg-gray-600;
}

:deep(.slider-handle) {
  @apply dark:bg-white dark:border-gray-500;
}

:deep(.slider-tooltip) {
  @apply dark:bg-gray-700 dark:text-white;
}
</style>
