<script setup lang="ts">
const { t } = useI18n()
const { node } = defineProps({
  node: { type: Object, required: true },
})
const { storeSettings } = useAppConfig()

// 🔢 Gebruik bestaande prijsvelden
const salePrice = computed(() =>
  parseFloat(node?.salePrice || 0)
)
const regularPrice = computed(() =>
  parseFloat(node?.regularPrice || 0)
)

// 📊 Bereken korting in procenten
const salePercentage = computed((): string => {
  if (!salePrice.value || !regularPrice.value || regularPrice.value === 0) return ''
  const percent = Math.round(((regularPrice.value - salePrice.value) / regularPrice.value) * 100)
  return `-${percent}%`
})

// 👁️ Bepaal of badge getoond moet worden
const showSaleBadge = computed(() =>
  salePrice.value &&
  regularPrice.value &&
  salePrice.value < regularPrice.value &&
  storeSettings.saleBadge !== 'hidden'
)

// 🏷️ Tekst (percent of vertaling)
const textToDisplay = computed(() => {
  if (storeSettings?.saleBadge === 'percent' && salePercentage.value) return salePercentage.value
  return t('shop.onSale') || 'Sale'
})
</script>

<template>
  <span v-if="showSaleBadge" class="red-badge">
    {{ textToDisplay }}
  </span>
</template>

<style scoped lang="postcss">
.red-badge {
  @apply rounded-md bg-red-500 text-[11px] text-white px-1.5 py-0.5 font-medium shadow-sm;
}
</style>
