<script setup lang="ts">
const { allProducts } = useProducts();
const { clearSearchQuery, isSearchActive } = useSearching();
const { resetFilter, isFiltersActive } = useFiltering();

const clearAll = () => {
  if (isFiltersActive.value) resetFilter();
  if (isSearchActive.value) clearSearchQuery();
};
</script>

<template>
  <div class="w-full my-16 lg:my-24">
    <div class="flex flex-col items-center justify-center w-full text-center">
      <Icon name="ion:sad-outline" size="156" class="opacity-25 mb-10" />
      <h2 class="text-2xl font-bold">No products found</h2>
      <p class="mt-4 max-w-xs">
        <slot>Try adjusting your search or filter to find what you're looking for.</slot>
      </p>
      <div>
        <button
          v-if="allProducts.length"
          class="bg-primary rounded-lg font-bold mt-8 text-center text-white text-sm w-full p-2 px-3 inline-block"
          title="Clear all filters and search"
          aria-label="Clear all filters and search"
          @click="clearAll">
          Clear all
        </button>
      </div>
    </div>
  </div>
</template>
