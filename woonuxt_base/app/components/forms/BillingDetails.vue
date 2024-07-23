<script lang="ts" setup>
const { updateShippingLocation } = useCheckout();

const props = defineProps({
  modelValue: { type: Object, required: true },
  sameAsShippingAddress: { type: Boolean, default: true },
});

const billing = toRef(props, 'modelValue');
</script>

<template>
  <div class="grid w-full gap-4 lg:grid-cols-2">
    <div class="w-full">
      <label for="first-name">{{ $t('messages.billing.firstName') }}</label>
      <input v-model="billing.firstName" placeholder="John" autocomplete="given-name" type="text" required />
    </div>

    <div class="w-full">
      <label for="last-name">{{ $t('messages.billing.lastName') }}</label>
      <input v-model="billing.lastName" placeholder="Doe" autocomplete="family-name" type="text" required />
    </div>

    <div class="w-full col-span-full">
      <label for="address1">{{ $t('messages.billing.address1') }}</label>
      <input v-model="billing.address1" placeholder="O'Connell Street 47" autocomplete="street-address" type="text" required />
    </div>

    <div class="w-full col-span-full">
      <label for="address2">{{ $t('messages.billing.address2') }} ({{ $t('messages.general.optional') }})</label>
      <input v-model="billing.address2" placeholder="Apartment, studio, or floor" autocomplete="address-line2" type="text" />
    </div>

    <div class="w-full">
      <label for="city">{{ $t('messages.billing.city') }}</label>
      <input v-model="billing.city" placeholder="New York" autocomplete="locality" type="text" required />
    </div>

    <div class="w-full">
      <label for="state">{{ $t('messages.billing.state') }} ({{ $t('messages.general.optional') }})</label>
      <StateSelect v-model="billing.state" :default-value="billing.state" :country-code="billing.country" @change="updateShippingLocation" />
    </div>

    <div class="w-full">
      <label for="country">{{ $t('messages.billing.country') }}</label>
      <CountrySelect v-model="billing.country" :default-value="billing.country" @change="updateShippingLocation" />
    </div>

    <div class="w-full">
      <label for="zip">{{ $t('messages.billing.zip') }}</label>
      <input v-model="billing.postcode" placeholder="10001" autocomplete="postal-code" type="text" required />
    </div>

    <div class="w-full col-span-full">
      <label for="phone">{{ $t('messages.billing.phone') }} ({{ $t('messages.general.optional') }})</label>
      <input v-model="billing.phone" placeholder="+1 234 567 8901" autocomplete="tel" type="tel" />
    </div>
  </div>
</template>
