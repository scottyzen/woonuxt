<script setup lang="ts">
const { t } = useI18n();
const { node } = defineProps({ node: { type: Object, required: true } });
const { storeSettings } = useAppConfig();

const salePercentage = computed((): string | null => {
  if (!node?.rawSalePrice || !node?.rawRegularPrice) return '';
  const salePrice = Number.parseFloat(String(node.rawSalePrice).replace(',', '.'));
  const regularPrice = Number.parseFloat(String(node.rawRegularPrice).replace(',', '.'));
  if (!Number.isFinite(salePrice) || !Number.isFinite(regularPrice) || regularPrice <= 0) return null;
  const percentage = Math.round(((salePrice - regularPrice) / regularPrice) * 100);
  return Number.isFinite(percentage) && percentage < 0 ? `${percentage}% off` : null;
});
const showSaleBadge = computed(() => node.rawSalePrice && storeSettings.saleBadge !== 'hidden');
const textToDisplay = computed(() => storeSettings?.saleBadge === 'percent' && salePercentage.value ? salePercentage.value : (t('shop.onSale') || 'Sale'));
</script>

<template>
  <span v-if="showSaleBadge" class="z-10 inline-flex rounded-full bg-[#0d5134] px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-white shadow-sm">
    {{ textToDisplay }}
  </span>
</template>
