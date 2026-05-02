<script setup lang="ts">
import type { PaymentGateway, PaymentGateways } from '#types/gql';

export type SavedPaymentMethod = {
  id: number;
  token: string;
  customerId?: string | null;
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  cardType: string;
  isDefault: boolean;
};

const props = defineProps<{
  modelValue: string | object;
  paymentGateways: PaymentGateways;
  savedPaymentMethods?: SavedPaymentMethod[];
  selectedSavedPaymentMethod?: SavedPaymentMethod | null;
}>();

const paymentMethod = toRef(props, 'modelValue');
const emits = defineEmits<{
  'update:modelValue': [gateway: PaymentGateway];
  'update:selectedSavedPaymentMethod': [method: SavedPaymentMethod | null];
}>();
const gateways = computed<PaymentGateway[]>(() => props.paymentGateways?.nodes || []);
const savedMethods = computed<SavedPaymentMethod[]>(() => props.savedPaymentMethods || []);

const selectedGatewayId = computed<string>(() => {
  const value = paymentMethod.value as PaymentGateway | string | null | undefined;
  return (typeof value === 'string' ? value : value?.id) || gateways.value[0]?.id || '';
});

const activePaymentMethod = computed<PaymentGateway | null>(() => {
  return gateways.value.find((gateway) => gateway.id === selectedGatewayId.value) || null;
});

const normalizedCardBrand = (cardType?: string | null): string => {
  const brand = cardType?.toLowerCase().replace(/[\s_-]/g, '') || '';
  if (brand.includes('visa')) return 'visa';
  if (brand.includes('master')) return 'mastercard';
  return 'card';
};

const cardBrandIcon = (cardType?: string | null): string | null => {
  const brand = normalizedCardBrand(cardType);
  return brand === 'card' ? null : `/icons/payment/${brand}.svg`;
};

const gatewayIcon = (gateway: PaymentGateway): string | null => {
  if (gateway.id === 'paypal') return '/icons/payment/paypal.svg';
  return gateway.icon || null;
};

const updatePaymentMethod = (gateway: PaymentGateway) => {
  emits('update:selectedSavedPaymentMethod', null);
  emits('update:modelValue', gateway);
};

const updateSavedPaymentMethod = (method: SavedPaymentMethod) => {
  emits('update:selectedSavedPaymentMethod', method);
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
  <div class="w-full">
    <div class="grid gap-3" role="radiogroup" aria-label="Payment options">
      <button
        v-for="method in savedMethods"
        :key="method.id"
        type="button"
        class="flex w-full items-center justify-between gap-3 rounded-lg border bg-white px-4 py-3 text-left text-sm font-medium text-gray-900 transition-colors hover:border-primary hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        :class="selectedSavedPaymentMethod?.id === method.id ? 'border-primary' : 'border-gray-300'"
        role="radio"
        :aria-checked="selectedSavedPaymentMethod?.id === method.id"
        :title="`${method.cardType} ending in ${method.last4}`"
        @click="updateSavedPaymentMethod(method)">
        <span class="flex min-w-0 flex-1 items-center gap-3">
          <span class="grid h-6 w-6 flex-none place-items-center" aria-hidden="true">
            <NuxtImg
              v-if="cardBrandIcon(method.cardType)"
              :src="cardBrandIcon(method.cardType)!"
              :alt="method.cardType"
              width="28"
              height="20"
              class="h-5 w-6 object-contain"
              fit="contain"
              loading="lazy" />
            <icon v-else name="ion:card-outline" size="22" class="text-gray-600" />
          </span>
          <span class="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1 leading-tight">
            <span class="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1">
              <span class="text-base font-semibold capitalize">{{ method.cardType }}</span>
              <span class="text-base font-semibold text-gray-500">•••• {{ method.last4 }}</span>
            </span>
            <span class="text-base font-medium text-gray-500">expires {{ method.expiryMonth }}/{{ method.expiryYear }}</span>
          </span>
          <span v-if="method.isDefault" class="ml-auto hidden flex-none text-xs font-semibold text-primary sm:inline">Default</span>
        </span>
        <span
          class="grid h-4 w-4 flex-none place-items-center rounded-full border transition-colors"
          :class="selectedSavedPaymentMethod?.id === method.id ? 'border-primary bg-primary' : 'border-gray-300 bg-white'"
          aria-hidden="true">
          <span class="h-2 w-2 rounded-full bg-white" :class="selectedSavedPaymentMethod?.id === method.id ? 'opacity-100' : 'opacity-0'"></span>
        </span>
      </button>

      <button
        v-for="gateway in gateways"
        :key="gateway.id"
        type="button"
        class="flex w-full items-center justify-between gap-3 rounded-lg border bg-white px-4 py-3 text-left text-sm font-medium text-gray-900 transition-colors hover:border-primary hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        :class="!selectedSavedPaymentMethod && gateway.id === selectedGatewayId ? 'border-primary' : 'border-gray-300'"
        role="radio"
        :aria-checked="!selectedSavedPaymentMethod && gateway.id === selectedGatewayId"
        :title="gateway?.description || gateway?.title || 'Payment Method'"
        @click="updatePaymentMethod(gateway)">
        <span class="flex min-w-0 flex-1 items-center gap-3">
          <span class="grid h-6 w-6 flex-none place-items-center" aria-hidden="true">
            <NuxtImg
              v-if="gatewayIcon(gateway)"
              :src="gatewayIcon(gateway)!"
              :alt="gateway.title || 'Payment Method'"
              width="28"
              height="24"
              class="h-5 w-6 object-contain"
              fit="contain"
              loading="lazy" />
            <icon v-else-if="gateway.id === 'stripe'" name="ion:card-outline" size="22" class="text-gray-600" />
            <icon v-else name="ion:cash-outline" size="22" class="text-gray-600" />
          </span>
          <span class="min-w-0 truncate text-base font-semibold leading-tight" v-html="gateway.title"></span>
        </span>
        <span
          class="grid h-4 w-4 flex-none place-items-center rounded-full border transition-colors"
          :class="!selectedSavedPaymentMethod && gateway.id === selectedGatewayId ? 'border-primary bg-primary' : 'border-gray-300 bg-white'"
          aria-hidden="true">
          <span
            class="h-2 w-2 rounded-full bg-white"
            :class="!selectedSavedPaymentMethod && gateway.id === selectedGatewayId ? 'opacity-100' : 'opacity-0'"></span>
        </span>
      </button>
    </div>

    <div v-if="!selectedSavedPaymentMethod && activePaymentMethod?.description" class="prose block w-full mt-3">
      <p class="text-sm text-gray-500" v-html="activePaymentMethod.description"></p>
    </div>
  </div>
</template>
