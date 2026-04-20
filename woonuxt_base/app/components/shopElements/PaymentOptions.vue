<script setup lang="ts">
import type { PaymentGateway, PaymentGateways } from '#types/gql';

const props = defineProps<{
  modelValue: string | object;
  paymentGateways: PaymentGateways;
  forceInactive?: boolean;
  excludedGatewayIds?: string[];
  disableAutoSelect?: boolean;
  inlineActiveDescription?: boolean;
}>();

const paymentMethod = toRef(props, 'modelValue');
const emits = defineEmits(['update:modelValue']);
const gateways = computed<PaymentGateway[]>(() => {
  const allGateways = props.paymentGateways?.nodes || [];
  if (!props.excludedGatewayIds?.length) return allGateways;
  const excludedIds = new Set(props.excludedGatewayIds);
  return allGateways.filter((gateway) => !excludedIds.has(gateway.id || ''));
});

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
    if (props.disableAutoSelect) return;
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
      <div v-for="gateway in gateways" :key="gateway.id" class="payment-option-item">
        <button
          type="button"
          class="payment-option"
          :class="{ 'active-option': !forceInactive && gateway.id === selectedGatewayId }"
          role="radio"
          :aria-checked="!forceInactive && gateway.id === selectedGatewayId"
          :title="gateway?.description || gateway?.title || 'Payment Method'"
          @click="updatePaymentMethod(gateway)">
          <span class="payment-option-content">
            <PaymentGatewayIcon :gateway-id="gateway.id" :icon-src="gateway.icon || null" :alt="gateway.title || 'Payment Method'" />
            <span class="gateway-label" v-html="gateway.title" />
          </span>
          <span
            class="payment-option-radio"
            :class="!forceInactive && gateway.id === selectedGatewayId ? 'border-primary bg-primary/10' : 'border-gray-400 bg-white'">
            <span class="payment-option-radio-dot" :class="!forceInactive && gateway.id === selectedGatewayId ? 'bg-primary' : 'bg-transparent'" />
          </span>
        </button>

        <div
          v-if="inlineActiveDescription && !forceInactive && gateway.id === selectedGatewayId && gateway.description"
          class="payment-option-description prose mt-3">
          <p class="text-sm text-gray-500" v-html="gateway.description" />
        </div>
      </div>
    </div>

    <div v-if="!inlineActiveDescription && activePaymentMethod?.description" class="prose block w-full mt-3">
      <p class="text-sm text-gray-500" v-html="activePaymentMethod.description" />
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
}

.payment-option-item {
  @apply w-full;
}

.payment-option {
  @apply w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-left text-sm font-medium text-gray-900 transition-colors hover:border-gray-400 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40;
  @apply flex items-center justify-between gap-3;
}

.payment-option-content {
  @apply inline-flex items-center gap-2 min-w-0;
}

.gateway-label {
  @apply truncate;
}

.payment-option-radio {
  @apply inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors;
}

.payment-option.active-option {
  @apply border-primary bg-primary/5 shadow-sm;
}

.payment-option-radio-dot {
  @apply h-2.5 w-2.5 rounded-full transition-colors;
}

.payment-option-description {
  @apply px-4;
}

@container (max-width: 36rem) {
  .payment-options-grid {
    grid-template-columns: 1fr;
  }
}
</style>
