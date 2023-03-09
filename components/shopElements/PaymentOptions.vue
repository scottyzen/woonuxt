<script setup>
const props = defineProps({
  modelValue: { type: String, required: true, default: 'stripe' },
});

const paymentMethod = toRef(props, 'modelValue');

const emits = defineEmits(['update:modelValue']);

const updatePaymentMethod = (value) => {
  emits('update:modelValue', value);
};
</script>

<template>
  <div class="leading-tight grid gap-4 payment-options">
    <div class="option" :class="{ 'active-option': paymentMethod === 'stripe' }" @click="updatePaymentMethod('stripe')">
      <icon name="ion:card-outline" size="20" class="text-gray-600" />
      <span>{{ $t('messages.billing.creditCard') }}</span>
      <icon name="ion:checkmark-circle" size="20" class="ml-auto text-primary checkmark" />
    </div>
    <div class="option" :class="{ 'active-option': paymentMethod === 'paypal' }" @click="updatePaymentMethod('paypal')">
      <img src="/icons/pp.svg" alt="PayPal Logo" width="16" height="16" />
      <span>PayPal</span>
      <icon name="ion:checkmark-circle" size="20" class="ml-auto text-primary checkmark" />
    </div>
    <div class="option" :class="{ 'active-option': paymentMethod === 'cod' }" @click="updatePaymentMethod('cod')">
      <icon name="ion:cash-outline" size="20" class="text-gray-600" />
      <span>{{ $t('messages.billing.cashOnDelivery') }}</span>
      <icon name="ion:checkmark-circle" size="20" class="ml-auto text-primary checkmark" />
    </div>
  </div>
</template>

<style lang="postcss">
.payment-options {
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
}

.payment-options .option {
  @apply bg-white border rounded-lg cursor-pointer flex w-full py-3 px-4 gap-2 items-center hover: border-purple-300;
}

.payment-options .active-option {
  @apply border-primary cursor-default border-opacity-50 shadow-sm;
  pointer-events: none;
}
.payment-options .option .checkmark {
  opacity: 0;
}
.payment-options .active-option .checkmark {
  opacity: 1;
}
</style>
