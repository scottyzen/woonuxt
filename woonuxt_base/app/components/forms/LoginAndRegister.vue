<template>
  <div class="max-w-lg mx-auto my-16 min-h-[600px] lg:my-24">
    <div class="flex flex-col items-center">
      <Logo class="mb-6 scale-125" />
      <h1 class="text-xl font-semibold lg:text-3xl">{{ formTitle }}</h1>
      <div v-if="formView === 'login'" class="my-2 text-center">
        {{ $t('messages.account.noAccount') }}
        <a class="font-semibold cursor-pointer text-primary" @click="navigate('register')"> {{ $t('messages.account.accountRegister') }} </a>.
      </div>
      <div v-if="formView === 'register'" class="my-2 text-center">
        {{ $t('messages.account.hasAccount') }}
        <a class="font-semibold cursor-pointer text-primary" @click="navigate('login')">
          {{ $t('messages.general.please') }} {{ $t('messages.account.accountLogin') }}
        </a>
        .
      </div>
    </div>

    <form class="mt-6" @submit.prevent="handleFormSubmit(userInfo)">
      <label v-if="formView === 'register' || formView === 'forgotPassword'" for="email">
        {{ emailLabel }}
        <span class="text-red-500">*</span> <br />
        <input id="email" v-model="userInfo.email" :placeholder="inputPlaceholder.email" autocomplete="email" type="text" required />
      </label>
      <p v-if="formView === 'forgotPassword'" class="text-sm text-gray-500">{{ $t('messages.account.enterEmailOrUsernameForReset') }}</p>
      <div v-if="formView !== 'forgotPassword'">
        <label for="username">
          {{ usernameLabel }}
          <span class="text-red-500">*</span> <br />
          <input id="username" v-model="userInfo.username" :placeholder="inputPlaceholder.username" autocomplete="username" type="text" required />
        </label>
        <label for="password">
          {{ passwordLabel }} <span class="text-red-500">*</span> <br />
          <PasswordInput
            id="password"
            className="border rounded-lg w-full p-3 px-4 bg-white"
            v-model="userInfo.password"
            :placeholder="inputPlaceholder.password"
            :autocomplete="formView === 'login' ? 'current-password' : 'new-password'"
            :required="true" />
        </label>
      </div>
      <Transition name="scale-y" mode="out-in">
        <div v-if="message" class="my-4 text-sm text-green-500" v-html="message"></div>
      </Transition>
      <Transition name="scale-y" mode="out-in">
        <div v-if="errorMessage" class="my-4 text-sm text-red-500" v-html="errorMessage"></div>
      </Transition>
      <button class="flex items-center justify-center gap-4 mt-4 text-lg">
        <LoadingIcon v-if="isPending" stroke="4" size="16" color="#fff" />
        <span>{{ buttonText }}</span>
      </button>
    </form>
    <div class="my-8 text-center cursor-pointer" @click="navigate('forgotPassword')" v-if="formView === 'login'">
      {{ $t('messages.account.forgotPassword') }}
    </div>
    <div class="my-8 text-center cursor-pointer" @click="navigate('login')" v-if="formView === 'forgotPassword'">{{ $t('messages.account.backToLogin') }}</div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const { loginUser, isPending, registerUser, sendResetPasswordEmail } = useAuth();
const userInfo = ref({ email: '', password: '', username: '' });
const formView = ref('login');
const message = ref('');
const errorMessage = ref('');

const updateFormView = () => {
  if (route.query.action === 'forgotPassword') {
    formView.value = 'forgotPassword';
  } else if (route.query.action === 'register') {
    formView.value = 'register';
  } else {
    formView.value = 'login';
  }
};
watch(route, updateFormView, { immediate: true });

const login = async (userInfo) => {
  const { success, error } = await loginUser(userInfo);
  switch (error) {
    case 'invalid_username':
      errorMessage.value = t('messages.error.invalidUsername');
      break;
    case 'incorrect_password':
      errorMessage.value = t('messages.error.incorrectPassword');
      break;
    default:
      errorMessage.value = error;
      break;
  }

  if (success) {
    errorMessage.value = '';
    message.value = t('messages.account.loggingIn');
  }
};

const handleFormSubmit = async (userInfo) => {
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
  } else if (formView.value === 'forgotPassword') {
    resetPassword(userInfo);
  } else {
    login(userInfo);
  }
};

const resetPassword = async (userInfo) => {
  const { success, error } = await sendResetPasswordEmail(userInfo.email);
  if (success) {
    errorMessage.value = '';
    message.value = t('messages.account.ifRegistered');
  } else {
    errorMessage.value = error;
  }
};

const navigate = (view: string) => {
  formView.value = view;
  if (view === 'forgotPassword') {
    router.push({ query: { action: 'forgotPassword' } });
  } else if (view === 'register') {
    router.push({ query: { action: 'register' } });
  } else {
    router.push({ query: {} });
  }
};

const formTitle = computed(() => {
  if (formView.value === 'login') {
    return t('messages.account.loginToAccount');
  } else if (formView.value === 'register') {
    return t('messages.account.accountRegister');
  } else if (formView.value === 'forgotPassword') {
    return t('messages.account.forgotPassword');
  }
});

const buttonText = computed(() => {
  if (formView.value === 'login') {
    return t('messages.account.login');
  } else if (formView.value === 'register') {
    return t('messages.account.register');
  } else if (formView.value === 'forgotPassword') {
    return t('messages.account.sendPasswordResetEmail');
  }
});

const emailLabel = computed(() => (formView.value === 'register' ? t('messages.billing.email') : t('messages.account.emailOrUsername')));
const usernameLabel = computed(() => (formView.value === 'login' ? t('messages.account.emailOrUsername') : t('messages.account.username')));
const passwordLabel = computed(() => t('messages.account.password'));

const inputPlaceholder = computed(() => {
  return {
    email: 'johndoe@email.com',
    username: formView.value === 'login' ? 'johndoe@email.com' : 'johndoe',
    password: '********',
  };
});
</script>

<style lang="postcss" scoped>
input,
button {
  @apply border rounded-lg mb-4 w-full p-3 px-4 bg-white;
}

form button {
  @apply rounded-lg font-bold bg-gray-800 text-white py-3 px-8 hover:bg-gray-800;
}
</style>
