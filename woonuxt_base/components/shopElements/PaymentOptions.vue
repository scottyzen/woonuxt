<script setup>
const props = defineProps({
  modelValue: { type: [String, Object], required: true },
  paymentGateways: { type: Array, required: true },
});

const paymentMethod = toRef(props, 'modelValue');
const activePaymentMethod = computed(() => paymentMethod.value);
const emits = defineEmits(['update:modelValue']);

const updatePaymentMethod = (value) => {
  emits('update:modelValue', value);
};

onMounted(() => {
  // Emit first payment method
  if (props.paymentGateways.length) updatePaymentMethod(props.paymentGateways[0]);
});
</script>

<template>
  <div class="flex gap-4 leading-tight flex-wrap">
    <div
      v-for="gateway in paymentGateways"
      :key="gateway.id"
      class="option"
      :class="{ 'active-option': paymentMethod === gateway.id }"
      @click="updatePaymentMethod(gateway)"
      :title="gateway.description">
      <icon v-if="gateway.id === 'stripe'" name="ion:card-outline" size="20" />
      <icon v-else-if="gateway.id === 'paypal'" name="ion:logo-paypal" size="20" />
      <icon v-else name="ion:cash-outline" size="20" />
      <span class="whitespace-nowrap" v-html="gateway.title" />
      <icon name="ion:checkmark-circle" size="20" class="ml-auto text-primary checkmark opacity-0" />
    </div>
    <div v-if="activePaymentMethod.description" class="prose">
      <p class="text-sm text-gray-500" v-html="activePaymentMethod.description" />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.option {
  @apply bg-white border rounded-lg text-gray-600 cursor-pointer flex flex-1 text-sm py-3 px-4 gap-2 items-center hover:border-purple-300;

  &.active-option {
    @apply border-primary cursor-default border-opacity-50 shadow-sm pointer-events-none;

    & .checkmark {
      @apply opacity-100;
    }
  }
}
</style>
