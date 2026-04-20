import type { CheckoutViewer, SavedPaymentMethod, StripePaymentDefaults } from '#types/stripe-checkout';

import { loadStripe } from '@stripe/stripe-js';

export const useStripeCheckout = async () => {
  const runtimeConfig = useRuntimeConfig();
  const { cart, paymentGateways } = useCart();
  const { customer, viewer } = useAuth();
  const { orderInput } = useCheckout();

  const stripeKey = runtimeConfig.public?.STRIPE_PUBLISHABLE_KEY || null;
  const stripe = stripeKey ? await loadStripe(stripeKey) : null;

  const stripeClientSecret = ref<string | null>(null);
  const stripeCustomerSessionSecret = ref<string | null>(null);
  const savePaymentMethod = ref<boolean>(false);
  const selectedSavedToken = ref<SavedPaymentMethod | null>(null);

  const stripeCustomerId = computed<string | null>(() => (viewer.value as CheckoutViewer | null)?.stripeCustomerId ?? null);
  const savedPaymentMethods = computed<SavedPaymentMethod[]>(() => (viewer.value as CheckoutViewer | null)?.savedPaymentMethods ?? []);
  const isCreatingAccountAtCheckout = computed<boolean>(() => !viewer.value && !!orderInput.value.createAccount);
  const canSavePaymentMethod = computed<boolean>(() => !!viewer.value || isCreatingAccountAtCheckout.value);
  const checkoutPaymentGateways = computed(() => paymentGateways.value);
  const stripeGateway = computed(() => checkoutPaymentGateways.value?.nodes.find((gateway) => gateway.id === 'stripe') ?? null);
  const stripeCurrency = computed(() => (runtimeConfig.public?.CURRENCY_CODE || 'USD').toLowerCase());

  const resolveStripeAmount = (rawTotal: string | number | null | undefined, currency: string): number => {
    const parsed = Number.parseFloat(String(rawTotal ?? '0'));
    if (!Number.isFinite(parsed)) return 0;

    const fractionDigits =
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency.toUpperCase(),
      }).resolvedOptions().maximumFractionDigits ?? 2;

    return Math.round(parsed * 10 ** fractionDigits);
  };

  const stripeAmount = computed(() => resolveStripeAmount(cart.value?.rawTotal ?? '0', stripeCurrency.value));
  const viewerEmail = computed<string>(() => customer.value?.billing?.email || (viewer.value as CheckoutViewer | null)?.email || '');
  const viewerFirstName = computed<string>(() => customer.value?.billing?.firstName || (viewer.value as CheckoutViewer | null)?.firstName || '');

  const getSavedPaymentMethodKey = (paymentMethod: SavedPaymentMethod): string => {
    const tokenKey = paymentMethod.token?.trim();
    if (tokenKey) return tokenKey;
    return [paymentMethod.customerId || 'guest', paymentMethod.id, paymentMethod.last4, paymentMethod.expiryMonth, paymentMethod.expiryYear].join('-');
  };

  const selectedSavedPaymentMethodKey = computed<string>(() => (selectedSavedToken.value ? getSavedPaymentMethodKey(selectedSavedToken.value) : ''));

  const stripePaymentElementDefaults = computed<StripePaymentDefaults | undefined>(() => {
    const billing = customer.value?.billing;
    const checkoutViewer = viewer.value as CheckoutViewer | null;
    const fullName = `${billing?.firstName || checkoutViewer?.firstName || ''} ${billing?.lastName || checkoutViewer?.lastName || ''}`.trim();
    const address = {
      line1: billing?.address1 || undefined,
      line2: billing?.address2 || undefined,
      city: billing?.city || undefined,
      state: billing?.state || undefined,
      postal_code: billing?.postcode || undefined,
      country: billing?.country || undefined,
    };
    const hasAddress = Object.values(address).some(Boolean);
    const defaults: StripePaymentDefaults = {
      name: fullName || undefined,
      email: billing?.email || checkoutViewer?.email || undefined,
      phone: billing?.phone || undefined,
      address: hasAddress ? address : undefined,
    };

    return Object.values(defaults).some(Boolean) ? defaults : undefined;
  });

  const viewerGreeting = computed<string>(() =>
    viewerFirstName.value ? `Welcome back, ${customer.value?.billing?.firstName} ${customer.value?.billing?.lastName || ''}` : 'Welcome',
  );

  const resolvePaymentMethodId = (paymentMethod: unknown): string => {
    if (typeof paymentMethod === 'string') return paymentMethod;
    if (paymentMethod && typeof paymentMethod === 'object' && 'id' in paymentMethod) {
      return String((paymentMethod as { id?: string | null }).id ?? '');
    }
    return '';
  };

  const selectedPaymentMethodId = computed<string>(() => resolvePaymentMethodId(orderInput.value.paymentMethod));

  const activateStripeGateway = (): void => {
    if (stripeGateway.value) {
      orderInput.value.paymentMethod = stripeGateway.value;
    }
  };

  const resetStripeOrderMeta = (): void => {
    const stripeMetaKeys = new Set([
      '_stripe_payment_intent_id',
      '_stripe_payment_method_id',
      '_stripe_source_id',
      '_stripe_fee',
      '_stripe_net',
      '_stripe_currency',
      '_stripe_charge_captured',
      '_wc_stripe_payment_method_type',
      '_stripe_intent_id',
    ]);

    orderInput.value.metaData = orderInput.value.metaData.filter((entry: { key: string }) => !stripeMetaKeys.has(entry.key));
  };

  const initStripePaymentIntent = async () => {
    if (!stripe || selectedSavedToken.value) return;

    const customerId = stripeCustomerId.value;

    try {
      const vars: any = { stripePaymentMethod: 'PAYMENT' as any, saveForFuture: false };
      if (customerId) vars.customerId = customerId;

      const { stripePaymentIntent } = await GqlGetStripePaymentIntent(vars);

      if (stripePaymentIntent?.error) {
        console.warn('[Stripe] PaymentIntent init error:', stripePaymentIntent.error);
        return;
      }
      if (stripePaymentIntent?.clientSecret) {
        stripeClientSecret.value = stripePaymentIntent.clientSecret;
        stripeCustomerSessionSecret.value = null;
      } else {
        console.warn('[Stripe] No clientSecret in response');
      }
    } catch (err) {
      console.error('[Stripe] Failed to init PaymentIntent:', err);
    }
  };

  return {
    stripe,
    stripeClientSecret,
    stripeCustomerSessionSecret,
    savePaymentMethod,
    selectedSavedToken,
    stripeCustomerId,
    savedPaymentMethods,
    canSavePaymentMethod,
    checkoutPaymentGateways,
    stripeGateway,
    stripeCurrency,
    stripeAmount,
    viewerEmail,
    viewerGreeting,
    selectedSavedPaymentMethodKey,
    stripePaymentElementDefaults,
    selectedPaymentMethodId,
    getSavedPaymentMethodKey,
    activateStripeGateway,
    resetStripeOrderMeta,
    initStripePaymentIntent,
  };
};
