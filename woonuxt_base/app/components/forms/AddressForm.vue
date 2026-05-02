<script lang="ts" setup>
import type { Address } from '#types/gql';

const { updateShippingLocation } = useCheckout();

const props = defineProps({
  modelValue: { type: Object as PropType<Address>, required: true },
  showAddressFields: { type: Boolean, default: true },
});

const address = toRef(props, 'modelValue');
</script>

<template>
  <div class="@container w-full">
    <div class="grid w-full gap-4 @lg:grid-cols-2">
      <div class="w-full">
        <label for="first-name">{{ $t('billing.firstName') }}</label>
        <input id="first-name" v-model="address.firstName" placeholder="John" autocomplete="given-name" type="text" required />
      </div>

      <div class="w-full">
        <label for="last-name">{{ $t('billing.lastName') }}</label>
        <input id="last-name" v-model="address.lastName" placeholder="Doe" autocomplete="family-name" type="text" required />
      </div>

      <template v-if="showAddressFields">
        <div class="w-full col-span-full">
          <label for="address1">{{ $t('billing.address1') }}</label>
          <input
            id="address1"
            v-model="address.address1"
            placeholder="O'Connell Street 47"
            autocomplete="street-address"
            type="text"
            @change="updateShippingLocation"
            required />
        </div>

        <div class="w-full col-span-full">
          <label for="address2">{{ $t('billing.address2') }} ({{ $t('general.optional') }})</label>
          <input
            id="address2"
            v-model="address.address2"
            placeholder="Apartment, studio, or floor"
            autocomplete="address-line2"
            type="text"
            @change="updateShippingLocation" />
        </div>

        <div class="w-full">
          <label for="city">{{ $t('billing.city') }}</label>
          <input id="city" v-model="address.city" placeholder="New York" autocomplete="locality" type="text" @change="updateShippingLocation" required />
        </div>

        <div class="w-full">
          <label for="state">{{ $t('billing.state') }} ({{ $t('general.optional') }})</label>
          <StateSelect
            id="state"
            v-model="address.state"
            :default-value="address.state"
            :country-code="address.country"
            @change="updateShippingLocation"
            autocomplete="address-level1" />
        </div>

        <div class="w-full">
          <label for="country">{{ $t('billing.country') }}</label>
          <CountrySelect id="country" v-model="address.country" :default-value="address.country" @change="updateShippingLocation" autocomplete="country" />
        </div>

        <div class="w-full">
          <label for="zip">{{ $t('billing.zip') }}</label>
          <input id="zip" v-model="address.postcode" placeholder="10001" autocomplete="postal-code" type="text" @change="updateShippingLocation" required />
        </div>

        <div class="w-full col-span-full">
          <label for="phone">{{ $t('billing.phone') }} ({{ $t('general.optional') }})</label>
          <input id="phone" v-model="address.phone" placeholder="+1 234 567 8901" autocomplete="tel" type="tel" />
        </div>
      </template>
    </div>
  </div>
</template>
