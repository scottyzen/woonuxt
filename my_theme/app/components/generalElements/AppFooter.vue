<script setup lang="ts">
const { wooNuxtVersionInfo } = useHelpers();
const { wishlistLink } = useAuth();
</script>

<template>
  <footer class="bg-white order-last">
    <div class="container flex flex-wrap justify-between gap-12 my-24 md:gap-24">
      <div class="mr-auto">
        <template>
  <NuxtLink to="/" class="inline-flex items-center gap-2">
    <img src="/images/logo-black.svg" alt="Logo" class="object-contain h-10" />
  </NuxtLink>
</template>
        <WebsiteShortDescription />
        <div class="inline-flex gap-2 justify-start mt-8">
          <LangSwitcher />
        </div>
      </div>
      <div class="w-[42.857%] lg:w-auto">
        <div class="mb-1 font-semibold text-gray-900">{{ $t('general.information') }}</div>
        <div class="text-sm text-gray-700">
          <a class="py-1.5 block" href="/about" target="_blank">{{
            $t('general.about')
          }}</a>
          <a href="/faq" class="py-1.5 block" rel="noreferrer" target="_blank">FAQ's</a>
        </div>
      </div>
      <div class="w-[42.857%] lg:w-auto">
        <div class="mb-1 font-semibold text-gray-900">{{ $t('general.products') }}</div>
        <div class="text-sm text-gray-700">
          <NuxtLink to="/products" class="py-1.5 block">{{ $t('shop.newArrivals') }}</NuxtLink>
          <NuxtLink to="/products?filter=sale[true]" class="py-1.5 block">{{ $t('shop.onSale') }}</NuxtLink>
          <NuxtLink to="/products?orderby=rating&order=ASC&filter=rating[1]" class="py-1.5 block">{{ $t('shop.topRated') }}</NuxtLink>
          <a href="/" class="py-1.5 block">{{ $t('shop.giftCards') }}</a>
        </div>
      </div>
      <div class="w-[42.857%] lg:w-auto">
        <div class="mb-1 font-semibold text-gray-900">{{ $t('general.customerService') }}</div>
        <div class="text-sm text-gray-700">
          <NuxtLink to="/contact" class="py-1.5 block">{{ $t('general.contactUs') }}</NuxtLink>
          <a href="/shipping-returns" class="py-1.5 block">{{ $t('general.shippingReturns') }}</a>
          <a href="/privacy-policy" class="py-1.5 block">{{ $t('general.privacyPolicy') }}</a>
          <a href="/terms-conditions" class="py-1.5 block">{{ $t('general.termsConditions') }}</a>
        </div>
      </div>
      <div class="w-[42.857%] lg:w-auto">
        <div class="mb-1 font-semibold text-gray-900">{{ $t('account.myAccount') }}</div>
        <div class="text-sm text-gray-700">
          <NuxtLink to="/my-account/" class="py-1.5 block">{{ $t('account.myAccount') }}</NuxtLink>
          <NuxtLink to="/my-account/?tab=orders" class="py-1.5 block">{{ $t('shop.orderHistory') }}</NuxtLink>
          <NuxtLink :to="wishlistLink" class="py-1.5 block">{{ $t('shop.wishlist') }}</NuxtLink>
          <a href="/" class="py-1.5 block">{{ $t('general.newsletter') }}</a>
        </div>
      </div>
    </div>
    <div class="container border-t border-gray-200 flex items-center justify-center mb-4">
      <div class="copywrite">
        <p class="py-4 text-xs text-center text-gray-600">
         © 2026 <a href="https://www.acsweetjewelry.com/">Acsweet Jewelry</a>. All rights reserved.
        </p>
      </div>
      <SocialIcons class="ml-auto" />
    </div>
  </footer>
</template>

<style scoped>
a:hover {
  text-decoration: underline;
}
</style>
