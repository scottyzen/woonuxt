<script setup lang="ts">
import type { Stripe, StripeElements } from '@stripe/stripe-js';

const props = defineProps<{
  stripe: Stripe;
  clientSecret?: string | null;
  amount?: number | null;
  currency?: string | null;
}>();
const appConfig = useAppConfig();

const emit = defineEmits(['updateElement']);
let elements: StripeElements | null = null;
let paymentElement: any = null;
let elementsMode: 'intent' | 'deferred' | null = null;

// Get the payment method type from config (default to 'payment' to match app.config.ts)
const paymentMethodType = computed(() => appConfig.stripePaymentMethod || 'payment');
const normalizedCurrency = computed(() => (props.currency || '').toLowerCase());
const normalizedAmount = computed(() => (typeof props.amount === 'number' ? Math.max(0, props.amount) : null));
const canCreateDeferred = computed(
  () => paymentMethodType.value === 'payment' && !props.clientSecret && !!normalizedCurrency.value && (normalizedAmount.value ?? 0) > 0,
);

const resetStripeElements = () => {
  if (paymentElement) {
    paymentElement.unmount();
  }
  paymentElement = null;
  elements = null;
  elementsMode = null;
};

const createStripeElements = async () => {
  resetStripeElements();

  // Create different element types based on config
  switch (paymentMethodType.value) {
    case 'payment':
      if (props.clientSecret) {
        elements = props.stripe.elements({ clientSecret: props.clientSecret });
        elementsMode = 'intent';
      } else {
        if (!canCreateDeferred.value) return;
        elements = props.stripe.elements({
          mode: 'payment',
          currency: normalizedCurrency.value,
          amount: normalizedAmount.value ?? 0,
        });
        elementsMode = 'deferred';
      }
      // Modern Payment Element - supports multiple payment methods
      paymentElement = elements.create('payment', {
        layout: 'tabs',
        paymentMethodOrder: ['card', 'apple_pay', 'google_pay', 'paypal'],
        fields: {
          billingDetails: {
            name: 'auto',
            email: 'auto',
            phone: 'auto',
            address: 'auto',
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
      elements = props.stripe.elements();
      elementsMode = 'intent';
      // Traditional Card Element - single card input
      // Check if dark mode is active
      const isDarkMode = document.documentElement.classList.contains('dark');
      paymentElement = elements.create('card', {
        hidePostalCode: true,
        style: {
          base: {
            fontSize: '16px',
            color: isDarkMode ? '#f3f4f6' : '#424770',
            backgroundColor: isDarkMode ? '#374151' : '#ffffff',
            '::placeholder': {
              color: isDarkMode ? '#9ca3af' : '#aab7c4',
            },
          },
        },
      });
      paymentElement.mount('#card-element');
      break;
  }

  if (elements) emit('updateElement', elements);
};

// Recreate elements when payment method or client secret changes
watch(
  () => [paymentMethodType.value, props.clientSecret],
  () => {
    if (paymentMethodType.value === 'payment' && !props.clientSecret && !canCreateDeferred.value) {
      resetStripeElements();
      return;
    }
    createStripeElements();
  },
);

watch([normalizedAmount, normalizedCurrency], async ([amount, currency]) => {
  if (paymentMethodType.value !== 'payment') return;
  if (!elements || elementsMode !== 'deferred') return;
  if (!amount || !currency) return;

  try {
    await elements.update({
      mode: 'payment',
      amount,
      currency,
    });
  } catch (error) {
    console.error('Failed to update Stripe elements:', error);
  }
});

watch(canCreateDeferred, (canCreate) => {
  if (!canCreate || elements || paymentMethodType.value !== 'payment') return;
  createStripeElements();
});

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
    <div v-else id="card-element" class="stripe-element bg-white dark:bg-gray-700 rounded-md p-4 border border-gray-300 dark:border-gray-600">
      <!-- Card Element will be mounted here -->
    </div>
  </div>
</template>
