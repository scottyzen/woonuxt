<script setup lang="ts">
import { loadStripe } from '@stripe/stripe-js';
import type { Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';
import type { Viewer } from '#types/gql';

const { t } = useI18n();
const { query } = useRoute();
const { cart, paymentGateways } = useCart();
const { customer, viewer, navigateToLogin } = useAuth();
const { orderInput, isProcessingOrder, processCheckout, checkoutError, updateShippingLocation } = useCheckout();
const runtimeConfig = useRuntimeConfig();
const appConfig = useAppConfig();
const stripeKey = runtimeConfig.public?.STRIPE_PUBLISHABLE_KEY || null;

const buttonText = ref<string>(isProcessingOrder.value ? t('general.processing') : t('shop.checkoutButton'));
const isStripeElementReady = ref<boolean>(false);
const savePaymentMethod = ref<boolean>(false);

type StripeViewer = Viewer & { stripeCustomerId?: string | null };
const stripeCustomerId = computed<string | null>(() => (viewer.value as StripeViewer | null)?.stripeCustomerId ?? null);
const isCreatingAccountAtCheckout = computed<boolean>(() => !viewer.value && !!orderInput.value.createAccount);
const canSavePaymentMethod = computed<boolean>(() => !!viewer.value || isCreatingAccountAtCheckout.value);
const checkoutPaymentGateways = computed(() => paymentGateways.value);

const isCheckoutDisabled = computed<boolean>(() => {
  return isProcessingOrder.value || !orderInput.value.paymentMethod;
});

const isInvalidEmail = ref<boolean>(false);
const stripe: Stripe | null = stripeKey ? await loadStripe(stripeKey) : null;
const elements = ref();
const isPaid = ref<boolean>(false);
const isResolvingShippingRates = ref<boolean>(false);
const stripeCurrency = computed(() => (runtimeConfig.public?.CURRENCY_CODE || 'USD').toLowerCase());

const resolveStripeAmount = (rawTotal: string | number | null | undefined, currency: string): number => {
  const parsed = Number.parseFloat(String(rawTotal ?? '0'));
  if (!Number.isFinite(parsed)) return 0;

  const fractionDigits = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).resolvedOptions().maximumFractionDigits;

  return Math.round(parsed * 10 ** fractionDigits);
};

const stripeAmount = computed(() => resolveStripeAmount(cart.value?.rawTotal ?? '0', stripeCurrency.value));

// Sync the shipping-address toggle with orderInput so checkout logic stays consistent
const shipToDifferentAddress = computed<boolean>({
  get: () => !!orderInput.value.shipToDifferentAddress,
  set: (value) => {
    orderInput.value.shipToDifferentAddress = value;
  },
});

const isEditingBilling = ref<boolean>(false);

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

  const shippingLocation = customer.value.shipping ?? customer.value.billing;
  const hasLocationData = !!(
    shippingLocation?.country ||
    shippingLocation?.state ||
    shippingLocation?.postcode ||
    shippingLocation?.city ||
    shippingLocation?.address1
  );

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

// Watch for address preference changes to auto-copy shipping to billing when using same address
watch(shipToDifferentAddress, (newValue) => {
  if (newValue && customer.value?.shipping && customer.value?.billing) {
    // Copy shipping address to billing address when shipping to different address is selected
    Object.assign(customer.value.billing, {
      ...customer.value.shipping,
      email: customer.value.billing.email, // Preserve email
    });
  }
});

onBeforeMount(async () => {
  if (query.cancel_order) window.close();

  // Initialize shipping address if it doesn't exist, independent of loaded shipping methods
  if (customer.value && !customer.value.shipping && customer.value.billing) {
    customer.value.shipping = { ...customer.value.billing };
  }

  await ensureShippingRates();
});

// Helper to check if user has any shipping information
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

