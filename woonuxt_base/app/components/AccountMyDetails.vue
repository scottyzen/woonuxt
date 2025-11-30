<template>
  <div class="grid gap-8 account-form">
    <PersonalInformation />
    <BillingAndShipping />
    <ChangePassword />
  </div>
</template>

<style lang="postcss">
.account-form input[type='text'],
.account-form input[type='email'],
.account-form input[type='tel'],
.account-form input[type='password'],
.account-form textarea,
.account-form .StripeElement {
  @apply bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md outline-none w-full py-2 px-4 block md:bg-gray-50 dark:md:bg-gray-700 shadow-inner text-gray-900 dark:text-white;
}

.account-form select {
  @apply bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md outline-none w-full py-2 px-4 block md:bg-gray-50 dark:md:bg-gray-700 shadow-sm text-gray-900 dark:text-white;
}

.account-form label {
  @apply text-xs mb-1 text-gray-600 dark:text-gray-400 inline-block uppercase;
}
</style>
