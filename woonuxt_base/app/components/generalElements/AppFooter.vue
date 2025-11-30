<script setup lang="ts">
const { wooNuxtVersionInfo } = useHelpers();
const { wishlistLink } = useAuth();
</script>

<template>
  <footer class="bg-white dark:bg-gray-800 order-last">
    <div class="container flex flex-wrap justify-between gap-12 my-24 md:gap-24">
      <div class="mr-auto">
        <Logo />
        <WebsiteShortDescription />
        <div class="inline-flex gap-2 justify-start mt-8">
          <LangSwitcher />
          <ColorModeSwitcher />
        </div>
      </div>
      <div class="w-3/7 lg:w-auto">
        <div class="mb-1 font-semibold text-gray-900 dark:text-white">{{ $t('general.information') }}</div>
        <div class="text-sm text-gray-700 dark:text-gray-300">
          <a class="py-1.5 block" href="https://github.com/scottyzen/woonuxt?tab=readme-ov-file#next-generation-front-end-for-woocommerce" target="_blank">{{
            $t('general.about')
          }}</a>
          <a href="/" class="py-1.5 block">{{ $t('general.careers') }}</a>
          <a href="/" class="py-1.5 block">{{ $t('general.press') }}</a>
          <a href="https://woonuxt.com/faq" class="py-1.5 block" rel="noreferrer" target="_blank">FAQ's</a>
        </div>
      </div>
      <div class="w-3/7 lg:w-auto">
        <div class="mb-1 font-semibold text-gray-900 dark:text-white">{{ $t('general.products') }}</div>
        <div class="text-sm text-gray-700 dark:text-gray-300">
          <ClientOnly>
            <NuxtLink to="/products" class="py-1.5 block">{{ $t('shop.newArrivals') }}</NuxtLink>
            <template #fallback>
              <a href="/products" class="py-1.5 block">{{ $t('shop.newArrivals') }}</a>
            </template>
          </ClientOnly>
          <ClientOnly>
            <NuxtLink to="/products?filter=sale[true]" class="py-1.5 block">{{ $t('shop.onSale') }}</NuxtLink>
            <template #fallback>
              <a href="/products?filter=sale[true]" class="py-1.5 block">{{ $t('shop.onSale') }}</a>
            </template>
          </ClientOnly>
          <ClientOnly>
            <NuxtLink to="/products?orderby=rating&order=ASC&filter=rating[1]" class="py-1.5 block">{{ $t('shop.topRated') }}</NuxtLink>
            <template #fallback>
              <a href="/products?orderby=rating&order=ASC&filter=rating[1]" class="py-1.5 block">{{ $t('shop.topRated') }}</a>
            </template>
          </ClientOnly>
          <a href="/" class="py-1.5 block">{{ $t('shop.giftCards') }}</a>
        </div>
      </div>
      <div class="w-3/7 lg:w-auto">
        <div class="mb-1 font-semibold text-gray-900 dark:text-white">{{ $t('general.customerService') }}</div>
        <div class="text-sm text-gray-700 dark:text-gray-300">
          <ClientOnly>
            <NuxtLink to="/contact" class="py-1.5 block">{{ $t('general.contactUs') }}</NuxtLink>
            <template #fallback>
              <a href="/contact" class="py-1.5 block">{{ $t('general.contactUs') }}</a>
            </template>
          </ClientOnly>
          <a href="/" class="py-1.5 block">{{ $t('general.shippingReturns') }}</a>
          <a href="/" class="py-1.5 block">{{ $t('general.privacyPolicy') }}</a>
          <a href="/" class="py-1.5 block">{{ $t('general.termsConditions') }}</a>
        </div>
      </div>
      <div class="w-3/7 lg:w-auto">
        <div class="mb-1 font-semibold text-gray-900 dark:text-white">{{ $t('account.myAccount') }}</div>
        <div class="text-sm text-gray-700 dark:text-gray-300">
          <ClientOnly>
            <NuxtLink to="/my-account/" class="py-1.5 block">{{ $t('account.myAccount') }}</NuxtLink>
            <template #fallback>
              <a href="/my-account/" class="py-1.5 block">{{ $t('account.myAccount') }}</a>
            </template>
          </ClientOnly>
          <ClientOnly>
            <NuxtLink to="/my-account/?tab=orders" class="py-1.5 block">{{ $t('shop.orderHistory') }}</NuxtLink>
            <template #fallback>
              <a href="/my-account/?tab=orders" class="py-1.5 block">{{ $t('shop.orderHistory') }}</a>
            </template>
          </ClientOnly>
          <ClientOnly>
            <NuxtLink :to="wishlistLink" class="py-1.5 block">{{ $t('shop.wishlist') }}</NuxtLink>
            <template #fallback>
              <a href="/wishlist" class="py-1.5 block">{{ $t('shop.wishlist') }}</a>
            </template>
          </ClientOnly>
          <a href="/" class="py-1.5 block">{{ $t('general.newsletter') }}</a>
        </div>
      </div>
    </div>
    <div class="container border-t border-gray-200 dark:border-gray-700 flex items-center justify-center mb-4">
      <div class="copywrite">
        <p class="py-4 text-xs text-center text-gray-600 dark:text-gray-400">
          <a href="https://woonuxt.com" :title="`WooNuxt v${wooNuxtVersionInfo}`">{{ `WooNuxt v${wooNuxtVersionInfo}` }}</a> - by
          <a href="https://scottyzen.com" title="Scott Kennedy - Web Developer" target="_blank">Scott Kennedy</a>
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
</style>
