<script setup lang="ts">
import type { PaymentGateway } from '#types/gql';

const route = useRoute();

const { t } = useI18n();
const { query } = route;
const { cart, paymentGateways, isBillingAddressEnabled } = useCart();
const { customer, viewer, navigateToLogin } = useAuth();
const { orderInput, isProcessingOrder, processCheckout, checkoutError, resolvePaymentMethodId } = useCheckout();
const { setActiveGateway, isActiveGatewayReady, processActiveGatewayPayment, getActiveGatewayDisabledMessage, resetActiveGateway } = usePaymentGateways();

const buttonText = ref<string>(isProcessingOrder.value ? t('general.processing') : t('shop.checkoutButton'));
const checkoutPaymentGateways = paymentGateways;
const selectedPaymentMethodId = computed<string>(() => resolvePaymentMethodId(orderInput.value.paymentMethod));

const isInvalidEmail = ref<boolean>(false);
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type CheckoutViewerSummary = {
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  databaseId?: number | null;
};

const viewerSummary = computed<CheckoutViewerSummary | null>(() => viewer.value as CheckoutViewerSummary | null);
const viewerEmail = computed<string>(() => customer.value?.billing?.email || viewerSummary.value?.email || '');
const viewerFirstName = computed<string>(() => customer.value?.billing?.firstName || viewerSummary.value?.firstName || '');
const viewerLastName = computed<string>(() => customer.value?.billing?.lastName || viewerSummary.value?.lastName || '');
const viewerGreeting = computed<string>(() => {
  const name = [viewerFirstName.value, viewerLastName.value].filter(Boolean).join(' ');
  return name ? `Welcome back, ${name}` : 'Welcome';
});
const isCheckoutDisabled = computed<boolean>(() => {
  if (isProcessingOrder.value || !selectedPaymentMethodId.value) return true;
  return !isActiveGatewayReady.value;
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

watch(shipToDifferentAddress, (newValue) => {
  if (!customer.value?.billing) return;

  if (!customer.value.shipping) {
    customer.value.shipping = { ...customer.value.billing };
    return;
  }

  if (!newValue) {
    Object.assign(customer.value.shipping, { ...customer.value.billing });
  }
});

onBeforeMount(() => {
  if (query.cancel_order) window.close();

  if (customer.value && !customer.value.shipping && customer.value.billing) {
    customer.value.shipping = { ...customer.value.billing };
  }
});

const shouldShowShippingFlow = computed<boolean>(() => {
  if (!cart.value || cart.value.isEmpty) return false;
  if (requiresShipping.value) return true;
  if (hasAvailableShippingMethods.value) return true;
  return (cart.value.chosenShippingMethods?.length ?? 0) > 0;
});

watchEffect(() => {
  if (viewer.value && customer.value?.billing && !customer.value.billing.email && viewerEmail.value) {
    customer.value.billing.email = viewerEmail.value;
  }
});

watch(
  selectedPaymentMethodId,
  (gatewayId) => {
    if (gatewayId) void setActiveGateway(gatewayId);
  },
  { immediate: true },
);

const handleGatewaySelect = (gateway: PaymentGateway): void => {
  orderInput.value.paymentMethod = gateway;
  void setActiveGateway(gateway);
};

const payNow = async () => {
  buttonText.value = t('general.processing');
  checkoutError.value = null;
  await setActiveGateway(orderInput.value.paymentMethod);
  resetActiveGateway();
  orderInput.value.transactionId = '';

  if (isCheckoutDisabled.value) {
    checkoutError.value = getActiveGatewayDisabledMessage() || 'Please select a payment method before checking out.';
    buttonText.value = t('shop.checkoutButton');
    return;
  }

  let paymentResult;
  try {
    paymentResult = await processActiveGatewayPayment();
    if (!paymentResult.success) {
      checkoutError.value = paymentResult.error || 'Payment processing failed. Please try again.';
      buttonText.value = t('shop.checkoutButton');
      return;
    }
  } catch (error) {
    console.error('Checkout error:', error);
    checkoutError.value = error instanceof Error ? error.message : 'An unexpected error occurred during checkout';
    buttonText.value = t('shop.checkoutButton');
    return;
  }

  await processCheckout(paymentResult.isPaid);
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
              <p v-if="viewerSummary?.databaseId" class="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                <span class="text-gray-400">Customer ID: </span>
                <span>#{{ viewerSummary.databaseId }}</span>
              </p>
            </div>
          </div>

          <div v-if="!viewer" class="checkout-section">
            <h1 class="text-2xl font-semibold leading-none text-gray-900">Guest checkout</h1>
            <div class="flex justify-between items-center gap-4 mt-2" @click="navigateToLogin(route.fullPath)">
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
                required
                @blur="checkEmailOnBlur(customer.billing.email)"
                @input="checkEmailOnInput(customer.billing.email)" />
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
              <AddressForm v-if="customer?.billing" v-model="customer.billing" :show-address-fields="isBillingAddressEnabled" />
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
            <AddressForm v-if="customer?.shipping" v-model="customer.shipping" />
          </div>
          <!-- Shipping methods -->
          <div v-if="shouldShowShippingFlow && hasAvailableShippingMethods && cart?.chosenShippingMethods?.[0]" class="checkout-section">
            <h3 class="mb-4 flex items-center gap-2 text-xl font-semibold leading-none">
              <span>{{ $t('general.shippingSelect') }}</span>
            </h3>
            <ShippingOptions :options="cart?.availableShippingMethods?.[0]?.rates ?? []" :active-option="cart.chosenShippingMethods[0]" />
          </div>

          <!-- Pay methods -->
          <div v-if="checkoutPaymentGateways?.nodes.length" class="checkout-section col-span-full">
            <h3 class="mb-4 flex items-center gap-2 text-xl font-semibold leading-none">
              <span>{{ $t('billing.paymentOptions') }}</span>
            </h3>

            <PaymentOptions
              :model-value="orderInput.paymentMethod"
              class="mb-4"
              :payment-gateways="checkoutPaymentGateways"
              @update:model-value="handleGatewaySelect" />

            <PaymentGatewayComponent :gateway="orderInput.paymentMethod" />
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

/* Email validation */
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
