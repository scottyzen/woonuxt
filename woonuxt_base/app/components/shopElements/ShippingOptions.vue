<script setup>
const { updateShippingMethod } = useCart();
const runtimeConfig = useRuntimeConfig();
const currencySymbol = runtimeConfig?.public?.CURRENCY_SYMBOL || '$';
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
        <span class="shipping-option-price">{{ currencySymbol }}{{ option.cost }}</span>
      </span>
      <icon name="ion:checkmark-circle" size="20" class="shipping-option-check" />
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
  @apply w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-left text-sm transition-colors hover:border-primary hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 dark:border-white/10 dark:bg-white/5 dark:hover:border-primary dark:hover:bg-white/10;
  @apply flex items-center justify-between gap-3;
}

.shipping-option-content {
  @apply flex flex-col gap-1 min-w-0;
}

.shipping-option-label {
  @apply text-sm font-medium text-gray-700 dark:text-gray-200;
}

.shipping-option-price {
  @apply text-base font-semibold text-gray-900 dark:text-white;
}

.shipping-option-check {
  @apply text-primary opacity-0 transition-opacity;
}

.shipping-option.active-option {
  @apply border-primary bg-white dark:bg-primary/15;
}

.shipping-option.active-option .shipping-option-check {
  @apply opacity-100;
}

@container (max-width: 36rem) {
  .shipping-options {
    grid-template-columns: 1fr;
  }
}
</style>
