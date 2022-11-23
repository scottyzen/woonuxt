<template>
  <div class="account-form">
    <PersonalInformation :user="user" />
    <ChangePassword />
    <Billing :user="user" />
    <Shipping :user="user" />
  </div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="postcss">
.account-form input[type="text"],
.account-form input[type="email"],
.account-form input[type="tel"],
.account-form input[type="password"],
.account-form textarea,
.account-form .StripeElement,
.account-form select {
  @apply bg-white border rounded-xl outline-none w-full py-2.5 px-4 block md: bg-gray-50 ;
}

.account-form label {
  @apply text-xs mb-1.5 text-gray-600 inline-block uppercase block;
}

a.active {
  @apply bg-purple-50 text-purple-800;
}
</style>
