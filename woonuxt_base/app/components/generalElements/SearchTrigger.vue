<script setup lang="ts">
const { toggleSearch } = useSearching();
</script>

<template>
  <div 
    class="relative cursor-pointer inline-flex items-center justify-center p-1.5 rounded-full hover:bg-blue-50 transition-all duration-300 sm:hidden group" 
    title="Search" 
    @click="toggleSearch"
  >
    <Icon 
      name="ion:search-outline" 
      size="20" 
      class="text-gray-700 group-hover:text-blue-600 transition-colors duration-300 transform group-hover:scale-110" 
    />
    <span class="sr-only">Search</span>
  </div>
</template>

<style scoped>
.group:active {
  transform: scale(0.95);
  transition: transform 0.1s;
}
</style>
