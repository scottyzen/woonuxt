<template>
  <div class="mx-auto max-w-md my-16 min-h-96">
    <h1 class="font-bold mb-4 text-3xl">My Account</h1>
    <div v-if="message" class="my-4 text-sm text-red-500">{{ message }}</div>
    <form class="mb-4" @submit.prevent="loginOrRegister(userInfo)">
      <label v-if="formView == 'register'" for="email">Email</label>
      <input v-if="formView == 'register'" id="email" v-model="userInfo.email" placeholder="Email" type="email" required />
      <label for="username">Username</label>
      <input id="email" v-model="userInfo.username" placeholder="Username" type="text" required />
      <label for="password">Password</label>
      <input id="password" v-model="userInfo.password" placeholder="Password" type="password" required />
      <button class="flex mt-4 text-lg gap-2 justify-center items-center">
        <LoadingIcon v-if="isPending" :stroke="4" :size="16" color="#fff" />
        <span>
          {{ formView == 'login' ? 'Log In' : 'Register' }}
        </span>
      </button>
    </form>
    <div v-if="formView == 'login'" class="my-4 text-center">
      If you don't have an account, please
      <a class="cursor-pointer underline" @click="formView = 'register'">register</a>.
    </div>
    <div v-if="formView == 'register'" class="my-4 text-center">
      If you already have an account, please
      <a class="cursor-pointer underline" @click="formView = 'login'">log in</a>.
    </div>
  </div>
</template>

<script setup>
const { loginUser, isPending, registerUser } = useAuth();
const userInfo = ref({ email: '', password: '', username: '' });
const formView = ref('login');
const message = ref('');

const loginOrRegister = async (userInfo) => {
  if (formView.value === 'register') {
    const { success, error } = await registerUser(userInfo);
    if (success) {
      formView.value = 'login';
      message.value = 'Account created! Please log in.';
    } else if (error && error === 'username_exists') {
      message.value = 'That username is already taken. Please try another.';
    } else if (error && error === 'email_exists') {
      message.value = 'That email is already taken. Please try another.';
    } else {
      message.value = 'Something went wrong. Please try again.';
    }
  } else {
    const { success, error } = await loginUser(userInfo);
    if (error && error === 'invalid_username') {
      formView.value = 'register';
      message.value = 'No account found with that username. Please register.';
    }
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
