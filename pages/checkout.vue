<script setup>
import { StripeElements, StripeElement } from 'vue-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const { t } = useI18n();
const { cart, toggleCart, isUpdatingCart, paymentGateways } = useCart();
const { customer } = useAuth();
const { orderInput, proccessCheckout, isProcessingOrder } = useCheckout();
const runtimeConfig = useRuntimeConfig();
const stripeKey = runtimeConfig.public?.STRIPE_PUBLISHABLE_KEY;

const buttonText = ref(isProcessingOrder.value ? t('messages.general.processing') : t('messages.shop.checkoutButton'));

const instanceOptions = ref({});
const elementsOptions = ref({});
const cardOptions = ref({ hidePostalCode: true });
const stripeLoaded = ref(false);
const card = ref();
const elms = ref();

// Initialize Stripe.js
onBeforeMount(() => {
  if (!stripeKey) {
    console.error('Stripe key is not set');
    return;
  }

  const stripePromise = loadStripe(stripeKey);
  stripePromise.then(() => {
    stripeLoaded.value = true;
  });
});

// If cart is open, close it after 600ms
onMounted(() => {
  setTimeout(() => {
    if (toggleCart) toggleCart(false);
  }, 600);
});

const payNow = async () => {
  buttonText.value = t('messages.general.processing');
  try {
    if (orderInput.value.paymentMethod === 'stripe') {
      const cardElement = card.value.stripeElement;
      const { source, error } = await elms.value.instance.createSource(cardElement);
      orderInput.value.metaData.push({ key: '_stripe_source_id', value: source.id });
    }
  } catch (error) {
    buttonText.value = t('messages.shop.placeOrder');
  }

  proccessCheckout();
};
</script>

<template>
  <div class="flex flex-col min-h-[600px]">
    <LoadingIcon v-if="!cart" class="m-auto" />

    <form v-if="cart" class="container flex flex-wrap items-start gap-8 my-16 justify-evenly md:flex-row-reverse lg:gap-24" @submit.prevent="payNow">
      <OrderSummary>
        <button
          v-if="orderInput.paymentMethod === 'paypal'"
          class="rounded-lg flex font-semibold bg-[#EAB434] shadow-md mt-4 text-white text-lg text-center w-full p-3 gap-4 justify-center items-center hover:bg-[#EAB434] disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="isProcessingOrder || isUpdatingCart">
          <img src="/images/paypal.svg" alt="PayPal" class="w-16" />
          <LoadingIcon v-if="isProcessingOrder" color="#fff" size="18" />
        </button>

        <button
          v-else
          class="flex items-center justify-center w-full p-3 mt-4 font-semibold text-center text-white rounded-lg shadow-md bg-primary gap- hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="isProcessingOrder || isUpdatingCart">
          <span>{{ buttonText }}</span>
          <LoadingIcon v-if="isProcessingOrder" color="#fff" size="18" />
        </button>
      </OrderSummary>

      <div class="grid w-full max-w-2xl gap-8 checkout-form md:flex-1">
        <div>
          <h2 class="w-full mb-3 text-2xl font-semibold">{{ $t('messages.billing.billingDetails') }}</h2>
          <BillingDetails v-model="customer.billing" />
        </div>

        <label for="shipToDifferentAddress" class="flex items-center gap-2">
          <span>{{ $t('messages.billing.differentAddress') }}</span>
          <input id="shipToDifferentAddress" v-model="orderInput.shipToDifferentAddress" type="checkbox" name="shipToDifferentAddress" />
        </label>

        <Transition name="scale-y" mode="out-in">
          <div v-if="orderInput.shipToDifferentAddress">
            <h2 class="mb-4 text-xl font-semibold">{{ $t('messages.general.shippingDetails') }}</h2>
            <ShippingDetails v-model="customer.shipping" />
          </div>
        </Transition>

        <div>
          <h3 class="mb-4 text-xl font-semibold">{{ $t('messages.general.shippingSelect') }}</h3>
          <ClientOnly>
            <ShippingOptions v-if="cart && cart.availableShippingMethods.length" :options="cart.availableShippingMethods[0].rates" :active-option="cart.chosenShippingMethods[0]" />
          </ClientOnly>
        </div>

        <!-- Pay methods -->
        <div class="mt-2 col-span-full">
          <h2 class="mb-4 text-xl font-semibold">{{ $t('messages.billing.paymentOptions') }}</h2>
          <PaymentOptions v-model="orderInput.paymentMethod" class="mb-4" :paymentGateways="paymentGateways" />

          <Transition name="scale-y" mode="out-in">
            <StripeElements
              v-if="orderInput.paymentMethod == 'stripe'"
              v-slot="{ elements, instance }"
              ref="elms"
              :stripe-key="stripeKey"
              :instance-options="instanceOptions"
              :elements-options="elementsOptions">
              <StripeElement ref="card" :elements="elements" :options="cardOptions" />
            </StripeElements>
          </Transition>
        </div>

        <div>
          <h2 class="mb-4 text-xl font-semibold">{{ $t('messages.shop.orderNote') }} ({{ $t('messages.general.optional') }})</h2>
          <textarea id="order-note" v-model="orderInput.customerNote" name="order-note" class="w-full" rows="4" :placeholder="$t('messages.shop.orderNotePlaceholder')"></textarea>
        </div>
      </div>
    </form>
  </div>
</template>

<style lang="postcss">
.checkout-form input[type='text'],
.checkout-form input[type='email'],
.checkout-form input[type='tel'],
.checkout-form textarea,
.checkout-form .StripeElement,
.checkout-form select {
  @apply bg-white border rounded-md outline-none border-gray-300 shadow-sm w-full py-2 px-4;
}

.checkout-form label {
  @apply my-1.5 text-xs text-gray-600 uppercase;
}

.checkout-form .StripeElement {
  padding: 1rem 0.75rem;
}

.fadeUp-enter-active,
.fadeUp-leave-active {
  transition: all 300ms;
}

.fadeUp-enter,
.fadeUp-leave-active {
  opacity: 0;
  transform: translateY(10px);
}
</style>
