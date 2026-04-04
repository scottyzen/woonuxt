<script setup lang="ts">
import type { PaymentGateway, PaymentGateways } from '#types/gql';

const props = defineProps<{
  modelValue: string | object;
  paymentGateways: PaymentGateways;
}>();

const paymentMethod = toRef(props, 'modelValue');
const emits = defineEmits(['update:modelValue']);
const gateways = computed<PaymentGateway[]>(() => props.paymentGateways?.nodes || []);

const selectedGatewayId = computed<string>(() => {
  const value = paymentMethod.value as PaymentGateway | string | null | undefined;
  return (typeof value === 'string' ? value : value?.id) || gateways.value[0]?.id || '';
});

const activePaymentMethod = computed<PaymentGateway | null>(() => {
  return gateways.value.find((gateway) => gateway.id === selectedGatewayId.value) || null;
});

const updatePaymentMethod = (gateway: PaymentGateway) => {
  emits('update:modelValue', gateway);
};

watch(
  [gateways, selectedGatewayId],
  ([availableGateways, activeId]) => {
    if (!availableGateways.length) return;
    const matchedGateway = availableGateways.find((gateway) => gateway.id === activeId) || (availableGateways[0] as PaymentGateway);
    const value = paymentMethod.value as PaymentGateway | string | null | undefined;
    const currentId = typeof value === 'string' ? value : value?.id;

    if (typeof value === 'object' && value && currentId === matchedGateway.id) return;
    updatePaymentMethod(matchedGateway);
  },
  { immediate: true },
);
</script>

<template>
  <div class="payment-options-root">
    <div class="payment-options-grid" role="radiogroup" aria-label="Payment options">
      <button
        v-for="gateway in gateways"
        :key="gateway.id"
        type="button"
        class="payment-option"
        :class="{ 'active-option': gateway.id === selectedGatewayId }"
        role="radio"
        :aria-checked="gateway.id === selectedGatewayId"
        :title="gateway?.description || gateway?.title || 'Payment Method'"
        @click="updatePaymentMethod(gateway)">
        <span class="payment-option-content">
          <NuxtImg
            v-if="gateway.icon"
            :src="gateway.icon"
            :alt="gateway.title || 'Payment Method'"
            width="18"
            height="18"
            class="payment-option-icon object-contain"
            fit="outside"
            loading="lazy" />
          <icon v-else-if="gateway.id === 'stripe'" name="ion:card-outline" size="18" class="payment-option-icon" />
          <icon v-else-if="gateway.id === 'paypal'" name="ion:logo-paypal" size="18" class="payment-option-icon" />
          <icon v-else name="ion:cash-outline" size="18" class="payment-option-icon" />
          <span class="gateway-label" v-html="gateway.title" />
        </span>
        <icon name="ion:checkmark-circle" size="18" class="payment-option-check" />
      </button>
    </div>

    <div v-if="activePaymentMethod?.description" class="prose block w-full mt-3">
      <p class="text-sm text-gray-500 dark:text-gray-400" v-html="activePaymentMethod.description" />
    </div>
  </div>
</template>

<style scoped>
@reference "#tailwind";

.payment-options-root {
  @apply w-full;
  container-type: inline-size;
}

.payment-options-grid {
  @apply grid gap-3;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}

.payment-option {
  @apply w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-left text-sm font-medium text-gray-900 transition-colors hover:border-primary hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 dark:border-white/10 dark:bg-white/5 dark:text-gray-100 dark:hover:border-primary dark:hover:bg-white/10;
  @apply flex items-center justify-between gap-3;
}

.payment-option-content {
  @apply inline-flex items-center gap-2 min-w-0;
}

.payment-option-icon {
  @apply h-4.5 w-4.5 flex-none;
}

.gateway-label {
  @apply truncate;
}

.payment-option-check {
  @apply text-primary opacity-0 transition-opacity;
}

.payment-option.active-option {
  @apply border-primary bg-white dark:bg-primary/15;
}

.payment-option.active-option .payment-option-check {
  @apply opacity-100;
}

@container (max-width: 36rem) {
  .payment-options-grid {
    grid-template-columns: 1fr;
  }
}
</style>
