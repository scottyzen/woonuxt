<script setup lang="ts">
const { formatDate } = useHelpers();

const props = defineProps({
  downloadableItems: { type: Object as PropType<DownloadableItem[]>, required: true },
});

</script>

<template>
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
      <tr v-for="download in props.downloadableItems" :key="download.id">
        <td class="rounded-l-lg">
          <router-link :to="`/product/${download.product?.slug}`" class="cursor-pointer hover:underline">{{ download.product?.name }}</router-link>
        </td>
        <td>{{ download.downloadsRemaining ? download.downloadsRemaining : '∞' }}</td>
        <td>{{ download.accessExpires ? formatDate(download.accessExpires) : 'Never' }}</td>
        <td class="text-right rounded-r-lg" v-if="download.url">
          <a :href="download.url" :download="download.name" class="text-blue-500 hover:text-blue-700 hover:underline cursor-pointer">{{ download.name }}</a>
        </td>
      </tr>
    </tbody>
  </table>
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
