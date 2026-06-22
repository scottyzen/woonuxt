<script setup lang="ts">
import { StockStatusEnum } from '#gql/default';

defineProps({
  stockStatus: { type: String, required: false },
});
</script>

<template>
  <ClientOnly>
    <span v-if="stockStatus === StockStatusEnum.InStock" class="text-green-600">{{ $t('shop.inStock') }}</span>
    <span v-else-if="stockStatus === StockStatusEnum.OutOfStock" class="text-red-600">{{ $t('shop.outOfStock') }}</span>
    <span v-else-if="stockStatus === StockStatusEnum.OnBackorder" class="text-yellow-600">{{ $t('shop.onBackorder') }}</span>
    <span v-else class="text-gray-600">Loading</span>
  </ClientOnly>
</template>
