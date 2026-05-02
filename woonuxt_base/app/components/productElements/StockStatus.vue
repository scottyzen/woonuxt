<script setup lang="ts">
import { StockStatusEnum } from '#gql/default';

defineProps({
  stockStatus: { type: String, required: false },
});
</script>

<template>
  <span v-if="stockStatus === StockStatusEnum.IN_STOCK" class="text-green-600">{{ $t('shop.inStock') }}</span>
  <span v-else-if="stockStatus === StockStatusEnum.OUT_OF_STOCK" class="text-red-600">{{ $t('shop.outOfStock') }}</span>
  <span v-else-if="stockStatus === StockStatusEnum.ON_BACKORDER" class="text-yellow-600">{{ $t('shop.onBackorder') }}</span>
</template>
