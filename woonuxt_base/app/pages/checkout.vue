<script setup lang="ts">
import { loadStripe } from '@stripe/stripe-js';
import type { Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';
import type { Viewer } from '#types/gql';
const route = useRoute();

const { t } = useI18n();
const { query } = useRoute();
const { cart, paymentGateways } = useCart();
const { customer, viewer, navigateToLogin } = useAuth();
const { orderInput, isProcessingOrder, processCheckout, checkoutError, updateShippingLocation } = useCheckout();
const runtimeConfig = useRuntimeConfig();
const appConfig = useAppConfig();
const stripeKey = runtimeConfig.public?.STRIPE_PUBLISHABLE_KEY || null;

const buttonText = ref<string>(isProcessingOrder.value ? t('general.processing') : t('shop.checkoutButton'));
const savePaymentMethod = ref<boolean>(false);

type SavedPaymentMethod = {
  id: number;
  token: string; // pm_xxx
  customerId?: string | null; // cus_xxx — from WC token meta, authoritative over viewer.stripeCustomerId
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  cardType: string;
  isDefault: boolean;
};

type CheckoutViewer = Viewer & {
  stripeCustomerId?: string | null;
  savedPaymentMethods?: SavedPaymentMethod[] | null;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  databaseId?: number | null;
};
const stripeCustomerId = computed<string | null>(() => (viewer.value as CheckoutViewer | null)?.stripeCustomerId ?? null);
const savedPaymentMethods = computed<SavedPaymentMethod[]>(() => (viewer.value as CheckoutViewer | null)?.savedPaymentMethods ?? []);
const selectedSavedToken = ref<SavedPaymentMethod | null>(null);
const isCreatingAccountAtCheckout = computed<boolean>(() => !viewer.value && !!orderInput.value.createAccount);
const canSavePaymentMethod = computed<boolean>(() => !!viewer.value || isCreatingAccountAtCheckout.value);
const checkoutPaymentGateways = computed(() => paymentGateways.value);
const stripeGateway = computed(() => checkoutPaymentGateways.value?.nodes.find((gateway) => gateway.id === 'stripe') ?? null);

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

// Auto-select the default (or first) saved card when the viewer loads.
watch(
  savedPaymentMethods,
  (methods) => {
    if (methods.length > 0 && !selectedSavedToken.value) {
      selectedSavedToken.value = methods.find((m) => m.isDefault) ?? methods[0]!;
      activateStripeGateway();
    }
  },
  { immediate: true },
);

/**
 * Keep Stripe active when a saved card is selected. Don't clear stripeClientSecret —
 * StripeElement is unmounted anyway (v-if), and preserving it avoids a round-trip
 * when switching back to "Use another payment method".
 */
watch(selectedSavedToken, async (token, previousToken) => {
  if (token) {
    activateStripeGateway();
    return;
  }

  // Fetch a PI only if we don't already have one.
  if (previousToken && stripe && appConfig.stripePaymentMethod === 'payment' && !stripeClientSecret.value) {
    await initStripePaymentIntent();
  }
});

watch(
  stripeGateway,
  (gateway) => {
    if (gateway && selectedSavedToken.value) {
      orderInput.value.paymentMethod = gateway;
    }
  },
  { immediate: true },
);

const isInvalidEmail = ref<boolean>(false);
const stripe: Stripe | null = stripeKey ? await loadStripe(stripeKey) : null;
const elements = ref();
const isPaid = ref<boolean>(false);
const isResolvingShippingRates = ref<boolean>(false);
const stripeClientSecret = ref<string | null>(null);
const stripeCustomerSessionSecret = ref<string | null>(null);
const stripeCurrency = computed(() => (runtimeConfig.public?.CURRENCY_CODE || 'USD').toLowerCase());
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

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
const isCheckoutDisabled = computed<boolean>(() => {
  if (isProcessingOrder.value || !selectedPaymentMethodId.value) return true;
  if (selectedPaymentMethodId.value === 'stripe') {
    if (!stripe) return true;
    if (selectedSavedToken.value) return false; // PI created fresh at submit time
    return !elements.value;
  }
  return false;
});

// Sync the shipping-address toggle with orderInput so checkout logic stays consistent
const shipToDifferentAddress = computed<boolean>({
  get: () => !!orderInput.value.shipToDifferentAddress,
  set: (value) => {
    orderInput.value.shipToDifferentAddress = value;
  },
});

const requiresShipping = computed<boolean>(() => {
  const currentCart = cart.value as
    | (typeof cart.value & {
        needsShippingAddress?: boolean | null;
      })
    | null;

  if (!currentCart || currentCart.isEmpty) return false;

  // Prefer cart-level shipping flags from WooGraphQL/WooCommerce.
  if (typeof currentCart.needsShippingAddress === 'boolean') {
    if (currentCart.needsShippingAddress) return true;
    if ((currentCart.availableShippingMethods?.length ?? 0) > 0) return true;
    if ((currentCart.chosenShippingMethods?.length ?? 0) > 0) return true;
  }

  // Fallback for incomplete payloads: infer from item virtual flags when present.
  const cartNodes = currentCart.contents?.nodes ?? [];
  if (!cartNodes.length) return false;

  const hasExplicitVirtualFlags = cartNodes.some((item) => typeof (item?.product?.node as { virtual?: boolean } | null)?.virtual === 'boolean');
  if (hasExplicitVirtualFlags) {
    return cartNodes.some((item) => (item?.product?.node as { virtual?: boolean } | null)?.virtual !== true);
  }

  // Last resort: assume shipping is needed for non-empty carts.
  return true;
});

const hasAvailableShippingMethods = computed<boolean>(() => {
  return !!cart.value?.availableShippingMethods?.[0]?.rates?.length;
});

watch(
  () => canSavePaymentMethod.value,
  (canSave) => {
    if (!canSave) savePaymentMethod.value = false;
  },
  { immediate: true },
);

const ensureShippingRates = async () => {
  if (!import.meta.client) return;
  if (!shouldShowShippingFlow.value || hasAvailableShippingMethods.value || isResolvingShippingRates.value) return;
  if (!customer.value) return;

  // Fall back to billing when shipping is an empty object (EMPTY_CUSTOMER initialises it as {}).
  const hasAddrData = (addr: any) => !!(addr?.country || addr?.state || addr?.postcode || addr?.city || addr?.address1);
  const shippingLocation = hasAddrData(customer.value.shipping) ? customer.value.shipping : customer.value.billing;

  const hasLocationData = hasAddrData(shippingLocation);

  if (!hasLocationData) {
    return;
  }

  isResolvingShippingRates.value = true;
  try {
    await updateShippingLocation();
  } finally {
    isResolvingShippingRates.value = false;
  }
};

// Eagerly create a PaymentIntent so StripeElement can mount in intent mode.
const initStripePaymentIntent = async () => {
  if (!stripe || appConfig.stripePaymentMethod !== 'payment' || selectedSavedToken.value) return;

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
      /** Don't attach the CustomerSession: it requires setup_future_usage on the PI,
       * which this eager init doesn't set. Saved cards are shown via our own UI. */
      stripeCustomerSessionSecret.value = null;
    } else {
      console.warn('[Stripe] No clientSecret in response');
    }
  } catch (err) {
    console.error('[Stripe] Failed to init PaymentIntent:', err);
  }
};

