<script setup>
const props = defineProps({
  modelValue: { type: Object, required: true },
});

const shipping = toRef(props, 'modelValue');
</script>

<template>
  <div class="w-full grid gap-4 lg:grid-cols-2">
    <div class="w-full">
      <label for="first-name">{{ $t('messages.billing.firstName') }}</label>
      <input v-model="shipping.firstName" placeholder="John" type="text" required />
    </div>

    <div class="w-full">
      <label for="last-name">{{ $t('messages.billing.lastName') }}</label>
      <input v-model="shipping.lastName" placeholder="Doe" type="text" required />
    </div>

    <div class="w-full">
      <label for="email">{{ $t('messages.billing.email') }}</label>
      <input
        v-model="shipping.email"
        placeholder="johndoe@email.com"
        type="email"
        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
        required />
    </div>

    <div class="w-full">
      <label for="phone">{{ $t('messages.billing.phone') }}</label>
      <input v-model="shipping.phone" placeholder="+353871234567" type="tel" />
    </div>

    <div class="w-full col-span-full">
      <label for="address1">{{ $t('messages.billing.address1') }}</label>
      <input v-model="shipping.address1" placeholder="O'Connell Street" type="text" required />
    </div>

    <div class="w-full col-span-full">
      <label for="address2">{{ $t('messages.billing.address2') }}</label>
      <input v-model="shipping.address2" placeholder="Dublin 1" type="text" />
    </div>

    <div class="w-full">
      <label for="city">{{ $t('messages.billing.city') }}</label>
      <input v-model="shipping.city" placeholder="Dublin" type="text" required />
    </div>

    <div class="w-full">
      <label for="country">{{ $t('messages.billing.country') }}</label>
      <CountrySelect v-model="shipping.country" :default-value="shipping.country" />
    </div>
  </div>
</template>
