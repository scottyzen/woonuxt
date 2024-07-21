<script setup lang="ts">
const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const { viewer, resetPasswordWithKey, loginUser } = useAuth();

const password = ref('');
const confirmPassword = ref('');
const errorMessage = ref('');
const isPending = ref(false);
const isInvalidLink = ref(false);

if (!route.query.key && !route.query.login) {
  router.push('/my-account?action=forgotPassword');
}

const handlePasswordReset = async () => {
  try {
    errorMessage.value = '';
    isInvalidLink.value = false;
    isPending.value = true;

    if (password.value !== confirmPassword.value) {
      throw new Error(t('messages.error.passwordMismatch'));
    }

    const userInfo = {
      key: route.query.key as string,
      login: route.query.login as string,
      password: password.value,
    };

    if (!userInfo.key || !userInfo.login) {
      isInvalidLink.value = true;
      throw new Error(t('messages.error.invalidPasswordResetLink'));
    }

    const resetResult = await resetPasswordWithKey(userInfo);
    if (!resetResult.success) {
      isInvalidLink.value = true;
      throw new Error(resetResult.error);
    }

    if (viewer.value) {
      const loginResult = await loginUser({ username: userInfo.login, password: userInfo.password });
      if (!loginResult.success) {
        throw new Error(loginResult.error);
      }
    }

    router.push('/my-account');
  } catch (error: any) {
    errorMessage.value = error.message || t('messages.error.general');
  } finally {
    isPending.value = false;
  }
};

useHead({
  title: t('messages.account.resetPassword'),
});
</script>

<template>
  <div class="max-w-lg mx-auto my-16 min-h-[600px] lg:my-24">
    <div class="flex flex-col items-center">
      <Logo class="mb-6 scale-125" />
      <h1 class="text-xl font-semibold lg:text-3xl">{{ $t('messages.account.resetPassword') }}</h1>
    </div>

    <form class="mt-6 flex flex-col" @submit.prevent="handlePasswordReset">
      <label for="password" class="mb-4">
        {{ $t('messages.account.newPassword') }} <span class="text-red-500">*</span><br />
        <PasswordInput id="password" className=" border rounded-lg w-full p-3 px-4 bg-white" v-model="password" placeholder="New Password" :required="true" />
      </label>

      <label for="confirmPassword" class="mb-4">
        {{ $t('messages.account.confirmNewPassword') }} <span class="text-red-500">*</span><br />
        <PasswordInput
          id="confirmPassword"
          className="border rounded-lg w-full p-3 px-4 bg-white"
          v-model="confirmPassword"
          placeholder="Confirm Password"
          :required="true" />
      </label>

      <Transition name="scale-y" mode="out-in">
        <div v-if="errorMessage" class="text-sm mb-4">
          <span class="text-red-500" v-html="errorMessage"></span>
          <NuxtLink v-if="isInvalidLink" class="underline cursor-pointer pl-1" to="/my-account?action=forgotPassword">{{
            $t('messages.account.requestNewLink')
          }}</NuxtLink>
        </div>
      </Transition>

      <button class="flex items-center justify-center gap-4 mt-4 text-lg">
        <LoadingIcon v-if="isPending" stroke="4" size="16" color="#fff" />
        <span>{{ $t('messages.account.resetPassword') }}</span>
      </button>
    </form>

    <div class="my-8 text-center cursor-pointer">
      <NuxtLink to="/my-account">{{ $t('messages.account.backToLogin') }}</NuxtLink>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
input,
button {
  @apply border rounded-lg mb-4 w-full p-3 px-4 bg-white;
}

form button {
  @apply rounded-lg font-bold bg-gray-800 text-white py-3 px-8 hover:bg-gray-800;
}
</style>
