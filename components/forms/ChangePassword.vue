<template>
  <form class="mt-4 grid gap-4 md:grid-cols-2">
    <h3 class="mt-12 col-span-full">Change Password</h3>
    <hr class="my-2 col-span-full" />
    <div class="w-full">
      <label for="current-password">Current Password</label>
      <input placeholder="••••••••••" type="password" required v-model="password.current" />
    </div>
    <br class="hidden md:block" />

    <div class="w-full">
      <label for="new-password">New Password</label>
      <input placeholder="••••••••••" type="password" required v-model="password.new" />
    </div>

    <div class="w-full">
      <label for="new-password-confirm">Confirm New Password</label>
      <input placeholder="••••••••••" type="password" required v-model="password.confirm" />
    </div>

    <div>
      <button
        class="rounded-xl font-semibold bg-gray-400 text-white py-2.5 px-4"
        :class="{ active: !!password.current || !!password.new || !!password.confirm }"
      >
        Update Password
      </button>
    </div>
  </form>
</template>

<script>
export default {
  data() {
    return {
      password: {},
    };
  },
};
</script>
