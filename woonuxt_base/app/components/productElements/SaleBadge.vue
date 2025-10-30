<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const { storeSettings } = useAppConfig()

const { node } = defineProps({
  node: { type: Object, required: true },
})

// 🧩 Prijzen als getallen parsen, ongeacht string of nummer
function toFloat(value: any): number {
  if (!value) return 0
  // verwijder HTML en valuta-symbolen
  const clean = String(value).replace(/[^\d.,-]/g, '').replace(',', '.')
  return parseFloat(clean) || 0
}

const salePrice = computed(() => toFloat(node?.salePrice))
const regularPrice = computed(() => toFloat(node?.regularPrice))

// 📊 Bereken korting in procenten
const salePercentage = computed((): string => {
  if (!salePrice.value || !regularPrice.value || regularPrice.value <= salePrice.value) return ''
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

// 🧠 Debug: zie of de prijzen doorkomen
onMounted(() => {
  console.log('🧩 SaleBadge Debug:', {
    name: node?.name,
    type: node?.__typename,
    regular: node?.regularPrice,
    sale: node?.salePrice,
    visible: showSaleBadge.value,
  })
})
</script>

<template>
  <span v-if="showSaleBadge" class="sale-badge">
    {{ textToDisplay }}
  </span>
</template>

<style scoped lang="postcss">
.sale-badge {
  @apply absolute top-2 right-2 rounded-md text-xs text-white font-semibold px-2 py-1 z-10;
  background: #ef4444; /* standaard WooNuxt rood */
}
</style>
