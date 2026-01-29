<script setup lang="ts">
import { StockStatusEnum } from '#woo';

defineProps({
  stockStatus: { type: String, required: false },
});
</script>

<template>
  <ClientOnly>
    <span v-if="stockStatus === StockStatusEnum.IN_STOCK" class="text-green-600 dark:text-green-400">{{ $t('shop.inStock') }}</span>
    <span v-else-if="stockStatus === StockStatusEnum.OUT_OF_STOCK" class="text-red-600 dark:text-red-400">{{ $t('shop.outOfStock') }}</span>
    <span v-else-if="stockStatus === StockStatusEnum.ON_BACKORDER" class="text-yellow-600 dark:text-yellow-400">{{ $t('shop.onBackorder') }}</span>
    <span v-else class="text-gray-600 dark:text-gray-400">Loading</span>
  </ClientOnly>
</template>
