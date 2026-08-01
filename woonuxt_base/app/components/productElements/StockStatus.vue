<script setup lang="ts">
import { StockStatusEnum } from '#gql/default';

defineProps({
  stockStatus: { type: String, required: true },
});
</script>

<template>
  <span v-if="stockStatus === StockStatusEnum.InStock" class="text-green-600">{{ $t('shop.inStock') }}</span>
  <span v-else-if="stockStatus === StockStatusEnum.OutOfStock" class="text-red-600">{{ $t('shop.outOfStock') }}</span>
  <span v-else-if="stockStatus === StockStatusEnum.OnBackorder" class="text-yellow-600">{{ $t('shop.onBackorder') }}</span>
</template>
