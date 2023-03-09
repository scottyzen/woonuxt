<script setup>
const { resetFilter, isFiltersActive } = await useFiltering();
</script>

<template>
  <div v-if="isFiltersActive">
    <button class="bg-primary rounded-lg font-bold mt-8 text-center text-white text-sm w-full p-2" @click="resetFilter">
      {{ $t('messages.general.clearFilters') }}
    </button>
  </div>
</template>
