<script setup lang="ts">
const { description } = useAppConfig();
</script>

<template>
  <p class="mt-4 text-sm text-gray-700 dark:text-gray-300 xl:max-w-md">{{ description }}</p>
</template>
