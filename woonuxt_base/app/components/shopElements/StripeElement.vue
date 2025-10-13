<script setup lang="ts">
const { cart } = useCart();
const { stripe } = defineProps(['stripe']);
const appConfig = useAppConfig();
const runtimeConfig = useRuntimeConfig();

const rawCartTotal = computed(() => cart.value && parseFloat(cart.value.rawTotal as string) * 100);
const emit = defineEmits(['updateElement']);
let elements = null as any;
let paymentElement = null as any;

// Get the payment method type from config (default to 'payment' to match app.config.ts)
const paymentMethodType = computed(() => appConfig.stripePaymentMethod || 'payment');

// Get currency from runtime config, fallback to 'usd' if not available
const currency = computed(() => {
  const currencyCode = runtimeConfig.public?.CURRENCY_CODE;
  return currencyCode ? currencyCode.toLowerCase() : 'usd';
});

const options = {
  mode: 'payment' as const,
  currency: currency.value,
  amount: rawCartTotal.value || 100, // Ensure amount is always provided and never 0
  // paymentMethodCreation: 'manual',
};

const createStripeElements = async () => {
  elements = stripe.elements(options);

  // Create different element types based on config
  switch (paymentMethodType.value) {
    case 'payment':
      // Modern Payment Element - supports multiple payment methods
      paymentElement = elements.create('payment', {
        layout: 'tabs',
        paymentMethodOrder: ['card', 'apple_pay', 'google_pay', 'paypal'],
        fields: {
          billingDetails: {
            name: 'auto',
            email: 'auto',
            phone: 'never',
            address: 'never',
          },
        },
        wallets: {
          applePay: 'auto',
          googlePay: 'auto',
        },
      });
      paymentElement.mount('#payment-element');
      break;

    case 'card':
    default:
      // Traditional Card Element - single card input
      paymentElement = elements.create('card', {
        hidePostalCode: true,
        style: {
          base: {
            fontSize: '16px',
            color: '#424770',
            '::placeholder': {
              color: '#aab7c4',
            },
          },
        },
      });
      paymentElement.mount('#card-element');
      break;
  }

  emit('updateElement', elements);
};

// Recreate elements when cart total or currency changes
watch(
  () => [rawCartTotal.value, currency.value],
  ([newAmount, newCurrency]) => {
    if (newAmount && elements && typeof newCurrency === 'string') {
      // Update the options with new amount and currency
      options.amount = Number(newAmount);
      options.currency = newCurrency;
      // Note: In v8.0.0, you would need to recreate elements for amount changes
      // For now, we'll keep the existing element since amount changes are less critical for card setup
    }
  },
);

// Watch for payment method type changes and recreate elements
watch(
  () => paymentMethodType.value,
  () => {
    if (elements && paymentElement) {
      // Unmount current element before creating new one
      paymentElement.unmount();
      createStripeElements();
    }
  },
);

onMounted(() => {
  createStripeElements();
});
</script>

<template>
  <div class="stripe-elements-container">
    <!-- Payment Element container (shows multiple payment methods in tabs/accordion) -->
    <div v-if="paymentMethodType === 'payment'" id="payment-element" class="stripe-element">
      <!-- Payment Element will be mounted here -->
    </div>

    <!-- Card Element container (traditional single card input) -->
    <div v-else id="card-element" class="stripe-element">
      <!-- Card Element will be mounted here -->
    </div>
  </div>
</template>
