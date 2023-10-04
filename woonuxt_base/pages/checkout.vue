<script setup>
import { StripeElements, StripeElement } from 'vue-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const { t } = useI18n();
const { cart, toggleCart, isUpdatingCart, paymentGateways } = useCart();
const { customer, viewer } = useAuth();
const { orderInput, isProcessingOrder, proccessCheckout } = useCheckout();
const runtimeConfig = useRuntimeConfig();
const stripeKey = runtimeConfig.public?.STRIPE_PUBLISHABLE_KEY;

const buttonText = ref(isProcessingOrder.value ? t('messages.general.processing') : t('messages.shop.checkoutButton'));
const isCheckoutDisabled = computed(() => isProcessingOrder.value || isUpdatingCart.value || !orderInput.value.paymentMethod);

const emailRegex = new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$');
const isInvalidEmail = ref(false);

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

const checkEmailOnBlur = (email) => {
  if (email) isInvalidEmail.value = !emailRegex.test(email);
};

const checkEmailOnInput = (email) => {
  if (email || isInvalidEmail.value) isInvalidEmail.value = !emailRegex.test(email);
};
</script>

<template>
  <div class="flex flex-col min-h-[600px]">
    <LoadingIcon v-if="!cart" class="m-auto" />
    <template v-else>
      <div v-if="cart.isEmpty" class="flex flex-col items-center justify-center flex-1 mb-12">
        <div class="mb-20 text-xl text-gray-300">{{ $t('messages.shop.cartEmpty') }}</div>
      </div>

      <form v-else class="container flex flex-wrap items-start gap-8 my-16 justify-evenly lg:gap-24" @submit.prevent="payNow">
        <div class="grid w-full max-w-2xl gap-8 checkout-form md:flex-1">
          <!-- Customer details -->
          <div>
            <h2 class="w-full mb-2 text-2xl font-semibold">Contact Information</h2>
            <p v-if="!viewer" class="mt-1 text-sm text-gray-500">Already have an account? <a href="/my-account" class="text-primary text-semibold">Log in</a>.</p>
            <div class="w-full mt-4">
              <label for="email">{{ $t('messages.billing.email') }}</label>
              <input
                v-model="customer.billing.email"
                placeholder="johndoe@email.com"
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
            <div class="w-full my-2" v-if="orderInput.createAccount">
              <label for="email">{{ $t('messages.account.password') }}</label>
              <PasswordInput id="password" class="my-2" v-model="orderInput.password" placeholder="Password" :required="true" />
            </div>
            <div v-if="!viewer" class="flex items-center gap-2 my-2">
              <label for="creat-account">Create an account?</label>
              <input id="creat-account" v-model="orderInput.createAccount" type="checkbox" name="creat-account" />
            </div>
          </div>

          <div>
            <h2 class="w-full mb-3 text-2xl font-semibold">{{ $t('messages.billing.billingDetails') }}</h2>
            <BillingDetails v-model="customer.billing" :sameAsShippingAddress="orderInput.shipToDifferentAddress" />
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

          <!-- Shipping methods -->
          <div v-if="cart.availableShippingMethods.length">
            <h3 class="mb-4 text-xl font-semibold">{{ $t('messages.general.shippingSelect') }}</h3>
            <ShippingOptions :options="cart.availableShippingMethods[0].rates" :active-option="cart.chosenShippingMethods[0]" />
          </div>

          <!-- Pay methods -->
          <div v-if="paymentGateways.length" class="mt-2 col-span-full">
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

          <!-- Order note -->
          <div>
            <h2 class="mb-4 text-xl font-semibold">{{ $t('messages.shop.orderNote') }} ({{ $t('messages.general.optional') }})</h2>
            <textarea
              id="order-note"
              v-model="orderInput.customerNote"
              name="order-note"
              class="w-full"
              rows="4"
              :placeholder="$t('messages.shop.orderNotePlaceholder')"></textarea>
          </div>
        </div>

        <OrderSummary>
          <button
            class="flex items-center justify-center w-full gap-3 p-3 mt-4 font-semibold text-center text-white rounded-lg shadow-md disabled:cursor-not-allowed disabled:opacity-50"
            :class="{
              'bg-[#EAB434] hover:bg-[#EAB434]': orderInput.paymentMethod === 'paypal',
              'bg-primary hover:bg-primary-dark': orderInput.paymentMethod !== 'paypal',
            }"
            :disabled="isCheckoutDisabled">
            <NuxtImg v-if="orderInput.paymentMethod === 'paypal'" src="/images/paypal.svg" alt="PayPal" height="24px" class="h-[24px]" />
            <span v-else>{{ buttonText }}</span>
            <LoadingIcon v-if="isProcessingOrder" color="#fff" size="18" />
          </button>
        </OrderSummary>
      </form>
    </template>
  </div>
</template>

<style lang="postcss">
.checkout-form input[type='text'],
.checkout-form input[type='email'],
.checkout-form input[type='tel'],
.checkout-form input[type='password'],
.checkout-form textarea,
.checkout-form .StripeElement,
.checkout-form select {
  @apply bg-white border rounded-md outline-none border-gray-300 shadow-sm w-full py-2 px-4;
}

.checkout-form input.has-error,
.checkout-form textarea.has-error {
  @apply border-red-500;
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
