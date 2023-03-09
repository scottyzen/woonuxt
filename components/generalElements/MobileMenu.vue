<script setup>
const { toggleMobileMenu } = useHelpers();
const route = useRoute();

// if the route changes, close the mobile menu
watch(route, () => {
  toggleMobileMenu(false);
});
</script>
<template>
  <div class="bg-white flex flex-col max-w-lg shadow-lg top-0 bottom-0 left-0 w-9/10 z-50 fixed overflow-x-hidden">
    <CloseIcon class="bg-white rounded-xl shadow-xl p-1.5" @click="toggleMobileMenu(false)" />
    <div class="mt-8 text-center">{{ $t('messages.general.menu') }}</div>
    <MainMenu class="m-4 grid p-8 text-gray-500 gap-6" />
    <div class="mt-auto text-center p-8 text-[10px] text-gray-400 uppercase">
      <a href="/">WooNuxt Version 3.0.2</a>
    </div>
  </div>
</template>
