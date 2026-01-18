<script setup lang="ts">
const { colorMode, toggleTheme } = useUserPreferences();

const currentIcon = computed(() => {
  switch (colorMode.preference) {
    case 'light':
      return 'ion:sunny-outline';
    case 'dark':
      return 'ion:moon-outline';
    case 'system':
      return 'ion:contrast-outline';
    default:
      return 'ion:sunny-outline';
  }
});

const currentLabel = computed(() => {
  switch (colorMode.preference) {
    case 'light':
      return 'Light';
    case 'dark':
      return 'Dark';
    case 'system':
      return 'System';
    default:
      return 'Light';
  }
});
</script>

<template>
  <button
    @click="toggleTheme"
    type="button"
    :title="`Theme: ${currentLabel}`"
    class="inline-flex items-center gap-2 px-4 py-2.5 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
    :aria-label="`Switch to ${currentLabel} theme`">
    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ currentLabel }}</span>
    <Icon :name="currentIcon" size="20" class="text-gray-600 dark:text-gray-300" />
  </button>
</template>
