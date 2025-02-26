<script setup lang="ts">
//const { wooNuxtVersionInfo } = useHelpers();
const { wishlistLink } = useAuth();
</script>

<template>
  <footer class="bg-white order-last relative z-10">
    <div class="container flex flex-wrap justify-between gap-12 my-24 md:gap-24">
      <div class="mr-auto">
        <Logo class="transform transition-all duration-300 hover:scale-105" />
        <WebsiteShortDescription class="mt-3 text-gray-600" />
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
          <NuxtLink to="/contact" class="py-1.5 block transition-colors duration-200 hover:text-blue-600">Contact Us</NuxtLink>
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
    <div class="container border-t border-gray-100 flex items-center justify-center mb-4">
      <div class="copywrite">
        <p class="py-4 text-xs text-center text-gray-500">
          <a href="https://modaprimeusa.com" class="hover:text-blue-600 transition-colors duration-200">© 2024 ModaPrime USA</a>
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
</style>
