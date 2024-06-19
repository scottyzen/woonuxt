<script setup>
const { getFilter, setFilter, isFiltersActive } = useFiltering();
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
    <div class="cursor-pointer flex font-semibold mt-8 leading-none justify-between items-center" @click="isOpen = !isOpen">
      <span>Sale Products Only</span>
      <Icon name="ion:chevron-down-outline" class="transform" :class="isOpen ? 'rotate-180' : ''" />
    </div>
    <div v-if="isOpen" class="mt-3 mr-1 max-h-[240px] grid gap-1 overflow-auto custom-scrollbar">
      <div class="flex gap-2 items-center">
        <label for="sale-true" class="cursor-pointer m-0 text-sm sr-only" aria-label="Only show products on sale"> Only show products on sale</label>
        <input id="sale-true" v-model="selectedTerms" type="checkbox" :value="true" aria-label="Sale Products Only" @click="checkboxClicked" />
      </div>
    </div>
  </div>
</template>
