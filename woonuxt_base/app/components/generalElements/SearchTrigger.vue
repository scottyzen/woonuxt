<script setup lang="ts">
const { toggleSearch } = useSearching();
</script>

<template>
  <div
    class="relative cursor-pointer inline-flex sm:hidden"
    title="Cart"
    role="button"
    tabindex="0"
    @click="toggleSearch"
    @keydown.enter.space.prevent="toggleSearch">
    <Icon name="ion:search-outline" size="20" class="mr-1 md:mr-0" />
  </div>
</template>
