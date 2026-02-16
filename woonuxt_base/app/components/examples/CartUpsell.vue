<script setup lang="ts">
// Example hook: Cart upsell suggestion
const props = defineProps<{ ctx: { cart: any } }>();

// Example: Suggest free shipping threshold
const freeShippingThreshold = 50;
const subtotal = computed(() => {
  if (!props.ctx?.cart) return 0;
  const totalString = props.ctx.cart.subtotal?.replace(/[^0-9.]/g, '') || '0';
  return parseFloat(totalString);
});

const runtimeConfig = useRuntimeConfig();
const currencySymbol = runtimeConfig?.public?.CURRENCY_SYMBOL || '$';

const remaining = computed(() => Math.max(0, freeShippingThreshold - subtotal.value));
const hasReachedFreeShipping = computed(() => remaining.value === 0);
</script>

<template>
  <div v-if="!hasReachedFreeShipping" class="p-3 text-sm text-center items-center text-gray-700 bg-gray-100 rounded-lg dark:text-blue-300 leading-loose">
    Add <strong>{{ currencySymbol }}{{ remaining.toFixed(2) }}</strong> more for <strong>FREE shipping</strong>
  </div>
</template>
