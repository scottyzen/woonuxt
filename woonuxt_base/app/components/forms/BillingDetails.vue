<script lang="ts" setup>
import type { Address } from '#types/gql';

const { updateShippingLocation } = useCheckout();
const { isBillingAddressEnabled } = useCart();

const props = defineProps({
  modelValue: { type: Object as PropType<Address>, required: true },
});

const billing = toRef(props, 'modelValue');
</script>

<template>
  <div class="grid w-full gap-4 lg:grid-cols-2">
    <div class="w-full">
      <label for="first-name">{{ $t('billing.firstName') }}</label>
      <input id="first-name" v-model="billing.firstName" placeholder="John" autocomplete="given-name" type="text" required />
    </div>

    <div class="w-full">
      <label for="last-name">{{ $t('billing.lastName') }}</label>
      <input id="last-name" v-model="billing.lastName" placeholder="Doe" autocomplete="family-name" type="text" required />
    </div>

    <div v-if="isBillingAddressEnabled" class="w-full col-span-full">
      <label for="address1">{{ $t('billing.address1') }}</label>
      <input id="address1" v-model="billing.address1" placeholder="O'Connell Street 47" autocomplete="street-address" type="text" required />
    </div>

    <div v-if="isBillingAddressEnabled" class="w-full col-span-full">
      <label for="address2">{{ $t('billing.address2') }} ({{ $t('general.optional') }})</label>
      <input id="address2" v-model="billing.address2" placeholder="Apartment, studio, or floor" autocomplete="address-line2" type="text" />
    </div>

    <div v-if="isBillingAddressEnabled" class="w-full">
      <label for="city">{{ $t('billing.city') }}</label>
      <input id="city" v-model="billing.city" placeholder="New York" autocomplete="locality" type="text" required />
    </div>

    <div v-if="isBillingAddressEnabled" class="w-full">
      <label for="state">{{ $t('billing.state') }} ({{ $t('general.optional') }})</label>
      <StateSelect
        id="state"
        v-model="billing.state"
        :default-value="billing.state"
        :country-code="billing.country"
        @change="updateShippingLocation"
        autocomplete="address-level1" />
    </div>

    <div v-if="isBillingAddressEnabled" class="w-full">
      <label for="country">{{ $t('billing.country') }}</label>
      <CountrySelect id="country" v-model="billing.country" :default-value="billing.country" @change="updateShippingLocation" autocomplete="country" />
    </div>

    <div v-if="isBillingAddressEnabled" class="w-full">
      <label for="zip">{{ $t('billing.zip') }}</label>
      <input id="zip" v-model="billing.postcode" placeholder="10001" autocomplete="postal-code" type="text" required />
    </div>

    <div v-if="isBillingAddressEnabled" class="w-full col-span-full">
      <label for="phone">{{ $t('billing.phone') }} ({{ $t('general.optional') }})</label>
      <input id="phone" v-model="billing.phone" placeholder="+1 234 567 8901" autocomplete="tel" type="tel" />
    </div>
  </div>
</template>
