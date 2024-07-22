<script setup lang="ts">
const { formatDate } = useHelpers();

const props = defineProps({
  downloadableItems: { type: Object as PropType<DownloadableItem[]>, default: [] },
});
</script>

<template>
  <table class="w-full text-left table-auto" aria-label="Download List">
    <thead>
      <tr>
        <th>{{ $t('messages.general.product') }}</th>
        <th>{{ $t('messages.shop.downloadsRemaining') }}</th>
        <th>{{ $t('messages.shop.expires') }}</th>
        <th>{{ $t('messages.general.download') }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in props.downloadableItems" :key="item.id">
        <td class="rounded-l-lg">
          <NuxtLink v-if="item.product" :to="`/product/${item.product.slug}`" class="hover:underline">{{ item.product.name }}</NuxtLink>
        </td>
        <td>{{ item.downloadsRemaining || '∞' }}</td>
        <td>{{ item.accessExpires ? formatDate(item.accessExpires) : 'Never' }}</td>
        <td v-if="item.url">
          <a :href="item.url" :download="item.name" class="text-primary hover:text-primary-dark hover:underline">{{ item.name }}</a>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style lang="postcss" scoped>
tbody tr:nth-child(odd) {
  background-color: #fafafa;
}

thead tr {
  @apply text-xs sm:text-base;
}

tbody tr {
  @apply text-xs sm:text-sm text-gray-500;
}

td,
th {
  @apply py-2 px-3;
}
</style>
