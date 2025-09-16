<script setup lang="ts">
import { loadStripe } from '@stripe/stripe-js';
import type { Stripe, StripeElements, CreateSourceData, StripeCardElement } from '@stripe/stripe-js';

const { t } = useI18n();
const { query } = useRoute();
const { cart, isUpdatingCart, paymentGateways } = useCart();
const { customer, viewer, navigateToLogin } = useAuth();
const { orderInput, isProcessingOrder, processCheckout } = useCheckout();
const runtimeConfig = useRuntimeConfig();
const stripeKey = runtimeConfig.public?.STRIPE_PUBLISHABLE_KEY || null;

const buttonText = ref<string>(isProcessingOrder.value ? t('messages.general.processing') : t('messages.shop.checkoutButton'));
const isCheckoutDisabled = computed<boolean>(() => isProcessingOrder.value || isUpdatingCart.value || !orderInput.value.paymentMethod);

const isInvalidEmail = ref<boolean>(false);
const stripe: Stripe | null = stripeKey ? await loadStripe(stripeKey) : null;
const elements = ref();
const isPaid = ref<boolean>(false);

// New reactive refs for the improved checkout flow
const shipToDifferentAddress = ref<boolean>(false);
const isEditingShipping = ref<boolean>(false);
const isEditingBilling = ref<boolean>(false);

// Functions to handle editing
const editShippingAddress = () => {
  isEditingShipping.value = true;
};

const editBillingAddress = () => {
  isEditingBilling.value = true;
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

  // Initialize shipping address if it doesn't exist and we have shipping methods
  if (cart.value?.availableShippingMethods?.length && customer.value && !customer.value.shipping) {
    // If we have billing address but no shipping address, copy billing to shipping
    if (customer.value.billing) {
      customer.value.shipping = { ...customer.value.billing };
    }
  }

  // For guest users, automatically open shipping form if no address is provided
  if (!viewer.value && customer.value?.shipping && !hasAnyShippingInfo.value) {
    isEditingShipping.value = true;
  }
});

// Helper to check if user has any shipping information
const hasAnyShippingInfo = computed(() => {
  const shipping = customer.value?.shipping;
  if (!shipping) return false;
  return !!(shipping.firstName || shipping.lastName || shipping.address1 || shipping.city || shipping.country);
});

const payNow = async () => {
  buttonText.value = t('messages.general.processing');

  try {
    if (orderInput.value.paymentMethod.id === 'stripe' && stripe && elements.value) {
      // Only call Stripe API when Stripe is the selected payment method
      const { stripePaymentIntent } = await GqlGetStripePaymentIntent();
      const clientSecret = stripePaymentIntent?.clientSecret || '';

      const cardElement = elements.value.getElement('card') as StripeCardElement;
      const { setupIntent } = await stripe.confirmCardSetup(clientSecret, { payment_method: { card: cardElement } });
      const { source } = await stripe.createSource(cardElement as CreateSourceData);

      if (source) orderInput.value.metaData.push({ key: '_stripe_source_id', value: source.id });
      if (setupIntent) orderInput.value.metaData.push({ key: '_stripe_intent_id', value: setupIntent.id });

      isPaid.value = setupIntent?.status === 'succeeded' || false;
      orderInput.value.transactionId = source?.created?.toString() || new Date().getTime().toString();
    }
  } catch (error) {
    console.error(error);
    buttonText.value = t('messages.shop.placeOrder');
  }

  processCheckout(isPaid.value);
};

const handleStripeElement = (stripeElements: StripeElements): void => {
  elements.value = stripeElements;
};

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

const checkEmailOnBlur = (email?: string | null): void => {
  if (email) isInvalidEmail.value = !emailRegex.test(email);
};

const checkEmailOnInput = (email?: string | null): void => {
  if (email && isInvalidEmail.value) isInvalidEmail.value = !emailRegex.test(email);
};

useSeoMeta({
  title: t('messages.shop.checkout'),
});
</script>

