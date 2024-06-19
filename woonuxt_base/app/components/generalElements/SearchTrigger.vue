<script setup lang="ts">
const { toggleSearch } = useSearching();
</script>

<template>
  <div class="relative cursor-pointer inline-flex sm:hidden" title="Cart" @click="toggleSearch">
    <Icon name="ion:search-outline" size="20" class="mr-1 md:mr-0" />
  </div>
</template>
