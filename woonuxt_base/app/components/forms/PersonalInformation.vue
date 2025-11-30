<template>
  <div v-if="customer">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Personal Information</h1>
      <p class="text-gray-600 dark:text-gray-400">
        Manage your personal information, including your name, username and email address where you can be contacted
      </p>
    </div>

    <form class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700" @submit.prevent="saveChanges">
      <div class="p-6 md:px-8 pb-4 border-b border-gray-100 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Personal Details</h3>
      </div>
      <!-- Form Fields -->
      <div class="grid gap-6 p-6 md:p-8 md:grid-cols-2">
        <div class="w-full space-y-2">
          <label for="first-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('billing.firstName') }}</label>
          <input
            id="first-name"
            v-model="customer.firstName"
            placeholder="John"
            autocomplete="given-name"
            type="text"
            class="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 text-gray-900 dark:text-white" />
        </div>

        <div class="w-full space-y-2">
          <label for="last-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('billing.lastName') }}</label>
          <input
            id="last-name"
            v-model="customer.lastName"
            placeholder="Doe"
            autocomplete="family-name"
            type="text"
            class="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 text-gray-900 dark:text-white" />
        </div>

        <div class="w-full space-y-2">
          <label for="username" class="block text-sm font-medium text-gray-500 dark:text-gray-400">
            {{ $t('account.username') }}
          </label>
          <input
            id="username"
            v-model="customer.username"
            placeholder="johndoe"
            autocomplete="username"
            type="text"
            disabled
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed opacity-60" />
        </div>

        <div class="w-full space-y-2">
          <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ $t('billing.email') }}
          </label>
          <input
            id="email"
            v-model="customer.email"
            placeholder="johndoe@email.com"
            autocomplete="email"
            type="email"
            class="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 text-gray-900 dark:text-white" />
        </div>
      </div>

      <!-- Submit Button -->
      <div class="p-6 pt-4 bg-gray-50 dark:bg-gray-800 rounded-b-lg border-t border-gray-100 dark:border-gray-700">
        <button
          class="ml-auto flex items-center justify-center gap-3 px-6 py-2 text-white rounded-lg font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          :class="button.color"
          :disabled="loading">
          <LoadingIcon v-if="loading" color="#fff" size="18" />
          <span>{{ button.text }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
const { viewer, customer } = useAuth();
const { t } = useI18n();

const loading = ref<boolean>(false);
const button = ref<{ text: string; color: string }>({ text: t('account.updateDetails'), color: 'bg-primary hover:bg-primary-dark' });

async function saveChanges() {
  loading.value = true;
  button.value.text = t('account.updating');
  const firstName = customer.value.firstName;
  const lastName = customer.value.lastName;
  try {
    const { updateCustomer } = await GqlUpdateCustomer({ input: { id: viewer.value.id, firstName, lastName } });
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
