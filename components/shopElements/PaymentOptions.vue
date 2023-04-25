<script setup>
const props = defineProps({
  modelValue: { type: String, required: true, default: 'stripe' },
  paymentGateways: { type: Array, required: true },
});

const paymentMethod = toRef(props, 'modelValue');

const emits = defineEmits(['update:modelValue']);

const updatePaymentMethod = (value) => {
  emits('update:modelValue', value);
};

onMounted(() => {
  // Emit first payment method
  updatePaymentMethod(props.paymentGateways[0].id);
});
</script>

<template>
  <div class="grid gap-4 leading-tight payment-options">
    <div v-for="gateway in paymentGateways" :key="gateway.id" class="option" :class="{ 'active-option': paymentMethod === gateway.id }" @click="updatePaymentMethod(gateway.id)">
      <icon v-if="gateway.id === 'stripe'" name="ion:card-outline" size="20" class="text-gray-600" />
      <icon v-else-if="gateway.id === 'paypal'" name="ion:logo-paypal" size="20" class="text-gray-600" />
      <icon v-else name="ion:cash-outline" size="20" class="text-gray-600" />
      <span>{{ gateway.title }}</span>
      <icon name="ion:checkmark-circle" size="20" class="ml-auto text-primary checkmark" />
    </div>
  </div>
</template>

<style lang="postcss">
.payment-options {
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
}

.payment-options .option {
  @apply bg-white border rounded-lg cursor-pointer flex w-full py-3 px-4 gap-2 items-center hover:border-purple-300;
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
