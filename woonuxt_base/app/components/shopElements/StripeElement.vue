<script setup lang="ts">
import type { Stripe, StripeElements, StripeElementsOptionsMode } from '@stripe/stripe-js';

const { cart } = useCart();
const { storeSettings } = useAppConfig();

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

  if (storeSettings.stripePaymentMethod === 'payment') {
    const paymentElement = elements.create('payment');
    paymentElement.mount('#payment-element');
  } else {
    const paymentElement = elements.create('card', { hidePostalCode: true });
    paymentElement.mount('#card-element');
  }

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
  <div v-if="storeSettings.stripePaymentMethod === 'payment'" id="payment-element">
    <!-- Elements will create form elements here -->
  </div>
  <div v-else id="card-element">
    <!-- Elements will create form elements here -->
  </div>
</template>
