<script setup>
const { getSearchQuery, setSearchQuery, clearSearchQuery } = useSearching();
const searchQuery = ref(getSearchQuery());

const reset = () => {
  clearSearchQuery();
  searchQuery.value = '';
};

watch(getSearchQuery, (value) => {
  if (!value) reset();
});
</script>

<template>
  <form class="relative items-center flex-1 -space-x-px rounded-md shadow-sm" @submit.prevent="setSearchQuery(searchQuery)">
    <Icon name="ion:search-outline" size="20" class="absolute z-10 opacity-50 pointer-events-none left-2 dark:text-gray-400" />
    <input
      id="product-search-input"
      v-model="searchQuery"
      type="text"
      :placeholder="$t('shop.searchProducts')"
      class="z-0 inline-flex items-center w-full p-2 pl-10 text-sm text-gray-500 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md shadow-inner outline-none bg-gray-50 dark:bg-gray-700 shadow-gray-200 dark:shadow-gray-900 placeholder:text-gray-400 dark:placeholder:text-gray-500" />
    <span
      v-if="searchQuery"
      class="absolute z-10 flex items-center gap-1 px-2 py-1 text-xs rounded cursor-pointer bg-primary bg-opacity-10 dark:bg-opacity-20 hover:bg-opacity-20 dark:hover:bg-opacity-30 text-primary right-2"
      @click="reset">
      <span>{{ $t('general.clear') }}</span>
      <Icon name="ion:close-outline" size="18" />
    </span>
  </form>
</template>
