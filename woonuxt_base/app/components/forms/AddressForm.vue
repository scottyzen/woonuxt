<script lang="ts" setup>
import type { Address } from '#types/gql';

const { updateShippingLocation } = useCheckout();

const props = defineProps({
  modelValue: { type: Object as PropType<Address>, required: true },
  showAddressFields: { type: Boolean, default: true },
  addressType: { type: String as PropType<'billing' | 'shipping'>, default: 'shipping' },
});

const address = toRef(props, 'modelValue');
const fieldId = (field: string) => `${props.addressType}-${field}`;
const autocomplete = (token: string) => `section-${props.addressType} ${token}`;
</script>

<template>
  <div class="@container w-full">
    <div class="grid w-full gap-4 @lg:grid-cols-2">
      <div class="w-full">
        <label :for="fieldId('first-name')">{{ $t('billing.firstName') }}</label>
        <input
          :id="fieldId('first-name')"
          v-model="address.firstName"
          :name="fieldId('first-name')"
          placeholder="John"
          :autocomplete="autocomplete('given-name')"
          type="text"
          autocapitalize="words"
          required />
      </div>

      <div class="w-full">
        <label :for="fieldId('last-name')">{{ $t('billing.lastName') }}</label>
        <input
          :id="fieldId('last-name')"
          v-model="address.lastName"
          :name="fieldId('last-name')"
          placeholder="Doe"
          :autocomplete="autocomplete('family-name')"
          type="text"
          autocapitalize="words"
          required />
      </div>

      <template v-if="showAddressFields">
        <div class="w-full col-span-full">
          <label :for="fieldId('address1')">{{ $t('billing.address1') }}</label>
          <input
            :id="fieldId('address1')"
            v-model="address.address1"
            :name="fieldId('address1')"
            placeholder="O'Connell Street 47"
            :autocomplete="autocomplete('address-line1')"
            type="text"
            autocapitalize="words"
            required
            @change="updateShippingLocation" />
        </div>

        <div class="w-full col-span-full">
          <label :for="fieldId('address2')">{{ $t('billing.address2') }} ({{ $t('general.optional') }})</label>
          <input
            :id="fieldId('address2')"
            v-model="address.address2"
            :name="fieldId('address2')"
            placeholder="Apartment, studio, or floor"
            :autocomplete="autocomplete('address-line2')"
            type="text"
            autocapitalize="words"
            @change="updateShippingLocation" />
        </div>

        <div class="w-full">
          <label :for="fieldId('city')">{{ $t('billing.city') }}</label>
          <input
            :id="fieldId('city')"
            v-model="address.city"
            :name="fieldId('city')"
            placeholder="New York"
            :autocomplete="autocomplete('address-level2')"
            type="text"
            autocapitalize="words"
            required
            @change="updateShippingLocation" />
        </div>

        <div class="w-full">
          <label :for="fieldId('state')">{{ $t('billing.state') }} ({{ $t('general.optional') }})</label>
          <StateSelect
            :id="fieldId('state')"
            v-model="address.state"
            :name="fieldId('state')"
            :default-value="address.state"
            :country-code="address.country"
            :autocomplete="autocomplete('address-level1')"
            @change="updateShippingLocation" />
        </div>

        <div class="w-full">
          <label :for="fieldId('country')">{{ $t('billing.country') }}</label>
          <CountrySelect
            :id="fieldId('country')"
            v-model="address.country"
            :name="fieldId('country')"
            :default-value="address.country"
            :autocomplete="autocomplete('country')"
            @change="updateShippingLocation" />
        </div>

        <div class="w-full">
          <label :for="fieldId('zip')">{{ $t('billing.zip') }}</label>
          <input
            :id="fieldId('zip')"
            v-model="address.postcode"
            :name="fieldId('zip')"
            placeholder="10001"
            :autocomplete="autocomplete('postal-code')"
            type="text"
            autocapitalize="characters"
            required
            @change="updateShippingLocation" />
        </div>

        <div class="w-full col-span-full">
          <label :for="fieldId('phone')">{{ $t('billing.phone') }} ({{ $t('general.optional') }})</label>
          <input
            :id="fieldId('phone')"
            v-model="address.phone"
            :name="fieldId('phone')"
            placeholder="+1 234 567 8901"
            :autocomplete="autocomplete('tel')"
            type="tel"
            inputmode="tel" />
        </div>
      </template>
    </div>
  </div>
</template>
