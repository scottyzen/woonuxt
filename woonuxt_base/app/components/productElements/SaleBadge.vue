<script setup lang="ts">
const { t } = useI18n();
const { node } = defineProps({
  node: { type: Object, required: true },
});

const { storeSettings } = useAppConfig();

const salePercentage = computed((): string => {
  if (!node?.rawSalePrice || !node?.rawRegularPrice) return '';
  const salePrice = parseFloat(node?.rawSalePrice);
  const regularPrice = parseFloat(node?.rawRegularPrice);
  return Math.round(((salePrice - regularPrice) / regularPrice) * 100) + ` %`;
});

const showSaleBadge = computed(() => node.rawSalePrice && storeSettings.saleBadge !== 'hidden');

const textToDisplay = computed(() => {
  if (storeSettings?.saleBadge === 'percent') return salePercentage.value;
  return t('shop.onSale') ? t('shop.onSale') : 'Sale';
});
</script>

<template>
  <span v-if="showSaleBadge" class="z-10 rounded-md bg-red-400 px-1.5 text-xs leading-6 tracking-tight text-white">
    {{ textToDisplay }}
  </span>
</template>
