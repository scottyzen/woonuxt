<script setup lang="ts">
import type { Appearance, Stripe, StripeElements } from '@stripe/stripe-js';

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

const resolveRootCssVariable = (name: string, fallback: string): string => {
  if (!import.meta.client) return fallback;
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
};

const resolveBodyFontFamily = (): string => {
  if (!import.meta.client) return 'inherit';
  return getComputedStyle(document.body).fontFamily || 'inherit';
};

const stripeAppearance = computed<Appearance>(() => {
  const primaryColor = resolveRootCssVariable('--color-primary', '#7f54b2');
  const inputBorderColor = '#d1d5db';
  const inputBackgroundColor = '#f9fafb';
  const insetShadowColor = 'rgba(15, 23, 42, 0.06)';

  return {
    theme: 'flat',
    labels: 'above' as const,
    inputs: 'spaced' as const,
    variables: {
      colorPrimary: primaryColor,
      colorDanger: '#ef4444',
      fontFamily: resolveBodyFontFamily(),
      fontSizeBase: '16px',
      borderRadius: '6px',
    },
    rules: {
      '.Input': {
        backgroundColor: inputBackgroundColor,
        border: `1px solid ${inputBorderColor}`,
        padding: '10px 12px',
        boxShadow: `inset 0 1px 2px ${insetShadowColor}`,
      },
      '.Input:focus': {
        borderColor: 'var(--colorPrimary)',
        boxShadow: '0 0 0 1px var(--colorPrimary)',
      },
      '.Input--invalid': {
        borderColor: 'var(--colorDanger)',
        boxShadow: '0 0 0 1px var(--colorDanger)',
      },
    },
  };
});

const stripeCardStyle = computed(() => ({
  base: {
    color: '#111827',
    fontFamily: resolveBodyFontFamily(),
    fontSize: '16px',
    fontSmoothing: 'antialiased',
    iconColor: '#6b7280',
    '::placeholder': {
      color: '#9ca3af',
    },
  },
  invalid: {
    color: '#dc2626',
    iconColor: '#ef4444',
  },
}));

const resetStripeElements = () => {
  if (paymentElement) {
    paymentElement.unmount();
  }
  paymentElement = null;
  elements = null;
  elementsMode = null;
  emit('updateElement', null);
};

const createStripeElements = async () => {
  resetStripeElements();

  // Create different element types based on config
  switch (paymentMethodType.value) {
    case 'payment':
      if (props.clientSecret) {
        elements = props.stripe.elements({
          clientSecret: props.clientSecret,
          appearance: stripeAppearance.value,
        });
        elementsMode = 'intent';
      } else {
        if (!canCreateDeferred.value) return;
        elements = props.stripe.elements({
          mode: 'payment',
          currency: normalizedCurrency.value,
          amount: normalizedAmount.value ?? 0,
          appearance: stripeAppearance.value,
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
      paymentElement = elements.create('card', {
        hidePostalCode: true,
        style: stripeCardStyle.value,
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
      appearance: stripeAppearance.value,
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
    <div v-if="paymentMethodType === 'payment'" id="payment-element" class="stripe-element"></div>
    <div v-else id="card-element" class="stripe-element stripe-card-shell"></div>
  </div>
</template>

<style scoped>
@reference "#tailwind";

.stripe-elements-container,
.stripe-element {
  @apply w-full;
}

.stripe-card-shell {
  @apply rounded-md border border-gray-300 bg-gray-50 px-4 py-2 shadow-inner;
}
</style>
