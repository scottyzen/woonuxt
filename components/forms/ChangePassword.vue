<template>
  <form class="bg-white rounded-lg shadow mt-4">
    <div class="grid p-8 gap-8 md:grid-cols-2">
      <h3 class="font-semibold text-xl col-span-full">Change Password</h3>
      <div class="w-full">
        <label for="current-password">Current Password</label>
        <input v-model="password.current" placeholder="••••••••••" type="password" required />
      </div>
      <br class="hidden md:block" />

      <div class="w-full">
        <label for="new-password">New Password</label>
        <input v-model="password.new" placeholder="••••••••••" type="password" required />
      </div>

      <div class="w-full">
        <label for="new-password-confirm">Confirm New Password</label>
        <input v-model="password.confirm" placeholder="••••••••••" type="password" required />
      </div>
    </div>

    <div class="bg-gray-100 col-span-full p-4">
      <button
        class="rounded-lg flex font-semibold ml-auto bg-gray-400 text-white py-2 px-4 gap-4 items-center"
        :class="{
          'bg-primary': !!password.current || !!password.new || !!password.confirm,
        }">
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
