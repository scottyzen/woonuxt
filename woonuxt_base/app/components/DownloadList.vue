<script setup lang="ts">
const { scrollToTop } = useHelpers();
const { getDownloads, downloads } = useAuth();

if (downloads.value === null) getDownloads();

const refresh = () => {
  downloads.value = null;
  scrollToTop();
  getDownloads();
};
</script>

<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-lg flex shadow-xs border border-gray-100 dark:border-gray-700 min-h-62.5 p-4 md:p-8 justify-center items-center">
    <div v-if="downloads && downloads.length" class="w-full">
      <DownloadableItems :downloadableItems="downloads" />
      <div class="text-center flex justify-center w-full mt-8">
        <Button type="button" size="sm" variant="secondary" icon="ion:refresh-outline" @click="refresh"> Refresh list </Button>
      </div>
    </div>
    <div v-else-if="downloads && downloads.length === 0" class="min-h-62.5 flex items-center justify-center text-gray-500 dark:text-gray-400 text-lg">
      No downloads found.
    </div>
    <LoadingIcon v-else size="24" stroke="2" />
  </div>
</template>
