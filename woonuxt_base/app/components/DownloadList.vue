<script setup lang="ts">
const router = useRouter();
const { formatDate, scrollToTop } = useHelpers();
const { getOrders, downloadableOrders } = useAuth();

if (downloadableOrders.value === null) getOrders();

const allDownloadableItems = computed(() => {
  if (downloadableOrders.value) {
    return downloadableOrders.value.flatMap((order) => order.downloadableItems.nodes);
  }
  return [];
});

const refresh = () => {
  downloadableOrders.value = null;
  scrollToTop();
  getOrders();
};

const downloadFile = (downloadUrl: string) => {
  window.open(downloadUrl, '_blank');
};
</script>

<template>
  <div class="bg-white rounded-lg flex shadow min-h-[250px] p-12 justify-center items-center">
    <div v-if="allDownloadableItems && allDownloadableItems.length" class="w-full">
      <table class="w-full text-left table-auto" aria-label="Download List">
        <thead>
          <tr>
            <th>{{ $t('messages.general.product') }}</th>
            <th>{{ $t('messages.shop.downloadsRemaining') }}</th>
            <th>{{ $t('messages.shop.expires') }}</th>
            <th class="text-right">{{ $t('messages.general.download') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="download in allDownloadableItems" :key="download.id">
            <td class="rounded-l-lg ">
              <router-link :to="`/product/${download.product.slug}`" class="cursor-pointer hover:underline">{{ download.product.name }}</router-link>
            </td>
            <td>{{ download.downloadsRemaining ? download.downloadsRemaining : '∞' }}</td>
            <td>{{ download.accessExpires ? formatDate(download.accessExpires) : 'Never' }}</td>
            <td class="text-right rounded-r-lg">
              <button @click.stop="downloadFile(download.url)" class="text-blue-500 hover:text-blue-700 hover:underline cursor-pointer ">
                {{ download.name }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="text-center flex justify-center w-full mt-8">
        <button type="button" @click="refresh" class="flex items-center gap-1 text-sm leading-none hover:bg-gray-50 p-2 rounded">
          <span>Refresh list</span>
          <Icon name="ion:refresh-outline" />
        </button>
      </div>
    </div>
    <div v-else-if="downloadableOrders && downloadableOrders.length === 0" class="min-h-[250px] flex items-center justify-center text-gray-500 text-lg">No downloads found.</div>
    <LoadingIcon v-else size="24" stroke="2" />
  </div>
</template>

<style lang="postcss" scoped>
tbody tr:nth-child(odd) {
  background-color: #fafafa;
}

tbody tr {
  @apply text-sm text-gray-500;
}

td,
th {
  @apply py-2 px-3;
}
</style>
