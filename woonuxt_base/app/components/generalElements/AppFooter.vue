<script setup lang="ts">
import { ref } from 'vue';
import { useAuth } from '~/composables/useAuth';

//const { wooNuxtVersionInfo } = useHelpers();
const { wishlistLink } = useAuth();
const email = ref('');
const isSubmitting = ref(false);
const showSuccess = ref(false);

function subscribeToNewsletter() {
  if (!email.value) return;
  isSubmitting.value = true;
  // Simulate API call
  setTimeout(() => {
    isSubmitting.value = false;
    showSuccess.value = true;
    email.value = '';
    setTimeout(() => {
      showSuccess.value = false;
    }, 3000);
  }, 800);
}
</script>

<template>
  <footer class="bg-white order-last relative z-10">
    <div class="container flex flex-wrap justify-between gap-12 my-24 md:gap-24">
      <div class="mr-auto">
        <Logo class="transform transition-all duration-300 hover:scale-105" />
        <WebsiteShortDescription class="mt-3 text-gray-600" />
        
        <!-- Newsletter Signup -->
        <div class="mt-6 max-w-md">
          <h3 class="text-sm font-semibold text-gray-800 mb-2">Stay Updated</h3>
          <p class="text-xs text-gray-600 mb-3">Subscribe for exclusive offers, new arrivals, and fashion tips.</p>
          <form @submit.prevent="subscribeToNewsletter" class="flex">
            <input 
              v-model="email"
              type="email" 
              placeholder="Your email address" 
              class="flex-grow px-3 py-2 text-sm border border-gray-200 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
            <button 
              type="submit" 
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm rounded-r-md transition-colors duration-300 flex items-center justify-center min-w-[80px]"
              :disabled="isSubmitting"
            >
              <span v-if="isSubmitting">
                <Icon name="ion:reload-outline" class="animate-spin" size="16" />
              </span>
              <span v-else-if="showSuccess">
                <Icon name="ion:checkmark" size="16" />
              </span>
              <span v-else>Subscribe</span>
            </button>
          </form>
        </div>
        
        <LangSwitcher class="mt-8" />
      </div>
      <!--<div class="w-3/7 lg:w-auto">
        <div class="mb-1 font-semibold">Information</div>
        <div class="text-sm">
          <a class="py-1.5 block" href="https://github.com/scottyzen/woonuxt?tab=readme-ov-file#next-generation-front-end-for-woocommerce" target="_blank">About</a>
          <a href="/" class="py-1.5 block">Careers</a>
          <a href="/" class="py-1.5 block">Press</a>
          <a href="https://woonuxt.com/faq" class="py-1.5 block" rel="noreferrer" target="_blank">FAQ's</a>
        </div>
      </div> -->
      <div class="w-3/7 lg:w-auto">
        <div class="mb-2 font-semibold text-gray-800 border-b border-gray-100 pb-1">Products</div>
        <div class="text-sm">
          <NuxtLink to="/products" class="py-1.5 block transition-colors duration-200 hover:text-blue-600">{{ $t('messages.shop.newArrivals') }}</NuxtLink>
          <NuxtLink to="/products?filter=sale[true]" class="py-1.5 block transition-colors duration-200 hover:text-blue-600">Current Sales</NuxtLink>
          <NuxtLink to="/products?orderby=price" class="py-1.5 block transition-colors duration-200 hover:text-blue-600">Shop by Price</NuxtLink>
         <!-- <NuxtLink to="/products?orderby=rating&order=ASC&filter=rating[1]" class="py-1.5 block">Top Rated</NuxtLink>
          <a href="/" class="py-1.5 block">{{ $t('messages.shop.giftCards') }}</a> -->
        </div>
      </div>
      <div class="w-3/7 lg:w-auto">
        <div class="mb-2 font-semibold text-gray-800 border-b border-gray-100 pb-1">{{ $t('messages.general.customerService') }}</div>
        <div class="text-sm">
          <NuxtLink to="/contact-us" class="py-1.5 block transition-colors duration-200 hover:text-blue-600">Contact Us</NuxtLink>
          <!-- <a href="/" class="py-1.5 block">Shipping & Returns</a> -->
          <a href="/" class="py-1.5 block transition-colors duration-200 hover:text-blue-600">Privacy Policy</a>
         <!-- <a href="/" class="py-1.5 block">Terms & Conditions</a> -->
        </div>
      </div>
      <div class="w-3/7 lg:w-auto">
        <div class="mb-2 font-semibold text-gray-800 border-b border-gray-100 pb-1">{{ $t('messages.account.myAccount') }}</div>
        <div class="text-sm">
          <NuxtLink to="/my-account/" class="py-1.5 block transition-colors duration-200 hover:text-blue-600">{{ $t('messages.account.myAccount') }}</NuxtLink>
          <NuxtLink to="/my-account/?tab=orders" class="py-1.5 block transition-colors duration-200 hover:text-blue-600">{{ $t('messages.shop.orderHistory') }}</NuxtLink>
          <NuxtLink :to="wishlistLink" class="py-1.5 block transition-colors duration-200 hover:text-blue-600">{{ $t('messages.shop.wishlist') }}</NuxtLink>
         <!-- <a href="/" class="py-1.5 block">{{ $t('messages.general.newsletter') }}</a> -->
        </div>
      </div>
    </div>
    <div class="container border-t border-gray-100 flex flex-col items-center justify-center mb-4">
      <!-- Security Warning -->
      <div class="w-full py-4 mb-4 border-b border-gray-100">
        <div class="flex items-start gap-3">
          <div class="flex-shrink-0 mt-0.5">
            <Icon name="ion:shield-checkmark-outline" class="text-blue-600" size="24" />
          </div>
          <div>
            <h3 class="text-sm font-medium text-gray-800">Secure Shopping Information</h3>
            <p class="text-xs text-gray-600 mt-1">
              For your security, please verify you're on our official website <span class="font-medium">modaprimeusa.com</span> and only communicate with us via <span class="font-medium">modaprime@protonmail.com</span> or Telegram <span class="font-medium">@EJ1994</span>.
            </p>
            <div class="mt-2 flex flex-wrap gap-4">
              <div class="flex items-center gap-1.5">
                <Icon name="ion:checkmark-circle" class="text-green-600" size="16" />
                <span class="text-xs">Check the URL before payments</span>
              </div>
              <div class="flex items-center gap-1.5">
                <Icon name="ion:checkmark-circle" class="text-green-600" size="16" />
                <span class="text-xs">Verify official contacts</span>
              </div>
              <div class="flex items-center gap-1.5">
                <Icon name="ion:shield" class="text-blue-600" size="16" />
                <span class="text-xs">We prioritize your security</span>
              </div>
              <div class="flex items-center gap-1.5">
                <Icon name="ion:information-circle" class="text-blue-600" size="16" />
                <NuxtLink to="/security" class="text-xs text-blue-600 hover:underline">Security information</NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="copywrite">
        <p class="py-4 text-xs text-center text-gray-500">
          <a href="https://modaprimeusa.com" class="hover:text-blue-600 transition-colors duration-200">© 2025 ModaPrime USA</a>
        </p>
      </div>
      <SocialIcons class="ml-auto" />
    </div>
  </footer>
</template>

<style scoped lang="postcss">
a {
  @apply hover:underline;
}

footer {
  position: relative;
  background-color: white;
  box-shadow: 0 -1px 3px rgba(0,0,0,0.02);
}

footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: white;
  z-index: -1;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
