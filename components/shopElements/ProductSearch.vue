<script setup>
import { onBeforeRouteUpdate } from 'nuxt/app';
const { getSearchQuery, setSearchQuery, clearSearchQuery, searchProducts, isSearchActive } = useSearching();
const searchQuery = ref(getSearchQuery());

const reset = () => {
  clearSearchQuery();
  searchQuery.value = '';
};

onBeforeRouteUpdate((to, from, next) => {
  if (to.path !== '/products' && from.path === '/products' && searchQuery.value) {
    searchQuery.value = '';
  }
  next();
});
</script>

<template>
  <form id="product-search" class="relative inline-flex items-center flex-1 max-w-xl -space-x-px rounded-md shadow-sm" @submit.prevent="setSearchQuery(searchQuery)">
    <Icon name="ion:search-outline" size="20" class="absolute z-10 opacity-50 pointer-events-none left-2" />
    <input
      v-model="searchQuery"
      type="text"
      :placeholder="$t('messages.shop.searchProducts')"
      class="z-0 inline-flex items-center w-full p-2 pl-10 text-sm font-medium text-gray-500 border border-gray-300 rounded-md shadow-inner outline-none bg-gray-50 shadow-gray-100" />
    <span v-if="searchQuery" class="absolute z-10 flex items-center gap-1 px-2 py-1 text-xs rounded cursor-pointer bg-primary bg-opacity-10 text-primary right-2" @click="reset">
      <span>{{ $t('messages.general.clear') }}</span>
      <Icon name="ion:close-outline" size="18" />
    </span>
  </form>
</template>

<style scoped>
#product-search {
  max-width: 360px;
}
</style>
