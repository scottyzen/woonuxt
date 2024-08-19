<template>
  <form class="bg-white rounded-lg shadow mt-4" @submit.prevent="updatePassword">
    <div class="grid p-8 gap-6 md:grid-cols-2">
      <h3 class="font-semibold text-xl col-span-full">{{ $t('messages.account.changePassword') }}</h3>

      <input type="text" v-model="viewer.username" name="username" autocomplete="username" style="display: none;"/>

      <div class="w-full">
        <label for="new-password">{{ $t('messages.account.newPassword') }}</label>
        <PasswordInput id="new-password" v-model="password.new" placeholder="••••••••••" type="text" required />
      </div>

      <div class="w-full">
        <label for="new-password-confirm">{{ $t('messages.account.confirmNewPassword') }}</label>
        <PasswordInput id="new-password-confirm" v-model="password.confirm" placeholder="••••••••••" type="text" required />
      </div>

      <Transition name="scale-y" mode="out-in">
        <div v-if="errorMessage" class="w-full text-sm text-red-500" v-html="errorMessage"></div>
      </Transition>
    </div>

    <div class="bg-white backdrop-blur-sm bg-opacity-75 border-t col-span-full p-4 sticky bottom-0 rounded-b-lg">
      <button
        class="rounded-md flex font-semibold ml-auto text-white py-2 px-4 gap-4 items-center disabled:bg-gray-400 disabled:cursor-not-allowed"
        :class="button.color"
        :disabled="loading">
        <LoadingIcon v-if="loading" color="#fff" size="20" />
        <span>{{ button.text }}</span>
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
const { viewer, loginUser } = useAuth();
const { t } = useI18n();

const password = ref<{ new: string; confirm: string }>({ new: '', confirm: '' });
const loading = ref<boolean>(false);
const button = ref<{ text: string; color: string }>({ text: t('messages.account.updatePassword'), color: 'bg-primary hover:bg-primary-dark' });
const errorMessage = ref<string>('');

const updatePassword = async () => {
  errorMessage.value = '';
  if (password.value.new !== password.value.confirm) {
    errorMessage.value = t('messages.error.passwordMismatch');
    return;
  }

  try {
    loading.value = true;
    const { updateCustomer } = await GqlUpdateCustomer({ input: { id: viewer.value.id, password: password.value.new } });
    if (updateCustomer) {
      button.value = { text: t('messages.account.updateSuccess'), color: 'bg-green-500' };
      const { success, error } = await loginUser({ username: viewer.value.username, password: password.value.new });
      if (error) {
        errorMessage.value = error;
        button.value = { text: t('messages.account.failed'), color: 'bg-red-500' };
      }
      if (success) {
        password.value = { new: '', confirm: '' };
      }
    }
  } catch (error) {
    console.error(error);
    const gqlError = error?.gqlErrors?.[0]?.message;
    errorMessage.value = gqlError || 'An error occurred. Please try again.';
    button.value = { text: t('messages.account.failed'), color: 'bg-red-500' };
  }

  loading.value = false;

  setTimeout(() => {
    button.value = { text: t('messages.account.updatePassword'), color: 'bg-primary hover:bg-primary-dark' };
  }, 2000);
};
</script>
