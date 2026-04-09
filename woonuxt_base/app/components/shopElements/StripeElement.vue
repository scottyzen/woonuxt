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
  const backgroundColor = '#f9fafb';
  const borderColor = '#d1d5db';
  const surfaceColor = '#ffffff';
  const surfaceBorderColor = '#e5e7eb';
  const textColor = '#111827';
  const mutedTextColor = '#374151';
  const placeholderColor = '#9ca3af';
  const errorColor = '#ef4444';
  const shadowColor = 'rgba(15, 23, 42, 0.05)';
  const insetShadowColor = 'rgba(15, 23, 42, 0.06)';

  return {
    theme: 'flat',
    labels: 'above' as const,
    inputs: 'spaced' as const,
    variables: {
      colorPrimary: primaryColor,
      colorBackground: backgroundColor,
      colorText: textColor,
      colorTextSecondary: mutedTextColor,
      colorTextPlaceholder: placeholderColor,
      colorDanger: errorColor,
      iconColor: '#6b7280',
      iconCardCvcColor: '#6b7280',
      iconCardErrorColor: errorColor,
      fontFamily: resolveBodyFontFamily(),
      fontSizeBase: '16px',
      fontLineHeight: '1.5',
      fontWeightNormal: '400',
      fontWeightMedium: '500',
      spacingUnit: '4px',
      gridRowSpacing: '16px',
      gridColumnSpacing: '16px',
      borderRadius: '6px',
      focusOutline: 'none',
      focusBoxShadow: '0 0 0 1px var(--colorPrimary)',
    },
    rules: {
      '.Label': {
        color: mutedTextColor,
        fontSize: '14px',
        fontWeight: '500',
      },
      '.Input': {
        backgroundColor,
        border: `1px solid ${borderColor}`,
        boxShadow: `inset 0 1px 2px ${insetShadowColor}`,
      },
      '.Input::placeholder': {
        color: placeholderColor,
      },
      '.Input:focus': {
        borderColor: 'var(--colorPrimary)',
        boxShadow: '0 0 0 1px var(--colorPrimary)',
      },
      '.Input--invalid': {
        borderColor: 'var(--colorDanger)',
        boxShadow: '0 0 0 1px var(--colorDanger)',
      },
      '.Tab': {
        backgroundColor: surfaceColor,
        border: `1px solid ${surfaceBorderColor}`,
        boxShadow: `0 1px 2px ${shadowColor}`,
      },
      '.Tab:hover': {
        color: textColor,
        borderColor,
      },
      '.Tab--selected': {
        backgroundColor: surfaceColor,
        borderColor: 'var(--colorPrimary)',
        boxShadow: '0 0 0 1px var(--colorPrimary)',
      },
      '.TabIcon': {
        color: '#6b7280',
      },
      '.TabIcon--selected': {
        color: 'var(--colorPrimary)',
      },
      '.TabLabel': {
        color: mutedTextColor,
        fontWeight: '500',
      },
      '.TabLabel--selected': {
        color: textColor,
      },
      '.Block': {
        backgroundColor: surfaceColor,
        border: `1px solid ${surfaceBorderColor}`,
        boxShadow: `0 1px 2px ${shadowColor}`,
      },
      '.BlockDivider': {
        backgroundColor: surfaceBorderColor,
      },
      '.PickerItem': {
        backgroundColor: surfaceColor,
        border: `1px solid ${surfaceBorderColor}`,
        boxShadow: `0 1px 2px ${shadowColor}`,
      },
      '.PickerItem--selected': {
        borderColor: 'var(--colorPrimary)',
        boxShadow: '0 0 0 1px var(--colorPrimary)',
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
    <!-- Payment Element container (shows multiple payment methods in tabs/accordion) -->
    <div v-if="paymentMethodType === 'payment'" id="payment-element" class="stripe-element">
      <!-- Payment Element will be mounted here -->
    </div>

    <!-- Card Element container (traditional single card input) -->
    <div v-else id="card-element" class="stripe-element stripe-card-shell">
      <!-- Card Element will be mounted here -->
    </div>
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