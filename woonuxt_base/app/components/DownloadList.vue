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
  <div class="bg-white rounded-lg flex shadow min-h-[250px] p-4 md:p-12 justify-center items-center">
    <div v-if="downloads && downloads.length" class="w-full">
      <DownloadableItems :downloadableItems="downloads" />
      <div class="text-center flex justify-center w-full mt-8">
        <button type="button" @click="refresh" class="flex items-center gap-1 text-sm leading-none hover:bg-gray-50 p-2 rounded">
          <span>Refresh list</span>
          <Icon name="ion:refresh-outline" />
        </button>
      </div>
    </div>
    <div v-else-if="downloads && downloads.length === 0" class="min-h-[250px] flex items-center justify-center text-gray-500 text-lg">No downloads found.</div>
    <LoadingIcon v-else size="24" stroke="2" />
  </div>
</template>
