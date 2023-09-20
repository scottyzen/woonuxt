<template>
  <form class="bg-white rounded-lg shadow mt-4">
    <div class="grid p-8 gap-6 md:grid-cols-2">
      <h3 class="font-semibold text-xl col-span-full">{{ $t('messages.account.changePassword') }}</h3>
      <div class="w-full">
        <label for="current-password">{{ $t('messages.account.currentPassword') }}</label>
        <input v-model="password.current" placeholder="••••••••••" type="password" required />
      </div>
      <br class="hidden md:block" />

      <div class="w-full">
        <label for="new-password">{{ $t('messages.account.newPassword') }}</label>
        <input v-model="password.new" placeholder="••••••••••" type="password" required />
      </div>

      <div class="w-full">
        <label for="new-password-confirm">{{ $t('messages.account.confirmNewPassword') }}</label>
        <input v-model="password.confirm" placeholder="••••••••••" type="password" required />
      </div>
    </div>

    <div class="bg-white backdrop-blur-sm bg-opacity-75 border-t col-span-full p-4 sticky bottom-0 rounded-b-lg">
      <button class="rounded-md bg-primary flex font-semibold ml-auto text-white py-2 px-4 gap-4 items-center">
        {{ $t('messages.account.updatePassword') }}
      </button>
    </div>
  </form>
</template>

<script setup>
const password = ref({});
</script>
