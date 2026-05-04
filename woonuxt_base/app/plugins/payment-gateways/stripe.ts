import type { PaymentGateway, Viewer } from '#types/gql';
import type { PaymentGatewayOption, PaymentGatewayPlugin } from '#types/payment-gateway-plugin';
import type { Stripe, StripeElements } from '@stripe/stripe-js';

import type { GetStripePaymentIntentQueryVariables } from '#gql/default';
import StripePaymentGateway from '../../components/payments/StripePaymentGateway.vue';
import { StripePaymentMethodEnum } from '#gql/default';
import { loadStripe } from '@stripe/stripe-js';

type SavedPaymentMethod = {
  id: number;
  token: string;
  customerId?: string | null;
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  cardType: string;
  isDefault: boolean;
};

type CheckoutViewer = Viewer & {
  stripeCustomerId?: string | null;
  savedPaymentMethods?: SavedPaymentMethod[] | null;
};

const STRIPE_META_KEYS = new Set([
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

const normalizedCardBrand = (cardType?: string | null): string => {
  const brand = cardType?.toLowerCase().replace(/[\s_-]/g, '') || '';
  if (brand.includes('visa')) return 'visa';
  if (brand.includes('master')) return 'mastercard';
  return 'card';
};

const cardBrandIcon = (cardType?: string | null): string | null => {
  const brand = normalizedCardBrand(cardType);
  return brand === 'card' ? null : `/icons/payment/${brand}.svg`;
};

export default defineNuxtPlugin(() => {
  const { registerGateway } = usePaymentGateways();
  const { cart, paymentGateways } = useCart();
  const { customer, viewer } = useAuth();
  const { orderInput, checkoutError, resolvePaymentMethodId } = useCheckout();
  const runtimeConfig = useRuntimeConfig();
  const route = useRoute();
  const stripeKey = runtimeConfig.public?.STRIPE_PUBLISHABLE_KEY || null;

  const stripe = useState<Stripe | null>('stripeClient', () => null);
  const elements = useState<StripeElements | null>('stripeElements', () => null);
  const savePaymentMethod = useState<boolean>('stripeSavePaymentMethod', () => false);
  const selectedSavedToken = useState<SavedPaymentMethod | null>('stripeSelectedSavedToken', () => null);
  const stripeClientSecret = useState<string | null>('stripeClientSecret', () => null);
  const stripeClientSecretSaveForFuture = useState<boolean | null>('stripeClientSecretSaveForFuture', () => null);
  let stripeLoader: Promise<Stripe | null> | null = null;

  const viewerAsCheckoutViewer = computed<CheckoutViewer | null>(() => viewer.value as CheckoutViewer | null);
  const stripeCustomerId = computed<string | null>(() => viewerAsCheckoutViewer.value?.stripeCustomerId ?? null);
  const savedPaymentMethods = computed<SavedPaymentMethod[]>(() => viewerAsCheckoutViewer.value?.savedPaymentMethods ?? []);
  const isCreatingAccountAtCheckout = computed<boolean>(() => !viewer.value && !!orderInput.value.createAccount);
  const canSavePaymentMethod = computed<boolean>(() => !!viewer.value || isCreatingAccountAtCheckout.value);
  const stripeGateway = computed(() => paymentGateways.value?.nodes.find((gateway) => gateway.id === 'stripe') ?? null);
  const stripeCurrency = computed(() => (runtimeConfig.public?.CURRENCY_CODE || 'USD').toLowerCase());
  const stripeAmount = computed(() => resolveStripeAmount(cart.value?.rawTotal ?? '0', stripeCurrency.value));
  const selectedPaymentMethodId = computed<string>(() => resolvePaymentMethodId(orderInput.value.paymentMethod));
  const isCheckoutRoute = computed<boolean>(() => route.path === '/checkout' || route.path === '/checkout/');
  const isStripeSelected = computed<boolean>(() => selectedPaymentMethodId.value === 'stripe');
  const isStripeCheckoutDisabled = computed<boolean>(() => {
    if (!isStripeSelected.value) return false;
    if (!stripe.value) return true;
    if (selectedSavedToken.value) return false;
    return !elements.value;
  });

  const clearStripeElements = (): void => {
    elements.value = null;
  };

  const clearStripePaymentIntent = (): void => {
    clearStripeElements();
    stripeClientSecret.value = null;
    stripeClientSecretSaveForFuture.value = null;
  };

  const ensureStripeLoaded = async (): Promise<Stripe | null> => {
    if (!import.meta.client || !stripeKey) return null;
    if (stripe.value) return stripe.value;

    stripeLoader ??= loadStripe(stripeKey);
    stripe.value = await stripeLoader;
    return stripe.value;
  };

  const activateStripeGateway = (): void => {
    if (stripeGateway.value) {
      orderInput.value.paymentMethod = stripeGateway.value;
    }
  };

  const upsertOrderMeta = (key: string, value: string): void => {
    const existingMeta = orderInput.value.metaData.find((entry: { key: string }) => entry.key === key);
    if (existingMeta) {
      existingMeta.value = value;
      return;
    }

    orderInput.value.metaData.push({ key, value });
  };

  const resetStripeOrderMeta = (): void => {
    orderInput.value.metaData = orderInput.value.metaData.filter((entry: { key: string }) => !STRIPE_META_KEYS.has(entry.key));
  };

  const createPaymentIntentVariables = (
    overrides: Omit<GetStripePaymentIntentQueryVariables, 'stripePaymentMethod'> = {},
  ): GetStripePaymentIntentQueryVariables => ({
    stripePaymentMethod: StripePaymentMethodEnum.PAYMENT,
    ...overrides,
  });

  const initStripePaymentIntent = async (saveForFuture = false) => {
    if (!isCheckoutRoute.value || !isStripeSelected.value || selectedSavedToken.value) return;
    if (!(await ensureStripeLoaded())) return;

    const customerId = stripeCustomerId.value;

    try {
      const vars = createPaymentIntentVariables({ saveForFuture });
      if (customerId) vars.customerId = customerId;

      const { stripePaymentIntent } = await GqlGetStripePaymentIntent(vars);

      if (stripePaymentIntent?.error) {
        console.warn('[Stripe] PaymentIntent init error:', stripePaymentIntent.error);
        return;
      }
      if (stripePaymentIntent?.clientSecret) {
        stripeClientSecret.value = stripePaymentIntent.clientSecret;
        stripeClientSecretSaveForFuture.value = saveForFuture;
      } else {
        console.warn('[Stripe] No clientSecret in response');
      }
    } catch (err) {
      console.error('[Stripe] Failed to init PaymentIntent:', err);
    }
  };

  const applyStripePaymentIntent = (paymentIntent: { id: string; payment_method?: unknown; amount: number; currency: string; status: string }): boolean => {
    upsertOrderMeta('_stripe_payment_intent_id', paymentIntent.id);
    if (paymentIntent.payment_method) {
      upsertOrderMeta('_stripe_payment_method_id', String(paymentIntent.payment_method));
    }
    upsertOrderMeta('_stripe_source_id', paymentIntent.id);
    upsertOrderMeta('_stripe_charge_captured', 'yes');
    upsertOrderMeta('_wc_stripe_payment_method_type', 'card');
    orderInput.value.transactionId = paymentIntent.id;
    return paymentIntent.status === 'succeeded' || paymentIntent.status === 'processing';
  };

  const confirmSavedPaymentMethod = async (): Promise<boolean> => {
    const stripeClient = await ensureStripeLoaded();
    if (!stripeClient || !selectedSavedToken.value) return false;

    const tokenCustomerId = selectedSavedToken.value.customerId || undefined;
    if (!tokenCustomerId) {
      throw new Error('Saved payment method is missing its Stripe customer ID.');
    }

    const { stripePaymentIntent } = await GqlGetStripePaymentIntent(createPaymentIntentVariables({ customerId: tokenCustomerId, saveForFuture: false }));
    if (stripePaymentIntent?.error) throw new Error(stripePaymentIntent.error);
    const clientSecret = stripePaymentIntent?.clientSecret ?? null;
    if (!clientSecret) throw new Error('Payment intent not available. Please refresh and try again.');

    const { error, paymentIntent } = await stripeClient.confirmPayment({
      clientSecret,
      confirmParams: {
        payment_method: selectedSavedToken.value.token,
        return_url: `${window.location.origin}/checkout/order-received`,
      },
      redirect: 'if_required',
    });

    if (error) throw new Error(error.message);
    return paymentIntent ? applyStripePaymentIntent(paymentIntent) : false;
  };

  const confirmNewPaymentMethod = async (): Promise<boolean> => {
    const stripeClient = await ensureStripeLoaded();
    if (!stripeClient) throw new Error('Stripe is not available. Please refresh and try again.');
    if (!elements.value) throw new Error('Your payment details are still loading. Please wait a moment and try again.');

    const saveForFuture = canSavePaymentMethod.value && savePaymentMethod.value;
    if (stripeClientSecret.value && stripeClientSecretSaveForFuture.value !== saveForFuture) {
      clearStripePaymentIntent();
      await initStripePaymentIntent(saveForFuture);
      throw new Error('Your payment details are still loading. Please wait a moment and try again.');
    }

    const { error: submitError } = await elements.value.submit();
    if (submitError) {
      console.error('Form validation failed:', submitError);
      throw new Error(submitError.message);
    }

    let clientSecret = stripeClientSecret.value;
    if (!clientSecret) {
      const { stripePaymentIntent } = await GqlGetStripePaymentIntent(
        createPaymentIntentVariables({
          customerId: stripeCustomerId.value || undefined,
          saveForFuture,
        }),
      );

      if (stripePaymentIntent?.error) {
        checkoutError.value = stripePaymentIntent.error;
        throw new Error(stripePaymentIntent.error);
      }

      clientSecret = stripePaymentIntent?.clientSecret ?? null;
    }

    if (!clientSecret) throw new Error('Payment intent not available. Please refresh and try again.');

    checkoutError.value = null;

    const { error, paymentIntent } = await stripeClient.confirmPayment({
      elements: elements.value,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/order-received`,
        payment_method_data: {
          billing_details: {
            name: `${customer.value?.billing?.firstName || ''} ${customer.value?.billing?.lastName || ''}`.trim() || undefined,
            email: customer.value?.billing?.email || undefined,
            phone: customer.value?.billing?.phone || undefined,
            address: {
              line1: customer.value?.billing?.address1 || undefined,
              line2: customer.value?.billing?.address2 || undefined,
              city: customer.value?.billing?.city || undefined,
              state: customer.value?.billing?.state || undefined,
              postal_code: customer.value?.billing?.postcode || undefined,
              country: customer.value?.billing?.country || undefined,
            },
          },
        },
      },
      redirect: 'if_required',
    });

    if (error) {
      console.error('Payment failed:', error);
      throw new Error(error.message);
    }

    if (paymentIntent) {
      const paymentIsPaid = applyStripePaymentIntent(paymentIntent);
      upsertOrderMeta('_stripe_fee', '0');
      upsertOrderMeta('_stripe_net', paymentIntent.amount.toString());
      upsertOrderMeta('_stripe_currency', paymentIntent.currency);
      return paymentIsPaid;
    }

    return false;
  };

  const confirmStripePayment = async (): Promise<boolean> => {
    if (selectedPaymentMethodId.value !== 'stripe') return false;

    if (selectedSavedToken.value) {
      return await confirmSavedPaymentMethod();
    } else {
      return await confirmNewPaymentMethod();
    }
  };

  const getCheckoutDisabledMessage = (): string => {
    if (!selectedPaymentMethodId.value) return 'Please select a payment method before checking out.';
    if (selectedPaymentMethodId.value === 'stripe') return 'Your payment details are still loading. Please wait a moment and try again.';
    return '';
  };

  const selectSavedPaymentMethod = (method: SavedPaymentMethod): void => {
    clearStripeElements();
    selectedSavedToken.value = method;
    activateStripeGateway();
  };

  const selectNewPaymentMethod = (): void => {
    clearStripeElements();
    selectedSavedToken.value = null;
  };

  const getStripePaymentOptions = (gateway: PaymentGateway): PaymentGatewayOption[] => [
    ...savedPaymentMethods.value.map((method, index) => ({
      id: `stripe-saved-${method.id}`,
      gateway,
      title: method.cardType,
      details: [`•••• ${method.last4}`, `expires ${method.expiryMonth}/${method.expiryYear}`],
      icon: cardBrandIcon(method.cardType),
      iconName: 'ion:card-outline',
      badge: method.isDefault ? 'Default' : null,
      sortOrder: index,
      isSelected: selectedSavedToken.value?.id === method.id,
      onSelect: () => selectSavedPaymentMethod(method),
    })),
    {
      id: 'stripe-new-payment-method',
      gateway,
      title: 'Credit / Debit Card',
      iconName: 'ion:card-outline',
      sortOrder: savedPaymentMethods.value.length + 100,
      isSelected: isStripeSelected.value && !selectedSavedToken.value,
      onSelect: selectNewPaymentMethod,
    },
  ];

  watch(
    [savedPaymentMethods, isCheckoutRoute],
    ([methods, onCheckout]) => {
      if (!onCheckout) return;
      if (methods.length > 0 && !selectedSavedToken.value) {
        selectedSavedToken.value = methods.find((method) => method.isDefault) ?? methods[0]!;
        activateStripeGateway();
      }
    },
    { immediate: true },
  );

  watch(selectedSavedToken, async (token, previousToken) => {
    if (token) {
      clearStripeElements();
      activateStripeGateway();
      return;
    }

    if (previousToken && !stripeClientSecret.value) {
      await initStripePaymentIntent(canSavePaymentMethod.value && savePaymentMethod.value);
    }
  });

  watch(
    [stripeGateway, isCheckoutRoute],
    ([gateway, onCheckout]) => {
      if (onCheckout && gateway && selectedSavedToken.value) {
        orderInput.value.paymentMethod = gateway;
      }
    },
    { immediate: true },
  );

  watch(
    () => canSavePaymentMethod.value,
    (canSave) => {
      if (!canSave) savePaymentMethod.value = false;
    },
    { immediate: true },
  );

  watch(savePaymentMethod, async (saveForFuture) => {
    if (!isCheckoutRoute.value || !isStripeSelected.value || selectedSavedToken.value) return;
    if (!stripeClientSecret.value || stripeClientSecretSaveForFuture.value === saveForFuture) return;

    clearStripePaymentIntent();
    await initStripePaymentIntent(saveForFuture);
  });

  watch(stripeCustomerId, (newId, oldId) => {
    if (!isCheckoutRoute.value || !isStripeSelected.value) return;
    if (selectedSavedToken.value) return;
    if (newId && newId !== oldId) {
      clearStripePaymentIntent();
      initStripePaymentIntent(canSavePaymentMethod.value && savePaymentMethod.value);
    }
  });

  const stripeGatewayPlugin: PaymentGatewayPlugin = {
    id: 'stripe',
    name: 'Stripe',
    iconName: 'ion:card-outline',
    component: StripePaymentGateway,
    getPaymentOptions: getStripePaymentOptions,
    onSelect: async () => {
      await ensureStripeLoaded();
      if (!selectedSavedToken.value && !stripeClientSecret.value) {
        await initStripePaymentIntent(canSavePaymentMethod.value && savePaymentMethod.value);
      }
    },
    onDeselect: () => {
      selectedSavedToken.value = null;
      clearStripeElements();
    },
    isReady: () => !isStripeCheckoutDisabled.value,
    getDisabledMessage: getCheckoutDisabledMessage,
    reset: resetStripeOrderMeta,
    processPayment: async () => {
      const paymentIsPaid = await confirmStripePayment();
      return { success: true, isPaid: paymentIsPaid };
    },
    getComponentProps: () => ({
      stripe: stripe.value,
      clientSecret: stripeClientSecret.value,
      customerId: stripeCustomerId.value,
      amount: stripeAmount.value,
      currency: stripeCurrency.value,
      canSavePaymentMethod: canSavePaymentMethod.value,
      savePaymentMethod: savePaymentMethod.value,
      shouldShowStripeElement: isStripeSelected.value && !selectedSavedToken.value,
    }),
    getComponentEvents: () => ({
      updateElement: (element: unknown) => {
        elements.value = element as StripeElements | null;
      },
      updateSavePaymentMethod: (value: unknown) => {
        savePaymentMethod.value = !!value;
      },
    }),
  };

  registerGateway(stripeGatewayPlugin);
});
