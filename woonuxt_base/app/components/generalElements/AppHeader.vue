<script setup lang="ts">
import { ref } from 'vue';
const { isShowingSearch } = useSearching();

const showAnnouncement = ref(true);
const closeAnnouncement = () => {
  showAnnouncement.value = false;
};
</script>

<template>
  <header class="sticky top-0 z-40">
    <div class="bg-white shadow-sm shadow-light-500 transition-all duration-300">
      <div class="container flex items-center justify-between py-4">
        <div class="flex items-center gap-2">
          <MenuTrigger class="lg:hidden" />
          <Logo class="md:w-[160px] transition-transform duration-300 hover:scale-105" />
        </div>
        <MainMenu class="items-center hidden gap-6 text-sm text-gray-500 lg:flex lg:px-4" />
        <div class="flex justify-end items-center md:w-[160px] flex-1 ml-auto gap-4 md:gap-6">
          <ProductSearch class="hidden sm:inline-flex max-w-[320px] w-[60%]" />
          <SearchTrigger />
          <div class="flex gap-4 items-center">
            <SignInLink />
            <CartTrigger />
          </div>
        </div>
      </div>
      <Transition name="scale-y" mode="out-in">
        <div class="container mb-3 -mt-1 sm:hidden" v-if="isShowingSearch">
          <ProductSearch class="flex w-full" />
        </div>
      </Transition>
    </div>
    <Transition name="fade">
      <NuxtLink 
        v-if="showAnnouncement" 
        to="/product/new-customers-10-free-modawake"
        class="block w-full bg-blue-50 hover:bg-blue-100 transition-all duration-300 relative overflow-hidden"
        style="background: linear-gradient(to right, rgba(219, 234, 254, 0.7), rgba(191, 219, 254, 0.5)); box-shadow: 0 1px 2px rgba(0,0,0,0.05);"
      >
        <div class="container py-2.5 px-4 flex items-center justify-center">
          <div class="flex items-center gap-3 text-blue-800">
            <span class="text-lg animate-pulse">🎉</span>
            <span class="text-sm font-medium tracking-wide">Special Offer: 10 Modawake - <span class="font-bold text-blue-700">*FREE*</span> for NEW CUSTOMERS!</span>
          </div>
          <button 
            @click.prevent="closeAnnouncement"
            class="text-blue-600 hover:text-blue-800 p-1.5 absolute right-4 transition-all duration-200 hover:scale-110 rounded-full hover:bg-blue-100"
            aria-label="Close announcement"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </NuxtLink>
    </Transition>
  </header>
</template>
