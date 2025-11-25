<template>
  <div>
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Billing & Payments</h1>
      <p class="text-gray-600">Manage your billing and shipping addresses for orders and deliveries</p>
    </div>

    <form class="space-y-6" @submit.prevent="saveChanges">
      <!-- Billing Address Card -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-100">
        <div class="p-6 md:px-8 pb-4 border-b border-gray-100">
          <h3 class="text-lg font-semibold text-gray-900">Billing Address</h3>
        </div>
        <!-- Billing Fields -->
        <div class="grid p-6 md:p-8 gap-6 md:grid-cols-2" v-if="customer.billing">
          <div class="w-full space-y-2">
            <label for="billing-first-name" class="block text-sm font-medium text-gray-700">{{ $t('billing.firstName') }}</label>
            <input
              id="billing-first-name"
              v-model="customer.billing.firstName"
              placeholder="John"
              autocomplete="given-name"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50 focus:bg-white" />
          </div>

          <div class="w-full space-y-2">
            <label for="billing-last-name" class="block text-sm font-medium text-gray-700">{{ $t('billing.lastName') }}</label>
            <input
              id="billing-last-name"
              v-model="customer.billing.lastName"
              placeholder="Doe"
              autocomplete="family-name"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50 focus:bg-white" />
          </div>

          <div class="w-full space-y-2">
            <label for="billing-phone" class="block text-sm font-medium text-gray-700">
              {{ $t('billing.phone') }}
            </label>
            <input
              id="billing-phone"
              v-model="customer.billing.phone"
              placeholder="+1 234 567 8901"
              autocomplete="tel"
              type="tel"
              class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50 focus:bg-white" />
          </div>

          <div class="w-full space-y-2">
            <label for="billing-company" class="block text-sm font-medium text-gray-700"
              >Company <span class="text-gray-400 font-normal">({{ $t('general.optional') }})</span></label
            >
            <input
              id="billing-company"
              v-model="customer.billing.company"
              placeholder="Company Name"
              autocomplete="organization"
              type="text"
              class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50 focus:bg-white" />
          </div>

          <div class="w-full space-y-2">
            <label for="billing-address" class="block text-sm font-medium text-gray-700">{{ $t('billing.address1') }}</label>
            <input
              id="billing-address"
              v-model="customer.billing.address1"
              placeholder="123 Main St"
              autocomplete="address-line1"
              type="text"
              class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50 focus:bg-white" />
          </div>

          <div class="w-full space-y-2">
            <label for="billing-address-2" class="block text-sm font-medium text-gray-700"
              >{{ $t('billing.address2') }} <span class="text-gray-400 font-normal">({{ $t('general.optional') }})</span></label
            >
            <input
              id="billing-address-2"
              v-model="customer.billing.address2"
              placeholder="Apartment, studio, or floor"
              autocomplete="address-line2"
              type="text"
              class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50 focus:bg-white" />
          </div>

          <div class="w-full space-y-2">
            <label for="billing-city" class="block text-sm font-medium text-gray-700">{{ $t('billing.city') }}</label>
            <input
              id="billing-city"
              v-model="customer.billing.city"
              placeholder="New York"
              autocomplete="address-level2"
              type="text"
              class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50 focus:bg-white" />
          </div>

          <div class="w-full space-y-2" v-if="customer.billing.state && customer.billing.country">
            <label for="billing-state" class="block text-sm font-medium text-gray-700"
              >{{ $t('billing.state') }} <span class="text-gray-400 font-normal">({{ $t('general.optional') }})</span></label
            >
            <StateSelect id="billing-state" v-model="customer.billing.state" :default-value="customer.billing.state" :country-code="customer.billing.country" />
          </div>

          <div class="w-full space-y-2" v-if="customer.billing.country">
            <label for="billing-country" class="block text-sm font-medium text-gray-700">{{ $t('billing.country') }}</label>
            <CountrySelect id="billing-country" v-model="customer.billing.country" :default-value="customer.billing.country" />
          </div>

          <div class="w-full space-y-2">
            <label for="billing-zip" class="block text-sm font-medium text-gray-700">{{ $t('billing.zip') }}</label>
            <input
              id="billing-zip"
              v-model="customer.billing.postcode"
              placeholder="10001"
              autocomplete="postal-code"
              type="text"
              class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50 focus:bg-white" />
          </div>

          <div class="w-full col-span-full space-y-2">
            <label for="billing-email" class="block text-sm font-medium text-gray-700">
              {{ $t('billing.email') }}
            </label>
            <input
              id="billing-email"
              v-model="customer.billing.email"
              placeholder="johndoe@email.com"
              autocomplete="email"
              type="email"
              required
              class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50 focus:bg-white" />
          </div>
        </div>
      </div>

      <!-- Shipping Address Card -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-100">
        <div class="p-6 md:px-8 pb-4 border-b border-gray-100">
          <h3 class="text-lg font-semibold text-gray-900">Shipping Address</h3>
        </div>
        <!-- Shipping Fields -->
        <div class="grid p-6 md:p-8 gap-6 md:grid-cols-2" v-if="customer.shipping">
          <div class="w-full space-y-2">
            <label for="shipping-first-name" class="block text-sm font-medium text-gray-700">{{ $t('billing.firstName') }}</label>
            <input
              id="shipping-first-name"
              v-model="customer.shipping.firstName"
              placeholder="John"
              autocomplete="given-name"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50 focus:bg-white" />
          </div>

          <div class="w-full space-y-2">
            <label for="shipping-last-name" class="block text-sm font-medium text-gray-700">{{ $t('billing.lastName') }}</label>
            <input
              id="shipping-last-name"
              v-model="customer.shipping.lastName"
              placeholder="Doe"
              autocomplete="family-name"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50 focus:bg-white" />
          </div>

          <div class="w-full space-y-2">
            <label for="shipping-phone" class="block text-sm font-medium text-gray-700">
              {{ $t('billing.phone') }}
            </label>
            <input
              id="shipping-phone"
              v-model="customer.shipping.phone"
              placeholder="+1 234 567 8901"
              autocomplete="tel"
              type="tel"
              class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50 focus:bg-white" />
          </div>

          <div class="w-full space-y-2">
            <label for="shipping-company" class="block text-sm font-medium text-gray-700"
              >Company <span class="text-gray-400 font-normal">({{ $t('general.optional') }})</span></label
            >
            <input
              id="shipping-company"
              v-model="customer.shipping.company"
              placeholder="Company Name"
              autocomplete="organization"
              type="text"
              class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50 focus:bg-white" />
          </div>

          <div class="w-full space-y-2">
            <label for="shipping-address" class="block text-sm font-medium text-gray-700">{{ $t('billing.address1') }}</label>
            <input
              id="shipping-address"
              v-model="customer.shipping.address1"
              placeholder="O'Connell Street 47"
              autocomplete="address-line1"
              type="text"
              class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50 focus:bg-white" />
          </div>

          <div class="w-full space-y-2">
            <label for="shipping-address-2" class="block text-sm font-medium text-gray-700"
              >{{ $t('billing.address2') }} <span class="text-gray-400 font-normal">({{ $t('general.optional') }})</span></label
            >
            <input
              id="shipping-address-2"
              v-model="customer.shipping.address2"
              placeholder="Apartment, studio, or floor"
              autocomplete="address-line2"
              type="text"
              class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50 focus:bg-white" />
          </div>

          <div class="w-full space-y-2">
            <label for="shipping-city" class="block text-sm font-medium text-gray-700">{{ $t('billing.city') }}</label>
            <input
              id="shipping-city"
              v-model="customer.shipping.city"
              placeholder="New York"
              autocomplete="address-level2"
              type="text"
              class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50 focus:bg-white" />
          </div>

          <div class="w-full space-y-2" v-if="customer.shipping.state && customer.shipping.country">
            <label for="shipping-state" class="block text-sm font-medium text-gray-700"
              >{{ $t('billing.state') }} <span class="text-gray-400 font-normal">({{ $t('general.optional') }})</span></label
            >
            <StateSelect
              id="shipping-state"
              v-model="customer.shipping.state"
              :default-value="customer.shipping.state"
              :country-code="customer.shipping.country" />
          </div>

          <div class="w-full space-y-2" v-if="customer.shipping.country">
            <label for="shipping-country" class="block text-sm font-medium text-gray-700">{{ $t('billing.country') }}</label>
            <CountrySelect id="shipping-country" v-model="customer.shipping.country" :default-value="customer.shipping?.country" />
          </div>

          <div class="w-full space-y-2">
            <label for="shipping-zip" class="block text-sm font-medium text-gray-700">{{ $t('billing.zip') }}</label>
            <input
              id="shipping-zip"
              v-model="customer.shipping.postcode"
              placeholder="10001"
              autocomplete="postal-code"
              type="text"
              class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50 focus:bg-white" />
          </div>
        </div>

        <!-- Submit Button -->
        <div class="p-6 pt-4 bg-gray-50 rounded-b-lg border-t border-gray-100">
          <button
            class="ml-auto flex items-center justify-center gap-3 px-6 py-2 text-white rounded-lg font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            :class="button.color"
            :disabled="loading">
            <LoadingIcon v-if="loading" color="#fff" size="18" />
            <span>{{ button.text }}</span>
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
const { viewer, customer } = useAuth();
const { t } = useI18n();

const loading = ref<boolean>(false);
const button = ref<{ text: string; color: string }>({ text: t('account.updateDetails'), color: 'bg-primary hover:bg-primary-dark' });

async function saveChanges(): Promise<void> {
  if (!viewer.value?.id) return;

  loading.value = true;
  button.value.text = t('account.updating');
  const shipping = customer.value.shipping;
  const billing = customer.value.billing;

  try {
    const { updateCustomer } = await GqlUpdateCustomer({ input: { id: viewer.value.id, shipping, billing } });
    if (updateCustomer) button.value = { text: t('account.updateSuccess'), color: 'bg-green-500' };
  } catch (error) {
    button.value = { text: t('account.failed'), color: 'bg-red-500' };
  }

  loading.value = false;

  setTimeout(() => {
    button.value = { text: t('account.updateDetails'), color: 'bg-primary hover:bg-primary-dark' };
  }, 2000);
}
</script>
