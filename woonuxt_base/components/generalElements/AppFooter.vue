<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();
</script>

<template>
  <div class="bg-white">
    <div class="container flex flex-wrap justify-between gap-12 my-24 md:gap-24">
      <div class="mr-auto">
        <Logo />
        <p class="mt-4 text-sm text-gray-700 xl:max-w-sm">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl sit amet aliquam lacinia, nunc odio lacinia tortor, vel aliquam nisl lorem quis nunc. Sed
          euismod, nisl sit amet aliquam lacinia, nunc odio lacinia tortor, vel aliquam nisl lorem quis nunc.
        </p>
        <LangSwitcher class="mt-8" />
      </div>
      <div class="w-3/7 lg:w-auto">
        <div class="mb-1 font-semibold">Information</div>
        <div class="text-sm">
          <a class="py-1.5 block">About Us</a>
          <a class="py-1.5 block">Careers</a>
          <a class="py-1.5 block">Press</a>
          <a class="py-1.5 block">Affiliates</a>
        </div>
      </div>
      <div class="w-3/7 lg:w-auto">
        <div class="mb-1 font-semibold">Products</div>
        <div class="text-sm">
          <NuxtLink to="/products" class="py-1.5 block">{{ $t('messages.shop.newArrivals') }}</NuxtLink>
          <a href="#" class="py-1.5 block">{{ $t('messages.shop.giftCards') }}</a>
        </div>
      </div>
      <div class="w-3/7 lg:w-auto">
        <div class="mb-1 font-semibold">{{ $t('messages.general.customerService') }}</div>
        <div class="text-sm">
          <NuxtLink to="/contact" class="py-1.5 block">Contact Us</NuxtLink>
          <a class="py-1.5 block">Shipping & Returns</a>
          <a class="py-1.5 block">Privacy Policy</a>
          <a class="py-1.5 block">Terms & Conditions</a>
        </div>
      </div>
      <div class="w-3/7 lg:w-auto">
        <div class="mb-1 font-semibold">{{ $t('messages.account.myAccount') }}</div>
        <div class="text-sm">
          <NuxtLink to="/my-account/" class="py-1.5 block">{{ $t('messages.account.myAccount') }}</NuxtLink>
          <NuxtLink to="/my-account/?tab=orders" class="py-1.5 block">{{ $t('messages.shop.orderHistory') }}</NuxtLink>
          <NuxtLink to="/wishlist" class="py-1.5 block">{{ $t('messages.shop.wishlist') }}</NuxtLink>
          <a class="py-1.5 block">{{ $t('messages.general.newsletter') }}</a>
        </div>
      </div>
    </div>
    <div class="container border-t">
      <div class="copywrite">
        <p class="py-4 text-xs text-center">
          <a href="https://woonuxt.com">WooNuxt v{{ runtimeConfig.public.version }}</a> - by
          <a href="https://scottyzen.com" target="_blank">Scottyzen</a>
        </p>
      </div>
    </div>
  </div>
</template>
