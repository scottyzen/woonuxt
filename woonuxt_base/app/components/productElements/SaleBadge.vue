<script setup lang="ts">
const { t } = useI18n();
const { node } = defineProps({
  node: { type: Object, required: true },
});

const { storeSettings } = useAppConfig();

const salePercentage = computed((): string | null => {
  const salePrice = Number(node?.rawSalePrice);
  const regularPrice = Number(node?.rawRegularPrice);

  if (!Number.isFinite(salePrice) || !Number.isFinite(regularPrice) || regularPrice <= 0) return null;

  const percentage = Math.round(((salePrice - regularPrice) / regularPrice) * 100);
  return Number.isFinite(percentage) ? `${percentage} %` : null;
});

const showSaleBadge = computed(() => node.rawSalePrice && storeSettings.saleBadge !== 'hidden');

const textToDisplay = computed(() => {
  if (storeSettings?.saleBadge === 'percent' && salePercentage.value) return salePercentage.value;
  return t('shop.onSale') ? t('shop.onSale') : 'Sale';
});
</script>

<template>
  <span v-if="showSaleBadge" class="z-10 rounded-md bg-red-400 px-1.5 text-xs leading-6 tracking-tight text-white">
    {{ textToDisplay }}
  </span>
</template>