const payNow = async () => {
  buttonText.value = t('general.processing');

  try {
    if (orderInput.value.paymentMethod.id === 'stripe' && stripe && elements.value) {
      // Only call Stripe API when Stripe is the selected payment method
      const paymentMethodType = appConfig.stripePaymentMethod || 'payment';

      if (paymentMethodType === 'payment') {
        const saveForFuture = canSavePaymentMethod.value && savePaymentMethod.value;

        // Modern Payment Element - use confirmPayment
        // First, submit the elements to validate the form
        const { error: submitError } = await elements.value.submit();
        if (submitError) {
          console.error('Form validation failed:', submitError);
          throw new Error(submitError.message);
        }

        const stripeIntentVariables = {
          stripePaymentMethod: 'PAYMENT' as any,
          customerId: stripeCustomerId.value || undefined,
          saveForFuture,
        } as any;

        const { stripePaymentIntent } = await GqlGetStripePaymentIntent(stripeIntentVariables);

        if (stripePaymentIntent?.error) {
          checkoutError.value = stripePaymentIntent.error;
          throw new Error(stripePaymentIntent.error);
        }

        const clientSecret = stripePaymentIntent?.clientSecret;
        if (!clientSecret) {
          throw new Error('Payment intent not available. Please refresh and try again.');
        }

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
          orderInput.value.metaData.push({ key: '_stripe_payment_intent_id', value: paymentIntent.id });

          // Add payment method ID if available
          if (paymentIntent.payment_method) {
            orderInput.value.metaData.push({ key: '_stripe_payment_method_id', value: paymentIntent.payment_method });
          }

          // Add additional metadata that WooCommerce Stripe plugin might expect
          orderInput.value.metaData.push({ key: '_stripe_source_id', value: paymentIntent.id });
          orderInput.value.metaData.push({ key: '_stripe_fee', value: '0' });
          orderInput.value.metaData.push({ key: '_stripe_net', value: paymentIntent.amount.toString() });
          orderInput.value.metaData.push({ key: '_stripe_currency', value: paymentIntent.currency });
          orderInput.value.metaData.push({ key: '_stripe_charge_captured', value: 'yes' });
          orderInput.value.metaData.push({ key: '_wc_stripe_payment_method_type', value: 'card' });

          // Set isPaid based on payment intent status
          isPaid.value = paymentIntent.status === 'succeeded' || paymentIntent.status === 'processing';
          orderInput.value.transactionId = paymentIntent.id;
        }
      } else {
        // Traditional Card Element - use legacy approach
        let clientSecret = '';

        try {
          const { stripePaymentIntent } = await GqlGetStripePaymentIntent({
            stripePaymentMethod: 'SETUP' as any,
          });
          clientSecret = stripePaymentIntent?.clientSecret || '';
        } catch (stripeError) {
          console.error('Error getting Stripe setup intent:', stripeError);
        }

        const cardElement = elements.value.getElement('card') as StripeCardElement;

        if (clientSecret) {
          // Use setup intent if available
          const { setupIntent } = await stripe.confirmCardSetup(clientSecret, { payment_method: { card: cardElement } });
          if (setupIntent) orderInput.value.metaData.push({ key: '_stripe_intent_id', value: setupIntent.id });
          isPaid.value = setupIntent?.status === 'succeeded' || false;
          orderInput.value.transactionId = setupIntent?.id || new Date().getTime().toString();
        } else {
          // Fallback to card payment method creation when no setup intent is available
          const { paymentMethod, error: paymentMethodError } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
          });

          if (paymentMethodError) {
            throw new Error(paymentMethodError.message);
          }

          if (paymentMethod) {
            orderInput.value.metaData.push({ key: '_stripe_payment_method_id', value: paymentMethod.id });
            orderInput.value.metaData.push({ key: '_stripe_source_id', value: paymentMethod.id });
            orderInput.value.transactionId = paymentMethod.id;
            // Continue checkout after creating a reusable payment method
            isPaid.value = true;
          }
        }
      }
    }
  } catch (error) {
    console.error('Checkout error:', error);

    // Provide user-friendly error message
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred during checkout';

    // You could show a toast notification here instead
    alert(`Payment failed: ${errorMessage}. Please try again or contact support.`);

    buttonText.value = t('shop.placeOrder');
    return; // Don't process checkout if payment failed
  }

  // Process the checkout
  await processCheckout(isPaid.value);
};

