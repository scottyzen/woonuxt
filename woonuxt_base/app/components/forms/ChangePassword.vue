<template>
  <div>
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Password</h1>
      <p class="text-gray-600 dark:text-gray-400">Update your password to keep your account secure</p>
    </div>

    <form class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700" @submit.prevent="updatePassword">
      <div class="p-6 md:px-8 pb-4 border-b border-gray-100 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Change Password</h3>
      </div>
      <!-- Form Fields -->
      <div class="grid p-6 md:p-8 gap-6 md:grid-cols-2">
        <input type="text" v-model="viewer.username" name="username" autocomplete="username" style="display: none" />

        <div class="w-full space-y-2">
          <label for="new-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('account.newPassword') }}</label>
          <PasswordInput
            id="new-password"
            v-model="password.new"
            placeholder="••••••••••"
            type="text"
            required
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 text-gray-900 dark:text-white" />
        </div>

        <div class="w-full space-y-2">
          <label for="new-password-confirm" class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('account.confirmNewPassword') }}</label>
          <PasswordInput
            id="new-password-confirm"
            v-model="password.confirm"
            placeholder="••••••••••"
            type="text"
            required
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 text-gray-900 dark:text-white" />
        </div>

        <!-- Password Requirements -->
        <div v-if="password.new" class="col-span-full p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg">
          <div class="flex items-start gap-3">
            <Icon name="ion:information-circle" size="20" class="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div class="text-sm text-blue-900 dark:text-blue-100">
              <p class="font-medium mb-2">Password requirements:</p>
              <ul class="space-y-1.5 text-blue-700 dark:text-blue-300">
                <li class="flex items-center gap-2">
                  <Icon
                    :name="password.new.length >= 8 ? 'ion:checkmark-circle' : 'ion:ellipse-outline'"
                    size="16"
                    :class="password.new.length >= 8 ? 'text-green-600' : 'text-gray-400'" />
                  At least 8 characters
                </li>
                <li class="flex items-center gap-2">
                  <Icon
                    :name="password.new === password.confirm && password.new ? 'ion:checkmark-circle' : 'ion:ellipse-outline'"
                    size="16"
                    :class="password.new === password.confirm && password.new ? 'text-green-600' : 'text-gray-400'" />
                  Passwords match
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <Transition name="scale-y" mode="out-in">
          <div
            v-if="errorMessage"
            class="col-span-full p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
            <Icon name="ion:alert-circle" size="20" class="text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <div class="text-sm text-red-800 dark:text-red-200" v-html="errorMessage"></div>
          </div>
        </Transition>
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
const { viewer, loginUser } = useAuth();
const { t } = useI18n();

const password = ref<{ new: string; confirm: string }>({ new: '', confirm: '' });
const loading = ref<boolean>(false);
const button = ref<{ text: string; color: string }>({ text: t('account.updatePassword'), color: 'bg-primary hover:bg-primary-dark' });
const errorMessage = ref<string>('');

const updatePassword = async () => {
  errorMessage.value = '';
  if (password.value.new !== password.value.confirm) {
    errorMessage.value = t('error.passwordMismatch');
    return;
  }

  try {
    loading.value = true;
    const { updateCustomer } = await GqlUpdateCustomer({ input: { id: viewer.value.id, password: password.value.new } });
    if (updateCustomer) {
      button.value = { text: t('account.updateSuccess'), color: 'bg-green-500' };
      const { success, error } = await loginUser({ username: viewer.value.username, password: password.value.new });
      if (error) {
        errorMessage.value = error;
        button.value = { text: t('account.failed'), color: 'bg-red-500' };
      }
      if (success) {
        password.value = { new: '', confirm: '' };
      }
    }
  } catch (error) {
    console.error(error);
    const gqlError = error?.gqlErrors?.[0]?.message;
    errorMessage.value = gqlError || 'An error occurred. Please try again.';
    button.value = { text: t('account.failed'), color: 'bg-red-500' };
  }

  loading.value = false;

  setTimeout(() => {
    button.value = { text: t('account.updatePassword'), color: 'bg-primary hover:bg-primary-dark' };
  }, 2000);
};
</script>
