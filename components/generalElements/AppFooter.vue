<template>
  <div class="bg-white">
    <div class="container flex flex-wrap my-24 gap-12 justify-between md:gap-24">
      <div class="mr-auto">
        <Logo />
        <p class="mt-4 text-sm text-gray-700 xl:max-w-sm">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl sit amet aliquam lacinia, nunc odio lacinia tortor, vel
          aliquam nisl lorem quis nunc. Sed euismod, nisl sit amet aliquam lacinia, nunc odio lacinia tortor, vel aliquam nisl lorem quis
          nunc.
        </p>
      </div>
      <div class="w-3/7 lg:w-auto">
        <div class="font-semibold mb-1">Information</div>
        <div class="text-sm">
          <a href="#" class="py-1.5 block">About Us</a>
          <a href="#" class="py-1.5 block">Careers</a>
          <a href="#" class="py-1.5 block">Press</a>
          <a href="#" class="py-1.5 block">Affiliates</a>
        </div>
      </div>
      <div class="w-3/7 lg:w-auto">
        <div class="font-semibold mb-1">Products</div>
        <div class="text-sm">
          <NuxtLink to="/products?orderby=date&order=DESC" class="py-1.5 block">{{ $t('messages.shop.newArrivals') }}</NuxtLink>
          <NuxtLink to="/products?filter=sale[true]" class="py-1.5 block">{{ $t('messages.shop.onSale') }}</NuxtLink>
          <NuxtLink to="/products?orderby=best-selling" class="py-1.5 block">{{ $t('messages.shop.productBestSellers') }}</NuxtLink>
          <a href="#" class="py-1.5 block">{{ $t('messages.shop.giftCards') }}</a>
        </div>
      </div>
      <div class="w-3/7 lg:w-auto">
        <div class="font-semibold mb-1">{{ $t('messages.general.customerService') }}</div>
        <div class="text-sm">
          <a href="#" class="py-1.5 block">Contact Us</a>
          <a href="#" class="py-1.5 block">Shipping & Returns</a>
          <a href="#" class="py-1.5 block">Privacy Policy</a>
          <a href="#" class="py-1.5 block">Terms & Conditions</a>
        </div>
      </div>
      <div class="w-3/7 lg:w-auto">
        <div class="font-semibold mb-1">{{ $t('messages.account.myAccount') }}</div>
        <div class="text-sm">
          <NuxtLink to="/my-account" class="py-1.5 block">{{ $t('messages.account.myAccount') }}</NuxtLink>
          <NuxtLink to="/my-account?tab=orders" class="py-1.5 block">{{ $t('messages.shop.orderHistory') }}</NuxtLink>
          <NuxtLink to="/wishlist" class="py-1.5 block">{{ $t('messages.shop.wishlist') }}</NuxtLink>
          <a href="#" class="py-1.5 block">{{ $t('messages.general.newsletter') }}</a>
        </div>
      </div>
    </div>
    <div class="container border-t">
      <div class="copywrite">
        <p class="text-xs text-center py-4">
          <a href="https://woonuxt.com">WooNuxt v0.4.21</a> - by
          <a href="https://scottyzen.com" target="_blank">Scottyzen</a>
        </p>
      </div>
    </div>
  </div>
</template>
