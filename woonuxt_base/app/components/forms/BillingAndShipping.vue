<template>
  <div>
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Billing & Shipping</h1>
      <p class="text-gray-600 dark:text-gray-400">Manage your billing and shipping addresses for orders and deliveries</p>
    </div>

    <form class="space-y-6 wn-form" @submit.prevent="saveChanges">
      <!-- Billing Address Card -->
      <div class="bg-white border border-gray-100 rounded-lg shadow-xs dark:bg-gray-800 dark:border-gray-700">
        <div class="p-6 pb-4 border-b border-gray-100 md:px-8 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Billing Address</h3>
        </div>
        <!-- Billing Fields -->
        <div class="grid gap-6 p-6 md:p-8 md:grid-cols-2" v-if="customer.billing">
          <div class="w-full space-y-2">
            <label for="billing-first-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('billing.firstName') }}</label>
            <input
              id="billing-first-name"
              v-model="customer.billing.firstName"
              placeholder="John"
              autocomplete="given-name"
              type="text"
              required />
          </div>

          <div class="w-full space-y-2">
            <label for="billing-last-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('billing.lastName') }}</label>
            <input
              id="billing-last-name"
              v-model="customer.billing.lastName"
              placeholder="Doe"
              autocomplete="family-name"
              type="text"
              required />
          </div>

          <div class="w-full space-y-2">
            <label for="billing-phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ $t('billing.phone') }}
            </label>
            <input
              id="billing-phone"
              v-model="customer.billing.phone"
              placeholder="+1 234 567 8901"
              autocomplete="tel"
              type="tel" />
          </div>

          <div class="w-full space-y-2">
            <label for="billing-company" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >Company <span class="font-normal text-gray-400 dark:text-gray-500">({{ $t('general.optional') }})</span></label
            >
            <input
              id="billing-company"
              v-model="customer.billing.company"
              placeholder="Company Name"
              autocomplete="organization"
              type="text" />
          </div>

          <div class="w-full space-y-2">
            <label for="billing-address" class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('billing.address1') }}</label>
            <input
              id="billing-address"
              v-model="customer.billing.address1"
              placeholder="123 Main St"
              autocomplete="address-line1"
              type="text" />
          </div>

          <div class="w-full space-y-2">
            <label for="billing-address-2" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >{{ $t('billing.address2') }} <span class="font-normal text-gray-400 dark:text-gray-500">({{ $t('general.optional') }})</span></label
            >
            <input
              id="billing-address-2"
              v-model="customer.billing.address2"
              placeholder="Apartment, studio, or floor"
              autocomplete="address-line2"
              type="text" />
          </div>

          <div class="w-full space-y-2">
            <label for="billing-city" class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('billing.city') }}</label>
            <input
              id="billing-city"
              v-model="customer.billing.city"
              placeholder="New York"
              autocomplete="address-level2"
              type="text" />
          </div>

          <div class="w-full space-y-2" v-if="customer.billing.state && customer.billing.country">
            <label for="billing-state" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >{{ $t('billing.state') }} <span class="font-normal text-gray-400 dark:text-gray-500">({{ $t('general.optional') }})</span></label
            >
            <StateSelect
              id="billing-state"
              v-model="customer.billing.state"
              :default-value="customer.billing.state"
              :country-code="customer.billing.country" />
          </div>

          <div class="w-full space-y-2" v-if="customer.billing.country">
            <label for="billing-country" class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('billing.country') }}</label>
            <CountrySelect id="billing-country" v-model="customer.billing.country" :default-value="customer.billing.country" />
          </div>

          <div class="w-full space-y-2">
            <label for="billing-zip" class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('billing.zip') }}</label>
            <input
              id="billing-zip"
              v-model="customer.billing.postcode"
              placeholder="10001"
              autocomplete="postal-code"
              type="text" />
          </div>

          <div class="w-full space-y-2 col-span-full">
            <label for="billing-email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ $t('billing.email') }}
            </label>
            <input
              id="billing-email"
              v-model="customer.billing.email"
              placeholder="johndoe@email.com"
              autocomplete="email"
              type="email"
              required />
          </div>
        </div>
      </div>

      <!-- Shipping Address Card -->
      <div class="bg-white border border-gray-100 rounded-lg shadow-xs dark:bg-gray-800 dark:border-gray-700">
        <div class="p-6 pb-4 border-b border-gray-100 md:px-8 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Shipping Address</h3>
        </div>
        <!-- Shipping Fields -->
        <div class="grid gap-6 p-6 md:p-8 md:grid-cols-2" v-if="customer.shipping">
          <div class="w-full space-y-2">
            <label for="shipping-first-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('billing.firstName') }}</label>
            <input
              id="shipping-first-name"
              v-model="customer.shipping.firstName"
              placeholder="John"
              autocomplete="given-name"
              type="text"
              required />
          </div>

          <div class="w-full space-y-2">
            <label for="shipping-last-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('billing.lastName') }}</label>
            <input
              id="shipping-last-name"
              v-model="customer.shipping.lastName"
              placeholder="Doe"
              autocomplete="family-name"
              type="text"
              required />
          </div>

          <div class="w-full space-y-2">
            <label for="shipping-phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ $t('billing.phone') }}
            </label>
            <input
              id="shipping-phone"
              v-model="customer.shipping.phone"
              placeholder="+1 234 567 8901"
              autocomplete="tel"
              type="tel" />
          </div>

          <div class="w-full space-y-2">
            <label for="shipping-company" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >Company <span class="font-normal text-gray-400 dark:text-gray-500">({{ $t('general.optional') }})</span></label
            >
            <input
              id="shipping-company"
              v-model="customer.shipping.company"
              placeholder="Company Name"
              autocomplete="organization"
              type="text" />
          </div>

          <div class="w-full space-y-2">
            <label for="shipping-address" class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('billing.address1') }}</label>
            <input
              id="shipping-address"
              v-model="customer.shipping.address1"
              placeholder="O'Connell Street 47"
              autocomplete="address-line1"
              type="text" />
          </div>

          <div class="w-full space-y-2">
            <label for="shipping-address-2" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >{{ $t('billing.address2') }} <span class="font-normal text-gray-400 dark:text-gray-500">({{ $t('general.optional') }})</span></label
            >
            <input
              id="shipping-address-2"
              v-model="customer.shipping.address2"
              placeholder="Apartment, studio, or floor"
              autocomplete="address-line2"
              type="text" />
          </div>

          <div class="w-full space-y-2">
            <label for="shipping-city" class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('billing.city') }}</label>
            <input
              id="shipping-city"
              v-model="customer.shipping.city"
              placeholder="New York"
              autocomplete="address-level2"
              type="text" />
          </div>

          <div class="w-full space-y-2" v-if="customer.shipping.state && customer.shipping.country">
            <label for="shipping-state" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >{{ $t('billing.state') }} <span class="font-normal text-gray-400 dark:text-gray-500">({{ $t('general.optional') }})</span></label
            >
            <StateSelect
              id="shipping-state"
              v-model="customer.shipping.state"
              :default-value="customer.shipping.state"
              :country-code="customer.shipping.country" />
          </div>

          <div class="w-full space-y-2" v-if="customer.shipping.country">
            <label for="shipping-country" class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('billing.country') }}</label>
            <CountrySelect id="shipping-country" v-model="customer.shipping.country" :default-value="customer.shipping?.country" />
          </div>

          <div class="w-full space-y-2">
            <label for="shipping-zip" class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('billing.zip') }}</label>
            <input
              id="shipping-zip"
              v-model="customer.shipping.postcode"
              placeholder="10001"
              autocomplete="postal-code"
              type="text" />
          </div>
        </div>

        <!-- Submit Button -->
        <div class="p-6 pt-4 border-t flex border-gray-100 rounded-b-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
          <Button :loading="loading" type="submit" class="ml-auto" :class="button.color">
            {{ button.text }}
          </Button>
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
