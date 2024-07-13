<script setup lang="ts">
const { cart } = useCart();
const { stripe } = defineProps(['stripe']);

const rawCartTotal = computed(() => cart.value && parseFloat(cart.value.rawTotal as string) * 100);
const emit = defineEmits(['updateElement']);
let elements = null as any;

const options = {
  mode: 'payment',
  currency: 'eur',
  amount: rawCartTotal.value,
  // paymentMethodCreation: 'manual',
};

const createStripeElements = async () => {
  elements = stripe.elements(options);
  const paymentElement = elements.create('card', { hidePostalCode: true });
  paymentElement.mount('#card-element');
  emit('updateElement', elements);
};

onMounted(() => {
  createStripeElements();
});
</script>

<template>
  <div id="card-element">
    <!-- Elements will create form elements here -->
  </div>
</template>
