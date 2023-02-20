<script setup>
const props = defineProps({
  modelValue: { type: Object, required: true },
});

const billing = toRef(props, 'modelValue');
</script>

<template>
  <div class="w-full grid gap-4 lg:grid-cols-2">
    <div class="w-full">
      <label for="first-name">First Name</label>
      <input v-model="billing.firstName" placeholder="John" type="text" required />
    </div>

    <div class="w-full">
      <label for="last-name">Last Name</label>
      <input v-model="billing.lastName" placeholder="Doe" type="text" required />
    </div>

    <div class="w-full">
      <label for="email">Email</label>
      <input
        v-model="billing.email"
        placeholder="johndoe@email.com"
        type="email"
        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
        required />
    </div>

    <div class="w-full">
      <label for="phone">Phone</label>
      <input v-model="billing.phone" placeholder="+353871234567" type="tel" />
    </div>

    <div class="w-full col-span-full">
      <label for="address1">Address Line 1</label>
      <input v-model="billing.address1" placeholder="O'Connell Street" type="text" required />
    </div>

    <div class="w-full col-span-full">
      <label for="address2">Address Line 2</label>
      <input v-model="billing.address2" placeholder="Dublin 1" type="text" />
    </div>

    <div class="w-full">
      <label for="city">City</label>
      <input v-model="billing.city" placeholder="Dublin" type="text" required />
    </div>

    <div class="w-full">
      <label for="country">Country</label>
      <CountrySelect v-model="billing.country" :default-value="billing.country" />
    </div>
  </div>
</template>
