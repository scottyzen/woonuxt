<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useSearching } from '~/composables/useSearch';

const { isShowingSearch } = useSearching();
const showAnnouncement = ref(true);
const showNotification = ref(false);
const isSecurityBanner = ref(true);

// Alternate between security and promotion banners every 5 days
const alternateAnnouncement = () => {
  // Use date to determine which banner to show (changes every 5 days)
  const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (24 * 60 * 60 * 1000));
  isSecurityBanner.value = Math.floor(dayOfYear / 5) % 2 === 0;
};

onMounted(() => {
  // Determine which banner to show
  alternateAnnouncement();
  
  // Show notification after 3 seconds
  setTimeout(() => {
    showNotification.value = true;
  }, 3000);
});

const closeAnnouncement = () => {
  showAnnouncement.value = false;
};

const closeNotification = () => {
  showNotification.value = false;
};
</script>

<template>
  <header class="sticky top-0 z-40">
    <div class="bg-white shadow-sm shadow-light-500 transition-all duration-300">
      <div class="container flex items-center justify-between py-4">
        <div class="flex items-center gap-8">
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
      <div v-if="showAnnouncement">
        <!-- Security Banner -->
        <NuxtLink 
          v-if="isSecurityBanner" 
          to="/security"
          class="block w-full bg-gray-50 hover:bg-gray-100 transition-all duration-300 relative overflow-hidden"
          style="background: linear-gradient(to right, rgba(249, 250, 251, 0.9), rgba(243, 244, 246, 0.8)); box-shadow: 0 1px 2px rgba(0,0,0,0.05);"
        >
          <div class="container py-2.5 px-4 flex items-center justify-center">
            <div class="flex items-center gap-3 text-gray-700">
              <Icon name="ion:information-circle-outline" class="text-blue-600" size="18" />
              <span class="text-sm font-medium tracking-wide">Verify official channels: modaprimeusa.com, modaprime@protonmail.com, Telegram @EJ1994. <NuxtLink to="/security" class="text-blue-600 hover:underline">Security Info</NuxtLink> | <NuxtLink to="/contact-us" class="text-blue-600 hover:underline">Contact Us</NuxtLink></span>
            </div>
            <button 
              @click.prevent="closeAnnouncement"
              class="text-gray-500 hover:text-gray-700 p-1.5 absolute right-4 transition-all duration-200 hover:scale-110 rounded-full hover:bg-gray-200"
              aria-label="Close announcement"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </NuxtLink>
        
        <!-- New Customer Incentive Banner -->
        <NuxtLink 
          v-else
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
      </div>
    </Transition>
    
    <!-- Special Offer Notification -->
    <Transition name="slide-notification">
      <div 
        v-if="showNotification" 
        class="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-xs w-full border-l-4 border-blue-600 z-50 flex items-start"
      >
        <div class="flex-1 pr-2">
          <h3 class="font-medium text-gray-900 text-sm">We Love Our Loyal Customers!</h3>
          <p class="text-xs text-gray-600 mt-1">Take 10% off your next order with code: <span class="font-medium text-blue-600">LOYAL10</span></p>
          <p class="text-[10px] text-gray-400 mt-1">*Terms apply. Cannot be combined with other offers, including first-time incentives. Limit one per customer.</p>
          <div class="mt-2 flex space-x-2">
            <NuxtLink 
              to="/products" 
              class="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors duration-200"
            >
              Shop Now
            </NuxtLink>
            <button 
              @click="closeNotification" 
              class="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded transition-colors duration-200"
            >
              Later
            </button>
          </div>
        </div>
        <button @click="closeNotification" class="text-gray-400 hover:text-gray-600">
          <Icon name="ion:close-outline" size="18" />
        </button>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.slide-notification-enter-active,
.slide-notification-leave-active {
  transition: all 0.3s ease;
}

.slide-notification-enter-from,
.slide-notification-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.scale-y-enter-active,
.scale-y-leave-active {
  transition: all 0.2s ease;
  transform-origin: top;
}

.scale-y-enter-from,
.scale-y-leave-to {
  transform: scaleY(0);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
