<script setup lang="ts">
import type { SavedPaymentMethod } from '#types/stripe-checkout';

const props = defineProps<{
  paymentMethods: SavedPaymentMethod[];
  selectedPaymentMethodKey: string;
  getPaymentMethodKey: (paymentMethod: SavedPaymentMethod) => string;
  title?: string;
  showHeader?: boolean;
  showManageAction?: boolean;
  manageLabel?: string;
  radioName?: string;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (event: 'select', paymentMethod: SavedPaymentMethod): void;
  (event: 'manage'): void;
}>();

const sectionTitle = computed<string>(() => props.title ?? 'Saved cards');
const shouldShowHeader = computed<boolean>(() => props.showHeader ?? true);
const manageActionLabel = computed<string>(() => props.manageLabel ?? 'Manage');
const paymentMethodRadioName = computed<string>(() => props.radioName ?? 'saved-payment-method-selector');

const selectPaymentMethod = (paymentMethod: SavedPaymentMethod): void => {
  emit('select', paymentMethod);
};
</script>

<template>
  <div v-if="paymentMethods.length > 0" class="space-y-3">
    <div v-if="shouldShowHeader" class="flex items-center justify-between gap-3">
      <p class="text-xs font-semibold tracking-wide text-gray-500 uppercase">{{ sectionTitle }}</p>
      <button v-if="showManageAction" type="button" class="text-sm font-medium text-primary transition-colors hover:text-primary-dark" @click="emit('manage')">
        {{ manageActionLabel }}
      </button>
    </div>

    <div class="flex flex-col gap-3">
      <label
        v-for="paymentMethod in paymentMethods"
        :key="getPaymentMethodKey(paymentMethod)"
        :for="`saved-pm-${getPaymentMethodKey(paymentMethod)}`"
        :class="[
          'flex items-center gap-3 rounded-lg border px-4 py-3 transition-colors',
          props.disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer',
          selectedPaymentMethodKey === getPaymentMethodKey(paymentMethod)
            ? 'border-primary bg-primary/5 shadow-sm'
            : 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50',
        ]">
        <input
          :id="`saved-pm-${getPaymentMethodKey(paymentMethod)}`"
          type="radio"
          :name="paymentMethodRadioName"
          :checked="selectedPaymentMethodKey === getPaymentMethodKey(paymentMethod)"
          :disabled="props.disabled"
          class="sr-only hidden"
          @change="selectPaymentMethod(paymentMethod)" />

        <PaymentGatewayIcon :brand="paymentMethod.cardType" :alt="paymentMethod.cardType" />

        <span class="flex min-w-0 flex-1 flex-col">
          <span class="capitalize text-base leading-tight font-medium text-gray-900">{{ paymentMethod.cardType }} ending in {{ paymentMethod.last4 }}</span>
          <span class="text-sm font-normal text-gray-500">Expires {{ paymentMethod.expiryMonth }}/{{ paymentMethod.expiryYear }}</span>
        </span>

        <span v-if="paymentMethod.isDefault" class="text-xs font-semibold text-primary">Default</span>

        <span
          class="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors"
          :class="selectedPaymentMethodKey === getPaymentMethodKey(paymentMethod) ? 'border-primary bg-primary/10' : 'border-gray-400 bg-white'">
          <span
            class="h-2.5 w-2.5 rounded-full transition-colors"
            :class="selectedPaymentMethodKey === getPaymentMethodKey(paymentMethod) ? 'bg-primary' : 'bg-transparent'" />
        </span>
      </label>
    </div>
  </div>
</template>
