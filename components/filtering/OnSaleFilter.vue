<script setup>
const { getFilter, setFilter, isFiltersActive } = await useFiltering();
const selectedTerms = ref(getFilter('sale') || []);

const isOpen = ref(true);

watch(isFiltersActive, () => {
  // uncheck all radio boxes when filters are cleared
  if (!isFiltersActive.value) selectedTerms.value = [];
});

const checkboxClicked = (e) => {
  if (selectedTerms.value.length === 0) {
    selectedTerms.value = [e.target.value];
    setFilter('sale', [e.target.value]);
  } else {
    selectedTerms.value = [];
    setFilter('sale', []);
  }
};
</script>

<template>
  <div>
    <div class="flex font-semibold mt-8 leading-none justify-between items-center" @click="isOpen = !isOpen">
      <span>Sale Products Only</span>
      <Icon v-show="isOpen" name="ion:chevron-up-outline" />
      <Icon v-show="!isOpen" name="ion:chevron-down-outline" />
    </div>
    <div v-if="isOpen" class="mt-3 text-sm grid text-gray-500 gap-2">
      <div class="cursor-pointer flex gap-2 items-center">
        <input id="sale-true" v-model="selectedTerms" type="checkbox" :value="true" aria-label="Sale Products Only" @click="checkboxClicked" />
      </div>
    </div>
  </div>
</template>
