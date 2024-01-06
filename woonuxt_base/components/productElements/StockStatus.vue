<script setup lang="ts">
import { StockStatusEnum } from '@/woonuxt_base/types/commonTypes';

const props = defineProps({
  status: { type: String, required: false },
});
</script>

<template>
  <span v-if="status === StockStatusEnum.IN_STOCK" class="text-green-600">{{ $t('messages.shop.inStock') }}</span>
  <span v-else-if="status === StockStatusEnum.OUT_OF_STOCK" class="text-red-600">{{ $t('messages.shop.outOfStock') }}</span>
  <span v-else-if="status === StockStatusEnum.ON_BACKORDER" class="text-yellow-600">{{ $t('messages.shop.onBackorder') }}</span>
  <span v-else class="text-gray-600">Loading</span>
</template>
