<script setup lang="ts">
import type { Appearance, Stripe, StripeElements } from '@stripe/stripe-js';

const props = defineProps<{
  stripe: Stripe;
  clientSecret?: string | null;
  customerSessionClientSecret?: string | null;
  customerId?: string | null;
  amount?: number | null;
  currency?: string | null;
  saveForFuture?: boolean;
  paymentDefaults?: {
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    address?: {
      line1?: string | null;
      line2?: string | null;
      city?: string | null;
      state?: string | null;
      postal_code?: string | null;
      country?: string | null;
    } | null;
  } | null;
}>();
const emit = defineEmits(['updateElement']);
let elements: StripeElements | null = null;
let paymentElement: any = null;
let elementsMode: 'intent' | 'deferred' | null = null;

const normalizedCurrency = computed(() => (props.currency || '').toLowerCase());
const normalizedAmount = computed(() => (typeof props.amount === 'number' ? Math.max(0, props.amount) : null));
const normalizedSetupFutureUsage = computed<'off_session' | null>(() => (props.saveForFuture ? 'off_session' : null));
const paymentElementDefaultValues = computed(() => {
  const defaults = props.paymentDefaults;
  if (!defaults) return undefined;

  const billingDetails: Record<string, unknown> = {};
  const trimmedName = defaults.name?.trim();
  const trimmedEmail = defaults.email?.trim();
  const trimmedPhone = defaults.phone?.trim();

  if (trimmedName) billingDetails.name = trimmedName;
  if (trimmedEmail) billingDetails.email = trimmedEmail;
  if (trimmedPhone) billingDetails.phone = trimmedPhone;

  const address = defaults.address;
  if (address) {
    const normalizedAddress = Object.fromEntries(
      Object.entries({
        line1: address.line1?.trim(),
        line2: address.line2?.trim(),
        city: address.city?.trim(),
        state: address.state?.trim(),
        postal_code: address.postal_code?.trim(),
        country: address.country?.trim(),
      }).filter(([, value]) => !!value),
    );

    if (Object.keys(normalizedAddress).length) {
      billingDetails.address = normalizedAddress;
    }
  }

  if (!Object.keys(billingDetails).length) return undefined;
  return { billingDetails };
});

/** Deferred mode has no customer association. If a customerId is set, wait for
 * a clientSecret (intent mode) instead. */
const canCreateDeferred = computed(() => !props.clientSecret && !props.customerId && !!normalizedCurrency.value && (normalizedAmount.value ?? 0) > 0);

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

  if (props.clientSecret) {
    const elementsOptions: any = {
      clientSecret: props.clientSecret,
      appearance: stripeAppearance.value,
    };
    if (props.customerSessionClientSecret) {
      elementsOptions.customerSessionClientSecret = props.customerSessionClientSecret;
    }
    elements = props.stripe.elements(elementsOptions);
    elementsMode = 'intent';
  } else {
    if (!canCreateDeferred.value) return;
    elements = props.stripe.elements({
      mode: 'payment',
      currency: normalizedCurrency.value,
      amount: normalizedAmount.value ?? 0,
      setupFutureUsage: normalizedSetupFutureUsage.value,
      appearance: stripeAppearance.value,
    });
    elementsMode = 'deferred';
  }

  paymentElement = elements.create('payment', {
    layout: 'tabs',
    paymentMethodOrder: ['card', 'apple_pay', 'google_pay', 'paypal'],
    defaultValues: paymentElementDefaultValues.value,
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

  if (elements) emit('updateElement', elements);
};

watch(
  () => [props.clientSecret, props.customerSessionClientSecret],
  () => {
    if (!props.clientSecret && !canCreateDeferred.value) {
      resetStripeElements();
      return;
    }
    createStripeElements();
  },
);

watch([normalizedAmount, normalizedCurrency, normalizedSetupFutureUsage], async ([amount, currency, setupFutureUsage]) => {
  if (!elements || elementsMode !== 'deferred') return;
  if (!amount || !currency) return;

  try {
    await elements.update({
      mode: 'payment',
      amount,
      currency,
      setupFutureUsage,
      appearance: stripeAppearance.value,
    });
  } catch (error) {
    console.error('Failed to update Stripe elements:', error);
  }
});

watch(canCreateDeferred, (canCreate) => {
  if (!canCreate || elements) return;
  createStripeElements();
});

onMounted(() => {
  createStripeElements();
});
</script>

<template>
  <div class="stripe-elements-container">
    <div id="payment-element" class="stripe-element"></div>
  </div>
</template>

<style scoped>
@reference "#tailwind";

.stripe-elements-container,
.stripe-element {
  @apply w-full;
}
</style>
