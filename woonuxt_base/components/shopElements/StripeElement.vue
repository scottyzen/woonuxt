<script setup>
const { cart } = useCart();

const { stripe } = defineProps(['stripe']);
const emit = defineEmits(['elements']);

let elements = null;

const refreshStripeElements = async () => {
  const totalForStripe = Math.round(parseFloat(cart.value?.rawTotal) * 100);
  if (!stripe || !cart.value || !totalForStripe) return;
  const { client_secret } = await fetch('/api/stripe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: totalForStripe }),
  }).then((res) => res.json());

  const stripeEl = document.getElementById('stripe-payment');
  elements = stripe?.elements({ clientSecret: client_secret });
  const payEl = elements?.create('payment', { layout: 'tabs' });

  if (payEl && stripeEl) {
    payEl.mount(stripeEl);
    emit('updateElements', elements);
  }
};

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
