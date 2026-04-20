<script setup>
const { updateShippingMethod } = useCart();

const props = defineProps({
  options: { type: Array, required: true },
  activeOption: { type: String, required: true },
});

const setActiveOption = async (id) => {
  await updateShippingMethod(id);
};
</script>

<template>
  <div class="shipping-options" role="radiogroup" aria-label="Shipping methods">
    <button
      v-for="option in options"
      :key="option.id"
      type="button"
      class="shipping-option"
      :class="{ 'active-option': option.id === activeOption }"
      role="radio"
      :aria-checked="option.id === activeOption"
      @click="setActiveOption(option.id)">
      <span class="shipping-option-content">
        <span class="shipping-option-label" v-html="option.label"></span>
        <span class="shipping-option-price">{{ option.cost }}</span>
      </span>
      <span class="shipping-option-radio" :class="option.id === activeOption ? 'border-primary bg-primary/10' : 'border-gray-400 bg-white'">
        <span class="shipping-option-radio-dot" :class="option.id === activeOption ? 'bg-primary' : 'bg-transparent'" />
      </span>
    </button>
  </div>
</template>

<style scoped lang="postcss">
@reference "#tailwind";

.shipping-options {
  @apply grid gap-3;
  container-type: inline-size;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}

.shipping-option {
  @apply w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-left text-sm transition-colors hover:border-gray-400 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40;
  @apply flex items-center justify-between gap-3;
}

.shipping-option-content {
  @apply flex flex-col gap-1 min-w-0;
}

.shipping-option-label {
  @apply text-sm font-medium text-gray-700;
}

.shipping-option-price {
  @apply text-base font-semibold text-gray-900;
}

.shipping-option-radio {
  @apply inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors;
}

.shipping-option.active-option {
  @apply border-primary bg-primary/5 shadow-sm;
}

.shipping-option-radio-dot {
  @apply h-2.5 w-2.5 rounded-full transition-colors;
}

@container (max-width: 36rem) {
  .shipping-options {
    grid-template-columns: 1fr;
  }
}
</style>
