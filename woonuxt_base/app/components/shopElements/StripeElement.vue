<script setup lang="ts">
import type { Stripe, StripeElements, StripeElementsOptionsMode } from '@stripe/stripe-js';

const { cart } = useCart();

const { stripe } = defineProps({
  stripe: { type: Object as PropType<Stripe>, default: null, required: true },
});

const rawCartTotal = computed(() => cart.value && parseFloat(cart.value.rawTotal as string) * 100);
const emit = defineEmits(['updateElement']);
let elements: StripeElements | null = null;

const options: StripeElementsOptionsMode = {
  mode: 'payment',
  currency: 'eur',
  amount: rawCartTotal.value || 0,
};

const createStripeElements = async () => {
  elements = stripe.elements(options);
  const paymentElement = elements.create('payment');
  paymentElement.mount('#payment-element');
  emit('updateElement', elements);
};

const updateStripeElements = async () => {
  elements?.update({ amount: rawCartTotal.value || 0 });
};

onMounted(() => {
  createStripeElements();
});

watch(rawCartTotal, (newAmount) => {
  updateStripeElements();
});
</script>

<template>
  <div id="payment-element">
    <!-- Elements will create form elements here -->
  </div>
</template>
