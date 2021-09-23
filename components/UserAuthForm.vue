<template>
  <div class="max-w-md mx-auto">
    <form class="grid gap-4 mb-4" @submit.prevent="submitForm(userInfo)">
      <input placeholder="Username/Email" type="email" v-model="userInfo.email" />
      <input placeholder="Password" type="text" v-model="userInfo.password" />
      <button>{{ buttonText }}</button>
    </form>
    <button @click="googleSSO">Sign in with Google</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userInfo: { email: "", password: "" },
    };
  },
  methods: {
    googleSSO() {
      this.$auth.loginWith("google").then(() => {
        console.log("you have been logged in.");
      });
    },
  },
  props: ["submitForm", "buttonText"],
};
</script>

<style lang="postcss" scoped>
input,
button {
  @apply p-4 rounded border w-full;
}
form button {
  @apply p-4 bg-purple-600 text-white rounded;
}
</style>
