<script setup lang="ts">
const { t } = useI18n()
const { node } = defineProps({
  node: { type: Object, required: true },
})
const { storeSettings } = useAppConfig()

// 🔢 Gebruik juiste prijsvelden (met fallback)
const salePrice = computed(() =>
  parseFloat(node?.rawSalePrice || node?.salePrice || 0)
)
const regularPrice = computed(() =>
  parseFloat(node?.rawRegularPrice || node?.regularPrice || 0)
)

// 📊 Bereken korting in procenten
const salePercentage = computed((): string => {
  if (!salePrice.value || !regularPrice.value || regularPrice.value === 0) return ''
  const percent = Math.round(((regularPrice.value - salePrice.value) / regularPrice.value) * 100)
  return `-${percent}%`
})

// 👁️ Bepaal of badge getoond moet worden
const showSaleBadge = computed(
  () => (salePrice.value && regularPrice.value && storeSettings.saleBadge !== 'hidden')
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

<style lang="postcss" scoped>
.red-badge {
  @apply rounded-md bg-red-400 text-xs text-white tracking-tight px-1.5 leading-6 z-10;
  background: #000 linear-gradient(0deg, #f87171, #f87171);
}
</style>
