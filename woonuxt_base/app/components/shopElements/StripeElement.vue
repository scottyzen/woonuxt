<script setup lang="ts">
const { cart } = useCart();
const { stripe, clientSecret } = defineProps(['stripe', 'clientSecret']);
const appConfig = useAppConfig();

const rawCartTotal = computed(() => cart.value && parseFloat(cart.value.rawTotal as string) * 100);
const emit = defineEmits(['updateElement']);
let elements = null as any;
let paymentElement = null as any;

// Get the payment method type from config
const paymentMethodType = computed(() => appConfig.stripePaymentMethod || 'card');

const options = computed(() => {
  const baseOptions = {
    mode: 'payment' as const,
    currency: 'eur',
    amount: rawCartTotal.value || 100, // Ensure amount is always provided and never 0
    // paymentMethodCreation: 'manual',
  };

  // Add clientSecret for Payment Element if available
  if (paymentMethodType.value === 'payment' && clientSecret) {
    return {
      ...baseOptions,
      clientSecret: clientSecret,
    };
  }

  return baseOptions;
});

const createStripeElements = async () => {
  elements = stripe.elements(options.value);

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

// Recreate elements when cart total changes or client secret changes
watch([() => rawCartTotal.value, () => clientSecret], ([newAmount, newClientSecret]) => {
  if ((newAmount || newClientSecret) && elements && paymentElement) {
    // Unmount current element before creating new one
    paymentElement.unmount();
    createStripeElements();
  }
});

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
