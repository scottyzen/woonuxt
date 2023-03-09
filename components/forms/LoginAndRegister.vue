<template>
  <div class="mx-auto max-w-lg my-16 min-h-96 lg:my-24">
    <h1 class="font-bold text-xl mb-4 lg:text-3xl">{{ $t('messages.account.myAccount') }}</h1>
    <form class="mb-4" @submit.prevent="loginOrRegister(userInfo)">
      <label v-if="formView == 'register'" for="email"
        >Email <span class="text-red-500">*</span> <br />
        <input
          id="email"
          v-model="userInfo.email"
          placeholder="Email"
          type="email"
          pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
          required />
      </label>
      <label for="username"
        >{{ $t('messages.account.username') }} <span class="text-red-500">*</span> <br />
        <input id="username" v-model="userInfo.username" placeholder="Username" type="text" required />
      </label>
      <label for="password"
        >{{ $t('messages.account.password') }} <span class="text-red-500">*</span> <br />
        <input id="password" v-model="userInfo.password" placeholder="Password" type="password" required />
      </label>
      <Transition name="scale-y" mode="out-in">
        <div v-if="message" class="my-4 text-sm text-green-500" v-html="message"></div>
      </Transition>
      <Transition name="scale-y" mode="out-in">
        <div v-if="errorMessage" class="my-4 text-sm text-red-500" v-html="errorMessage"></div>
      </Transition>
      <button class="flex mt-4 text-lg gap-4 justify-center items-center">
        <LoadingIcon v-if="isPending" stroke="4" size="16" color="#fff" />
        <span>{{ formView == 'login' ? $t('messages.account.login') : $t('messages.account.register') }}</span>
      </button>
    </form>
    <div v-if="formView == 'login'" class="my-4 text-center">
      {{ $t('messages.account.noAccount') }}
      <a class="cursor-pointer underline" @click="formView = 'register'">{{ $t('messages.general.please') }} {{ $t('messages.account.accountRegister') }}</a>.
    </div>
    <div v-if="formView == 'register'" class="my-4 text-center">
      {{ $t('messages.account.hasAccount') }}
      <a class="cursor-pointer underline" @click="formView = 'login'">{{ $t('messages.general.please') }} {{ $t('messages.account.accountLogin') }}</a>.
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n();
const { loginUser, isPending, registerUser } = useAuth();
const userInfo = ref({ email: '', password: '', username: '' });
const formView = ref('login');
const message = ref('');
const errorMessage = ref('');

const login = async (userInfo) => {
  const { success, error } = await loginUser(userInfo);
  if (error && error === 'invalid_username') {
    errorMessage.value = t('messages.error.invalidUsername');
  } else if (error && error === 'incorrect_password') {
    errorMessage.value = t('messages.error.incorrectPassword');
  } else if (error) {
    errorMessage.value = error;
  } else {
    errorMessage.value = '';
    message.value = t('messages.account.loggingIn');
  }
};

const loginOrRegister = async (userInfo) => {
  if (formView.value === 'register') {
    const { success, error } = await registerUser(userInfo);
    if (success) {
      errorMessage.value = '';
      message.value = t('messages.account.accountCreated') + ' ' + t('messages.account.loggingIn');
      setTimeout(() => {
        login(userInfo);
      }, 2000);
    } else {
      errorMessage.value = error;
    }
  } else {
    login(userInfo);
  }
};
</script>

<style lang="postcss" scoped>
input,
button {
  @apply border rounded-lg mb-4 w-full p-3 px-4;
}

form button {
  @apply rounded-lg font-bold bg-gray-800 text-white py-3 px-8 hover: bg-gray-800;
}
</style>
