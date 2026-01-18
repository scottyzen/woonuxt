<script setup>
const { resetFilter } = useFiltering();
</script>

<template>
  <Button class="mt-8 w-full" @click="resetFilter">
    {{ $t('general.clearFilters') }}
  </Button>
</template>
