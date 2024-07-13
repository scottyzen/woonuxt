<script setup>
const { allowedCountries } = await GqlGetStates({ country: 'IE' });
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
      <input v-model="billing.firstName" placeholder="John" type="text" required />
    </div>

    <div class="w-full">
      <label for="last-name">{{ $t('messages.billing.lastName') }}</label>
      <input v-model="billing.lastName" placeholder="Doe" type="text" required />
    </div>

    <div class="w-full col-span-full">
      <label for="address1">{{ $t('messages.billing.address1') }}</label>
      <input v-model="billing.address1" placeholder="O'Connell Street" type="text" required />
    </div>

    <div class="w-full col-span-full">
      <label for="address2">{{ $t('messages.billing.address2') }}</label>
      <input v-model="billing.address2" placeholder="Dublin 1" type="text" />
    </div>

    <div class="w-full">
      <label for="city">{{ $t('messages.billing.city') }}</label>
      <input v-model="billing.city" placeholder="Dublin" type="text" required />
    </div>

    <div class="w-full">
      <label for="state">{{ $t('messages.billing.state') }}</label>
      <StateSelect v-model="billing.state" :default-value="billing.state" :country-code="billing.country" @change="updateShippingLocation" />
    </div>

    <div class="w-full">
      <label for="country">{{ $t('messages.billing.country') }}</label>
      <CountrySelect v-model="billing.country" :default-value="billing.country" @change="updateShippingLocation" />
    </div>

    <div class="w-full">
      <label for="zip">ZIP ({{ $t('messages.general.optional') }})</label>
      <input v-model="billing.postcode" placeholder="D01 1234" type="text" />
    </div>

    <div class="w-full col-span-full">
      <label for="phone">{{ $t('messages.billing.phone') }} ({{ $t('messages.general.optional') }})</label>
      <input v-model="billing.phone" placeholder="+353871234567" type="tel" />
    </div>
  </div>
</template>
