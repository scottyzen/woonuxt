<script setup>
import { GqlGetStripePaymentIntent } from '#gql';
const { stripe } = defineProps(['stripe']);
const emit = defineEmits(['elements']);

const refreshStripeElements = async () => {
  if (!stripe) return;

  const { stripePaymentIntent } = await GqlGetStripePaymentIntent();
  const stripeEl = document.getElementById('stripe-payment');
  const elements = stripe?.elements({ clientSecret: stripePaymentIntent.clientSecret });
  const payEl = elements?.create('payment', { layout: 'tabs' });

  if (payEl && stripeEl) {
    payEl.mount(stripeEl);
    emit('updateElements', elements);
  }
};

const { cart } = useCart();
watch(
  () => cart.value,
  (newVal) => {
    if (newVal) refreshStripeElements();
  },
);

onMounted(() => {
  refreshStripeElements();
});
</script>

<template>
  <div id="stripe-payment" class="w-full">
    <LoadingIcon />
  </div>
</template>
