<script setup lang="ts">
const { allProducts } = useProducts();
const { clearSearchQuery } = useSearching();
const { resetFilter } = useFiltering();

const clearAll = () => {
  resetFilter();
  clearSearchQuery();
};
</script>

<template>
  <div class="w-full my-16 lg:my-24">
    <div class="flex flex-col items-center justify-center w-full text-center text-pretty">
      <Icon name="ion:sad-outline" size="156" class="opacity-25 mb-10" />
      <h2 class="text-2xl font-bold">{{ $t('messages.shop.noProductsFound.title') }}</h2>
      <p class="mt-4 max-w-md">
        <slot>{{ $t('messages.shop.noProductsFound.subText') }}</slot>
      </p>
      <div>
        <button
          v-if="allProducts.length"
          class="bg-primary rounded-lg font-bold mt-8 text-center text-white text-sm w-full p-2 px-3 inline-block hover:bg-primary-dark"
          :title="$t('messages.shop.noProductsFound.clearFiltersAndSearch')"
          aria-label="Clear all filters and search"
          @click="clearAll">
          {{ $t('messages.shop.noProductsFound.clearFiltersAndSearch') }}
        </button>
      </div>
    </div>
  </div>
</template>