const handleStripeElement = (stripeElements: StripeElements): void => {
  elements.value = stripeElements;

  // Get the payment method type from config
  const paymentMethodType = appConfig.stripePaymentMethod || 'payment';

  if (paymentMethodType === 'payment') {
    // Modern Payment Element - listen for changes
    const paymentElement = stripeElements.getElement('payment');
    if (paymentElement) {
      paymentElement.on('change', (event) => {
        // Payment Element change event has different structure
        isStripeElementReady.value = event.complete;
      });
      isStripeElementReady.value = false;
    }
  } else {
    // Card Element
    const cardElement = stripeElements.getElement('card');
    if (cardElement) {
      cardElement.on('change', (event) => {
        isStripeElementReady.value = event.complete && !event.error;
      });
      isStripeElementReady.value = false;
    }
  }
};

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

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
          <!-- Customer details -->
          <div v-if="!viewer && customer?.billing" class="checkout-section">
            <h3 class="w-full mb-2 text-xl font-semibold leading-none dark:text-white">Contact Information</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Already have an account? <NuxtLink to="/my-account" @click="navigateToLogin('/checkout')" class="text-primary text-semibold">Log in</NuxtLink>.
            </p>
            <div class="w-full mt-4">
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
            <template v-if="orderInput.createAccount">
              <div class="w-full mt-4">
                <label for="username">{{ $t('account.username') }}</label>
                <input v-model="orderInput.username" placeholder="johndoe" autocomplete="username" type="text" name="username" required />
              </div>
              <div class="w-full my-2" v-if="orderInput.createAccount">
                <label for="email">{{ $t('account.password') }}</label>
                <PasswordInput id="password" class="my-2" v-model="orderInput.password" placeholder="••••••••••" :required="true" />
              </div>
            </template>
            <div v-if="!viewer" class="flex items-center gap-2 mt-4">
              <input id="creat-account" v-model="orderInput.createAccount" type="checkbox" name="creat-account" />
              <label for="creat-account">Create an account?</label>
            </div>
          </div>

          <!-- Shipping Address Section -->
          <div v-if="shouldShowShippingFlow" class="checkout-section">
            <h3 class="mb-4 text-xl font-semibold leading-none text-gray-900 dark:text-white">Billing</h3>

            <div class="space-y-6">
              <div>
                <ShippingDetails v-if="customer?.shipping" v-model="customer.shipping" />
              </div>

              <div class="flex items-center gap-3">
                <input
                  id="useSameAddressEdit"
                  v-model="shipToDifferentAddress"
                  type="checkbox"
                  name="useSameAddressEdit"
                  class="w-4 h-4 bg-white border-gray-300 rounded-sm text-primary dark:bg-gray-700 dark:border-gray-600 focus:ring-3 focus:ring-primary" />
                <label for="useSameAddressEdit" class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {{ $t('billing.differentAddress') }}
                </label>
              </div>
            </div>
          </div>

          <div v-if="shipToDifferentAddress" class="checkout-section">
            <div class="mb-6">
              <h3 class="mb-2 text-xl font-semibold leading-none text-gray-900 dark:text-white">Shipping Address</h3>
            </div>
            <BillingDetails v-if="customer?.billing" v-model="customer.billing" />
          </div>
          <!-- Fallback: For fully virtual carts, show only billing details -->
          <div v-if="!shouldShowShippingFlow" class="checkout-section">
            <h3 class="w-full mb-3 text-xl font-semibold dark:text-white">{{ $t('billing.billingDetails') }}</h3>
            <BillingDetails v-if="customer?.billing" v-model="customer.billing" />
          </div>

          <!-- Shipping methods -->
          <div v-if="shouldShowShippingFlow" class="checkout-section">
            <h3 class="mb-4 text-xl font-semibold leading-none dark:text-white">{{ $t('general.shippingSelect') }}</h3>
            <ShippingOptions
              v-if="hasAvailableShippingMethods && cart?.chosenShippingMethods?.[0]"
              :options="cart?.availableShippingMethods?.[0]?.rates ?? []"
              :active-option="cart.chosenShippingMethods[0]" />
            <p v-else class="text-sm text-amber-600 dark:text-amber-400">Add or confirm your shipping address to load shipping methods.</p>
          </div>

          <!-- Pay methods -->
          <div v-if="checkoutPaymentGateways?.nodes.length" class="checkout-section col-span-full">
            <h3 class="mb-4 text-xl font-semibold leading-none dark:text-white">{{ $t('billing.paymentOptions') }}</h3>
            <PaymentOptions v-model="orderInput.paymentMethod" class="mb-4" :payment-gateways="checkoutPaymentGateways" />
            <StripeElement
              v-if="stripe"
              v-show="orderInput.paymentMethod.id == 'stripe'"
              :stripe
              :amount="stripeAmount"
              :currency="stripeCurrency"
              @updateElement="handleStripeElement" />
            <div
              v-if="orderInput.paymentMethod?.id === 'stripe' && canSavePaymentMethod && appConfig.stripePaymentMethod === 'payment'"
              class="mt-3 flex items-start gap-2">
              <input
                id="save-payment-method"
                v-model="savePaymentMethod"
                type="checkbox"
                name="save-payment-method"
                class="mt-0.5 h-4 w-4 rounded-sm border-gray-300 bg-white text-primary focus:ring-3 focus:ring-primary dark:border-gray-600 dark:bg-gray-700" />
              <label for="save-payment-method" class="text-sm font-medium text-gray-700 dark:text-gray-300">
                Save payment information to my account for future purchases.
              </label>
            </div>
          </div>

          <!-- Order note -->
          <div class="checkout-section">
            <h3 class="mb-4 text-xl font-semibold leading-none dark:text-white">{{ $t('shop.orderNote') }} ({{ $t('general.optional') }})</h3>
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
          <Button :loading="isProcessingOrder" :disabled="isCheckoutDisabled" size="lg" type="submit" class="w-full mt-4">
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
  @apply w-full rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800/60;
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