<template>
  <div class="flex flex-col min-h-[600px]">
    <template v-if="cart && customer">
      <div v-if="cart.isEmpty" class="flex flex-col items-center justify-center flex-1 mb-12">
        <Icon name="ion:cart-outline" size="156" class="opacity-25 mb-5" />
        <h2 class="text-2xl font-bold mb-2">{{ $t('messages.shop.cartEmpty') }}</h2>
        <span class="text-gray-400 mb-4">{{ $t('messages.shop.addProductsInYourCart') }}</span>
        <NuxtLink
          to="/products"
          class="flex items-center justify-center gap-3 p-2 px-3 mt-4 font-semibold text-center text-white rounded-lg shadow-lg bg-primary hover:bg-primary-dark">
          {{ $t('messages.shop.browseOurProducts') }}
        </NuxtLink>
      </div>

      <form v-else class="container flex flex-wrap items-start gap-8 my-16 justify-evenly lg:gap-20" @submit.prevent="payNow">
        <div class="grid w-full max-w-2xl gap-8 checkout-form md:flex-1">
          <!-- Customer details -->
          <div v-if="!viewer && customer?.billing">
            <h2 class="w-full mb-2 text-2xl font-semibold leading-none">Contact Information</h2>
            <p class="mt-1 text-sm text-gray-500">
              Already have an account? <NuxtLink to="/my-account" @click="navigateToLogin('/checkout')" class="text-primary text-semibold">Log in</NuxtLink>.
            </p>
            <div class="w-full mt-4">
              <label for="email">{{ $t('messages.billing.email') }}</label>
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
                <label for="username">{{ $t('messages.account.username') }}</label>
                <input v-model="orderInput.username" placeholder="johndoe" autocomplete="username" type="text" name="username" required />
              </div>
              <div class="w-full my-2" v-if="orderInput.createAccount">
                <label for="email">{{ $t('messages.account.password') }}</label>
                <PasswordInput id="password" class="my-2" v-model="orderInput.password" placeholder="••••••••••" :required="true" />
              </div>
            </template>
            <div v-if="!viewer" class="flex items-center gap-2 my-2">
              <label for="creat-account">Create an account?</label>
              <input id="creat-account" v-model="orderInput.createAccount" type="checkbox" name="creat-account" />
            </div>
          </div>

          <!-- Shipping Address Section -->
          <div v-if="cart?.availableShippingMethods?.length">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4 leading-none">Billing</h2>

            <!-- Shipping Address Summary or Form -->
            <div v-if="!isEditingShipping" class="space-y-4">
              <!-- Shipping Address Summary -->
              <AddressSummary :address="customer?.shipping" :show-validation-warnings="!!viewer" @edit="editShippingAddress" />

              <!-- Ship to Different Address Checkbox -->
              <div class="flex items-center gap-3">
                <input
                  id="useSameAddress"
                  v-model="shipToDifferentAddress"
                  type="checkbox"
                  name="useSameAddress"
                  class="w-4 h-4 text-primary bg-white border-gray-300 rounded focus:ring-primary focus:ring-2" />
                <label for="useSameAddress" class="text-sm font-medium text-gray-700">
                  {{ $t('messages.billing.differentAddress') }}
                </label>
              </div>
            </div>

            <!-- Shipping Address Form (when editing - stays open once clicked) -->
            <div v-else class="space-y-6">
              <div>
                <ShippingDetails v-if="customer?.shipping" v-model="customer.shipping" />
              </div>

              <!-- Ship to Different Address Checkbox (also shown during editing) -->
              <div class="flex items-center gap-3">
                <input
                  id="useSameAddressEdit"
                  v-model="shipToDifferentAddress"
                  type="checkbox"
                  name="useSameAddressEdit"
                  class="w-4 h-4 text-primary bg-white border-gray-300 rounded focus:ring-primary focus:ring-2" />
                <label for="useSameAddressEdit" class="text-sm font-medium text-gray-700">
                  {{ $t('messages.billing.differentAddress') }}
                </label>
              </div>
            </div>
          </div>

          <div v-if="shipToDifferentAddress">
            <div class="mb-6">
              <h2 class="text-2xl font-semibold text-gray-900 mb-2 leading-none">Shipping Address</h2>
            </div>
            <BillingDetails v-if="customer?.billing" v-model="customer.billing" />
          </div>
          <!-- Fallback: If no shipping methods available, show billing details -->
          <div v-if="!cart?.availableShippingMethods?.length">
            <h2 class="w-full mb-3 text-2xl font-semibold">{{ $t('messages.billing.billingDetails') }}</h2>
            <BillingDetails v-if="customer?.billing" v-model="customer.billing" />
          </div>

          <hr />

          <!-- Shipping methods -->
          <div v-if="cart?.availableShippingMethods?.length">
            <h3 class="mb-4 text-xl font-semibold leading-none">{{ $t('messages.general.shippingSelect') }}</h3>
            <ShippingOptions
              v-if="cart.availableShippingMethods[0]?.rates && cart.chosenShippingMethods?.[0]"
              :options="cart.availableShippingMethods[0].rates"
              :active-option="cart.chosenShippingMethods[0]" />
          </div>

          <hr />

          <!-- Pay methods -->
          <div v-if="paymentGateways?.nodes.length" class="mt-2 col-span-full">
            <h2 class="mb-4 text-xl font-semibold leading-none">{{ $t('messages.billing.paymentOptions') }}</h2>
            <PaymentOptions v-model="orderInput.paymentMethod" class="mb-4" :paymentGateways />
            <StripeElement v-if="stripe" v-show="orderInput.paymentMethod.id == 'stripe'" :stripe @updateElement="handleStripeElement" />
          </div>

          <hr />

          <!-- Order note -->
          <div>
            <h2 class="mb-4 text-xl font-semibold leading-none">{{ $t('messages.shop.orderNote') }} ({{ $t('messages.general.optional') }})</h2>
            <textarea
              id="order-note"
              v-model="orderInput.customerNote"
              name="order-note"
              class="w-full min-h-[100px]"
              rows="4"
              :placeholder="$t('messages.shop.orderNotePlaceholder')"></textarea>
          </div>
        </div>

        <OrderSummary>
          <button
            class="flex items-center justify-center w-full gap-3 p-3 mt-4 font-semibold text-center text-white rounded-lg shadow-md bg-primary hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-gray-400"
            :disabled="isCheckoutDisabled">
            {{ buttonText }}<LoadingIcon v-if="isProcessingOrder" color="#fff" size="18" />
          </button>
        </OrderSummary>
      </form>
    </template>
    <LoadingIcon v-else class="m-auto" />
  </div>
</template>

<style lang="postcss">
.checkout-form input[type='text'],
.checkout-form input[type='email'],
.checkout-form input[type='tel'],
.checkout-form input[type='password'],
.checkout-form textarea,
.checkout-form .StripeElement {
  @apply bg-white border rounded-md outline-none border-gray-300 shadow-inner w-full py-2 px-4;
}

.checkout-form select {
  @apply bg-white border rounded-md outline-none border-gray-300 shadow-sm w-full py-2 px-4;
}

.checkout-form input.has-error,
.checkout-form textarea.has-error {
  @apply border-red-500;
}

.checkout-form .StripeElement {
  padding: 1rem 0.75rem;
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