watch(shipToDifferentAddress, (newValue) => {
  if (!customer.value?.billing) return;

  if (!customer.value.shipping) {
    customer.value.shipping = { ...customer.value.billing };
    return;
  }

  if (!newValue || !hasAnyShippingInfo.value) {
    Object.assign(customer.value.shipping, { ...customer.value.billing });
  }
});

/** stripeCustomerId loads async (after refreshCart). Re-init when it arrives so
 * the PaymentIntent has the customer attached. */
watch(stripeCustomerId, (newId, oldId) => {
  if (!stripe || appConfig.stripePaymentMethod !== 'payment') return;
  if (selectedSavedToken.value) return;
  if (newId && newId !== oldId) {
    stripeClientSecret.value = null;
    stripeCustomerSessionSecret.value = null;
    initStripePaymentIntent();
  }
});

onBeforeMount(async () => {
  if (query.cancel_order) window.close();

  if (customer.value && !customer.value.shipping && customer.value.billing) {
    customer.value.shipping = { ...customer.value.billing };
  }

  await ensureShippingRates();

  // Wait one tick so refreshCart() has a chance to populate stripeCustomerId first.
  if (stripe && appConfig.stripePaymentMethod === 'payment' && !selectedSavedToken.value) {
    await nextTick();
    await initStripePaymentIntent();
  }
});

