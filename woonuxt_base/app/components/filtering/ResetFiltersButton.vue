<script setup>
const { resetFilter } = useFiltering();
</script>

<template>
  <button
    class="bg-primary dark:bg-primary rounded-lg font-bold mt-8 text-center text-white dark:text-white text-sm w-full p-2 dark:hover:opacity-90"
    @click="resetFilter">
    {{ $t('general.clearFilters') }}
  </button>
</template>
