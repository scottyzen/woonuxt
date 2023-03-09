<script setup>
const { getSearchQuery, setSearchQuery, clearSearchQuery, searchProducts, isSearchActive } = useSearching();
const searchQuery = ref(getSearchQuery());

const reset = () => {
  clearSearchQuery();
  searchQuery.value = '';
};
</script>

<template>
  <form class="-space-x-px rounded-md flex max-w-xl flex-1 shadow-sm items-center relative" @submit.prevent="setSearchQuery(searchQuery)">
    <Icon name="ion:search-outline" size="20" class="opacity-50 left-2 z-10 absolute pointer-events-none" />
    <input
      v-model="searchQuery"
      type="text"
      :placeholder="$t('messages.shop.searchProducts')"
      class="bg-white border rounded-md font-medium border-gray-300 text-sm w-full p-2 pl-10 text-gray-500 z-0 inline-flex items-center" />
    <span
      v-if="searchQuery"
      class="bg-primary rounded cursor-pointer flex bg-opacity-10 text-xs text-primary py-1 px-2 right-2 z-10 gap-1 absolute items-center"
      @click="reset">
      <span>{{ $t('messages.general.clear') }}</span>
      <Icon name="ion:close-outline" size="18" />
    </span>
  </form>
</template>
