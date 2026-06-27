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
      <h2 class="text-2xl font-bold">{{ $t('shop.noProductsFound.title') }}</h2>
      <p class="mt-4 max-w-md">
        <slot>{{ $t('shop.noProductsFound.subText') }}</slot>
      </p>
      <Button v-if="allProducts.length" class="mt-8" @click="clearAll">
        {{ $t('shop.noProductsFound.clearFiltersAndSearch') }}
      </Button>
    </div>
  </div>
</template>
