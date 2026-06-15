<script setup lang="ts">
import type { Stripe } from '@stripe/stripe-js';

const props = defineProps<{
  stripe: Stripe | null;
  clientSecret?: string | null;
  customerId?: string | null;
  amount?: number | null;
  currency?: string | null;
  canSavePaymentMethod?: boolean;
  savePaymentMethod?: boolean;
  shouldShowStripeElement?: boolean;
}>();

const emit = defineEmits<{
  updateElement: [element: unknown];
  updateSavePaymentMethod: [value: boolean];
}>();

const isStripeElementVisible = computed(() => !!props.stripe && props.shouldShowStripeElement);
const shouldShowSavePaymentMethod = computed(() => isStripeElementVisible.value && !!props.canSavePaymentMethod);
const saveForFuture = computed({
  get: () => !!props.savePaymentMethod,
  set: (value: boolean) => emit('updateSavePaymentMethod', value),
});
</script>

<template>
  <div>
    <StripeElement
      v-if="isStripeElementVisible && stripe"
      :stripe
      :client-secret="clientSecret"
      :customer-id="customerId"
      :amount="amount"
      :currency="currency"
      :save-for-future="canSavePaymentMethod && saveForFuture"
      @update-element="(element) => emit('updateElement', element)" />

    <div v-if="shouldShowSavePaymentMethod" class="mt-3 flex items-start gap-2">
      <input
        id="save-payment-method"
        v-model="saveForFuture"
        type="checkbox"
        name="save-payment-method"
        class="mt-0.5 h-4 w-4 rounded-sm border-gray-300 bg-white text-primary focus:ring-3 focus:ring-primary" />
      <label for="save-payment-method" class="text-sm font-medium text-gray-700"> Save payment information to my account for future purchases. </label>
    </div>
  </div>
</template>