const hasAnyShippingInfo = computed(() => {
  const shipping = customer.value?.shipping;
  if (!shipping) return false;
  return !!(shipping.firstName || shipping.lastName || shipping.address1 || shipping.city || shipping.country);
});

const shouldShowShippingFlow = computed<boolean>(() => {
  if (!cart.value || cart.value.isEmpty) return false;
  if (requiresShipping.value) return true;
  if (hasAvailableShippingMethods.value) return true;
  if ((cart.value.chosenShippingMethods?.length ?? 0) > 0) return true;
  return hasAnyShippingInfo.value;
});

watch(
  [shouldShowShippingFlow, hasAvailableShippingMethods, hasAnyShippingInfo],
  async ([showShippingFlow, hasRates, hasShippingInfo]) => {
    if (!import.meta.client || !showShippingFlow) return;
    if (!hasShippingInfo) {
      return;
    }
    if (!hasRates) await ensureShippingRates();
  },
  { immediate: true },
);

watchEffect(() => {
  if (viewer.value && customer.value?.billing && !customer.value.billing.email && viewerEmail.value) {
    customer.value.billing.email = viewerEmail.value;
  }
});

const payNow = async () => {
  buttonText.value = t('general.processing');
  checkoutError.value = null;
  resetStripeOrderMeta();
  orderInput.value.transactionId = '';
  isPaid.value = false;

  if (isCheckoutDisabled.value) {
    if (!selectedPaymentMethodId.value) {
      checkoutError.value = 'Please select a payment method before checking out.';
    } else if (selectedPaymentMethodId.value === 'stripe') {
      checkoutError.value = 'Your payment details are still loading. Please wait a moment and try again.';
    }

    buttonText.value = t('shop.checkoutButton');
    return;
  }

  try {
    if (selectedPaymentMethodId.value === 'stripe' && stripe) {
      // ── Saved card ──────────────────────────────────────────────────────────
      if (selectedSavedToken.value) {
        // Use the customer ID from the token itself — stale user meta can differ.
        const tokenCustomerId = selectedSavedToken.value.customerId || undefined;

        if (!tokenCustomerId) {
          throw new Error('Saved payment method is missing its Stripe customer ID.');
        }

        // Always create a fresh PI — the eager one may lack the customer association.
        const { stripePaymentIntent } = await GqlGetStripePaymentIntent({
          stripePaymentMethod: 'PAYMENT' as any,
          customerId: tokenCustomerId,
          saveForFuture: false,
        } as any);
        if (stripePaymentIntent?.error) throw new Error(stripePaymentIntent.error);
        const clientSecret = stripePaymentIntent?.clientSecret ?? null;
        if (!clientSecret) throw new Error('Payment intent not available. Please refresh and try again.');

        const { error, paymentIntent } = await stripe.confirmPayment({
          clientSecret,
          confirmParams: {
            payment_method: selectedSavedToken.value.token,
            return_url: `${window.location.origin}/checkout/order-received`,
          },
          redirect: 'if_required',
        });

        if (error) throw new Error(error.message);

        if (paymentIntent) {
          upsertOrderMeta('_stripe_payment_intent_id', paymentIntent.id);
          if (paymentIntent.payment_method) {
            upsertOrderMeta('_stripe_payment_method_id', String(paymentIntent.payment_method));
          }
          upsertOrderMeta('_stripe_source_id', paymentIntent.id);
          upsertOrderMeta('_stripe_charge_captured', 'yes');
          upsertOrderMeta('_wc_stripe_payment_method_type', 'card');
          isPaid.value = paymentIntent.status === 'succeeded' || paymentIntent.status === 'processing';
          orderInput.value.transactionId = paymentIntent.id;
        }
      } else if (elements.value) {
        // ── New card ────────────────────────────────────────────────────────────
        const paymentMethodType = appConfig.stripePaymentMethod || 'payment';

        if (paymentMethodType === 'payment') {
          const saveForFuture = canSavePaymentMethod.value && savePaymentMethod.value;

          const { error: submitError } = await elements.value.submit();
          if (submitError) {
            console.error('Form validation failed:', submitError);
            throw new Error(submitError.message);
          }

          let clientSecret = stripeClientSecret.value;
          if (!clientSecret) {
            const { stripePaymentIntent } = await GqlGetStripePaymentIntent({
              stripePaymentMethod: 'PAYMENT' as any,
              customerId: stripeCustomerId.value || undefined,
              saveForFuture,
            } as any);

            if (stripePaymentIntent?.error) {
              checkoutError.value = stripePaymentIntent.error;
              throw new Error(stripePaymentIntent.error);
            }

            clientSecret = stripePaymentIntent?.clientSecret ?? null;
          }

          if (!clientSecret) throw new Error('Payment intent not available. Please refresh and try again.');

          checkoutError.value = null;

          const { error, paymentIntent } = await stripe.confirmPayment({
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
            upsertOrderMeta('_stripe_payment_intent_id', paymentIntent.id);
            if (paymentIntent.payment_method) {
              upsertOrderMeta('_stripe_payment_method_id', String(paymentIntent.payment_method));
            }
            upsertOrderMeta('_stripe_source_id', paymentIntent.id);
            upsertOrderMeta('_stripe_fee', '0');
            upsertOrderMeta('_stripe_net', paymentIntent.amount.toString());
            upsertOrderMeta('_stripe_currency', paymentIntent.currency);
            upsertOrderMeta('_stripe_charge_captured', 'yes');
            upsertOrderMeta('_wc_stripe_payment_method_type', 'card');
            isPaid.value = paymentIntent.status === 'succeeded' || paymentIntent.status === 'processing';
            orderInput.value.transactionId = paymentIntent.id;
          }
        } else {
          // Legacy Card Element
          let clientSecret = '';
          try {
            const { stripePaymentIntent } = await GqlGetStripePaymentIntent({ stripePaymentMethod: 'SETUP' as any });
            clientSecret = stripePaymentIntent?.clientSecret || '';
          } catch (stripeError) {
            console.error('Error getting Stripe setup intent:', stripeError);
          }

          const cardElement = elements.value.getElement('card') as StripeCardElement;

          if (clientSecret) {
            const { setupIntent } = await stripe.confirmCardSetup(clientSecret, { payment_method: { card: cardElement } });
            if (setupIntent) upsertOrderMeta('_stripe_intent_id', setupIntent.id);
            isPaid.value = setupIntent?.status === 'succeeded' || false;
            orderInput.value.transactionId = setupIntent?.id || new Date().getTime().toString();
          } else {
            const { paymentMethod, error: paymentMethodError } = await stripe.createPaymentMethod({ type: 'card', card: cardElement });
            if (paymentMethodError) throw new Error(paymentMethodError.message);
            if (paymentMethod) {
              upsertOrderMeta('_stripe_payment_method_id', paymentMethod.id);
              upsertOrderMeta('_stripe_source_id', paymentMethod.id);
              orderInput.value.transactionId = paymentMethod.id;
              isPaid.value = true;
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Checkout error:', error);

    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred during checkout';
    alert(`Payment failed: ${errorMessage}. Please try again or contact support.`);
    buttonText.value = t('shop.checkoutButton');
    return;
  }

  await processCheckout(isPaid.value);
};

const handleStripeElement = (stripeElements: StripeElements | null): void => {
  elements.value = stripeElements;
};

const checkEmailOnBlur = (email?: string | null): void => {
  if (email) isInvalidEmail.value = !emailRegex.test(email);
};

const checkEmailOnInput = (email?: string | null): void => {
  if (email && isInvalidEmail.value) isInvalidEmail.value = false;
};

useSeoMeta({
  title: t('shop.checkout'),
});
</script>

<template>
  <div class="flex flex-col min-h-150">
    <template v-if="cart && customer">
      <div v-if="cart.isEmpty" class="flex flex-col items-center justify-center flex-1 mb-12">
        <Icon name="ion:cart-outline" size="156" class="mb-5 opacity-25" />
        <h2 class="mb-2 text-2xl font-bold">{{ $t('shop.cartEmpty') }}</h2>
        <span class="mb-4 text-gray-400">{{ $t('shop.addProductsInYourCart') }}</span>
        <NuxtLink
          to="/products"
          class="flex items-center justify-center gap-3 p-2 px-3 mt-4 font-semibold text-center text-white rounded-lg shadow-lg bg-primary hover:bg-primary-dark">
          {{ $t('shop.browseOurProducts') }}
        </NuxtLink>
      </div>

      <form v-else class="checkout-container container flex flex-wrap items-start gap-8 my-16 justify-evenly lg:gap-16" @submit.prevent="payNow">
        <div class="checkout-form grid w-full gap-8 wn-form lg:flex-1">
          <div v-if="viewer" class="checkout-section">
            <div class="">
              <div class="flex flex-wrap items-center gap-2">
                <h1 class="text-2xl font-semibold leading-none text-gray-900">{{ viewerGreeting }}</h1>
              </div>
              <p v-if="viewerEmail" class="flex flex-wrap items-center gap-2 text-sm text-gray-600 mt-4">
                <span class="text-gray-400">Email: </span>
                <span class="truncate" :title="viewerEmail">{{ viewerEmail }}</span>
              </p>
              <p v-if="viewer.databaseId" class="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                <span class="text-gray-400">Customer ID: </span>
                <span>#{{ viewer.databaseId }}</span>
              </p>
            </div>
          </div>

          <div v-if="!viewer" class="checkout-section">
            <h1 class="text-2xl font-semibold leading-none text-gray-900">Guest checkout</h1>
            <div @click="navigateToLogin(route.fullPath)" class="flex justify-between items-center gap-4 mt-2">
              <p class="text-sm text-gray-600">Use guest checkout, or sign in to use your saved details.</p>
              <Button type="button" class="ml-auto" size="sm" variant="outline"> Sign in </Button>
            </div>
          </div>

          <!-- Billing details -->
          <div v-if="customer?.billing" class="checkout-section">
            <div>
              <h3 class="text-xl font-semibold leading-none">
                {{ $t('billing.billingDetails') }}
              </h3>
            </div>

            <div v-if="!viewer" class="w-full mt-4">
              <label for="email">{{ $t('billing.email') }}</label>
              <input
                v-model="customer.billing.email"
                placeholder="johndoe@email.com"
                autocomplete="email"
                type="email"
                name="email"
                :class="{ 'has-error': isInvalidEmail }"
                @blur="checkEmailOnBlur(customer.billing.email)"
                @input="checkEmailOnInput(customer.billing.email)"
                required />
              <Transition name="scale-y" mode="out-in">
                <div v-if="isInvalidEmail" class="mt-1 text-sm text-red-500">Invalid email address</div>
              </Transition>
            </div>
            <div v-if="!viewer && orderInput.createAccount" class="flex w-full mt-4 gap-4">
              <div class="flex-1">
                <label for="username">{{ $t('account.username') }}</label>
                <input
                  v-model="orderInput.username"
                  placeholder="johndoe"
                  autocomplete="username"
                  type="text"
                  name="username"
                  :required="orderInput.createAccount" />
              </div>
              <div class="flex-1">
                <label for="email">{{ $t('account.password') }}</label>
                <PasswordInput id="password" v-model="orderInput.password" placeholder="••••••••••" :required="orderInput.createAccount" />
              </div>
            </div>
            <div v-if="!viewer" class="flex items-center gap-2 mt-4">
              <input id="creat-account" v-model="orderInput.createAccount" type="checkbox" name="creat-account" />
              <label for="creat-account">Create an account?</label>
            </div>
            <hr v-if="!viewer" class="flex-1 my-6 border-gray-300" />

            <div :class="viewer ? 'mt-4' : 'mt-6'">
              <BillingDetails v-if="customer?.billing" v-model="customer.billing" />
            </div>

            <div v-if="shouldShowShippingFlow" class="flex items-center gap-3 mt-6">
              <input
                id="ship-to-different-address"
                v-model="shipToDifferentAddress"
                type="checkbox"
                name="ship-to-different-address"
                class="w-4 h-4 bg-white border-gray-300 rounded-sm text-primary focus:ring-3 focus:ring-primary" />
              <label for="ship-to-different-address" class="text-sm font-medium text-gray-700">
                {{ $t('billing.differentAddress') }}
              </label>
            </div>
          </div>

          <div v-if="shipToDifferentAddress" class="checkout-section">
            <div class="mb-6">
              <h3 class="flex items-center gap-2 text-xl font-semibold leading-none text-gray-900">
                <span>{{ $t('general.shippingAddress') }}</span>
              </h3>
            </div>
            <ShippingDetails v-if="customer?.shipping" v-model="customer.shipping" />
          </div>
          <!-- Shipping methods -->
          <div v-if="shouldShowShippingFlow" class="checkout-section">
            <h3 class="mb-4 flex items-center gap-2 text-xl font-semibold leading-none">
              <span>{{ $t('general.shippingSelect') }}</span>
            </h3>
            <ShippingOptions
              v-if="hasAvailableShippingMethods && cart?.chosenShippingMethods?.[0]"
              :options="cart?.availableShippingMethods?.[0]?.rates ?? []"
              :active-option="cart.chosenShippingMethods[0]" />
            <p v-else class="text-sm text-amber-600">Add or confirm your shipping address to load shipping methods.</p>
          </div>

          <!-- Pay methods -->
          <div v-if="checkoutPaymentGateways?.nodes.length" class="checkout-section col-span-full">
            <h3 class="mb-4 flex items-center gap-2 text-xl font-semibold leading-none">
              <span>{{ $t('billing.paymentOptions') }}</span>
            </h3>

            <!-- ── Saved cards: primary option at the top ─────────────────── -->
            <template v-if="savedPaymentMethods.length > 0">
              <template v-if="selectedSavedToken">
                <!-- Saved card list -->
                <div class="flex flex-col gap-2 mb-3">
                  <label
                    v-for="pm in savedPaymentMethods"
                    :key="pm.id"
                    :for="`saved-pm-${pm.id}`"
                    :class="[
                      'flex items-center gap-3 cursor-pointer rounded-lg border p-3 transition-colors',
                      selectedSavedToken?.id === pm.id ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/40',
                    ]">
                    <input
                      :id="`saved-pm-${pm.id}`"
                      type="radio"
                      name="saved-payment-method"
                      :checked="selectedSavedToken?.id === pm.id"
                      class="accent-primary"
                      @change="selectedSavedToken = pm" />
                    <span class="capitalize font-medium text-sm">{{ pm.cardType }}</span>
                    <span class="text-sm"
                      >ending in <strong>{{ pm.last4 }}</strong></span
                    >
                    <span class="text-sm text-gray-500">(expires {{ pm.expiryMonth }}/{{ pm.expiryYear }})</span>
                    <span v-if="pm.isDefault" class="ml-auto text-xs font-semibold text-primary">Default</span>
                  </label>
                </div>
                <!-- Use another payment method -->
                <button
                  type="button"
                  class="text-sm text-gray-500 hover:text-primary hover:underline underline-offset-2 mt-1"
                  @click="selectedSavedToken = null">
                  Use another payment method
                </button>
              </template>

              <!-- Back to saved card (shown when user switched away) -->
              <button
                v-else
                type="button"
                class="flex items-center gap-1 text-sm text-primary hover:underline underline-offset-2 mb-4"
                @click="selectedSavedToken = savedPaymentMethods.find((m) => m.isDefault) ?? savedPaymentMethods[0] ?? null">
                ← Use saved card
              </button>
            </template>

            <!-- ── Gateway list + Payment Element: hidden while saved card is active ── -->
            <template v-if="!selectedSavedToken">
              <PaymentOptions v-model="orderInput.paymentMethod" class="mb-4" :payment-gateways="checkoutPaymentGateways" />
              <StripeElement
                v-if="stripe"
                v-show="selectedPaymentMethodId === 'stripe'"
                :stripe
                :client-secret="stripeClientSecret"
                :customer-session-client-secret="stripeCustomerSessionSecret"
                :customer-id="stripeCustomerId"
                :amount="stripeAmount"
                :currency="stripeCurrency"
                :save-for-future="canSavePaymentMethod && savePaymentMethod"
                @updateElement="handleStripeElement" />
              <div
                v-if="selectedPaymentMethodId === 'stripe' && canSavePaymentMethod && appConfig.stripePaymentMethod === 'payment'"
                class="mt-3 flex items-start gap-2">
                <input
                  id="save-payment-method"
                  v-model="savePaymentMethod"
                  type="checkbox"
                  name="save-payment-method"
                  class="mt-0.5 h-4 w-4 rounded-sm border-gray-300 bg-white text-primary focus:ring-3 focus:ring-primary" />
                <label for="save-payment-method" class="text-sm font-medium text-gray-700">
                  Save payment information to my account for future purchases.
                </label>
              </div>
            </template>
          </div>

          <!-- Order note -->
          <div class="checkout-section">
            <h3 class="mb-4 text-xl font-semibold leading-none">{{ $t('shop.orderNote') }} ({{ $t('general.optional') }})</h3>
            <textarea
              id="order-note"
              v-model="orderInput.customerNote"
              name="order-note"
              class="w-full min-h-25"
              rows="4"
              :placeholder="$t('shop.orderNotePlaceholder')"></textarea>
          </div>
        </div>

        <OrderSummary>
          <p v-if="checkoutError" role="alert" class="text-red-500 text-sm mt-2">{{ checkoutError }}</p>
          <Button :loading="isProcessingOrder" :disabled="isCheckoutDisabled" size="lg" type="submit" class="mt-4 w-full">
            {{ buttonText }}
          </Button>
        </OrderSummary>
      </form>
    </template>
    <LoadingIcon v-else class="m-auto" />
  </div>
</template>

<style>
@reference "#tailwind";

.checkout-container,
.checkout-form {
  container-type: inline-size;
}

.checkout-section {
  @apply w-full rounded-lg bg-white p-4 sm:p-8 shadow  outline-gray-800/10 outline;
}

/* Keep only the scale-y transition for email validation */
.scale-y-enter-active,
.scale-y-leave-active {
  transition: all 0.2s ease-in-out;
}

.scale-y-enter-from,
.scale-y-leave-to {
  opacity: 0;
  transform: scaleY(0);
  transform-origin: top;
}
</style>
