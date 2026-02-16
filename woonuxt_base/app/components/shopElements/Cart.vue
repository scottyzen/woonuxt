<script setup lang="ts">
const { cart, toggleCart, isUpdatingCart } = useCart();
</script>

<template>
  <div class="fixed top-0 bottom-0 right-0 z-50 flex flex-col w-11/12 max-w-lg overflow-x-hidden bg-white dark:bg-gray-800 shadow-lg">
    <Icon
      name="ion:close-outline"
      class="absolute p-1 rounded-lg shadow-lg top-6 left-6 md:left-8 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
      size="34"
      @click="toggleCart(false)" />

    <EmptyCart v-if="cart && !cart.isEmpty" class="rounded-lg shadow-lg p-1.5 hover:bg-red-400 hover:text-white" />

    <div class="mt-8 text-center text-gray-900 dark:text-white font-semibold">
      {{ $t('shop.cart') }}
      <span v-if="cart?.contents?.productCount"> ({{ cart?.contents?.productCount }}) </span>
    </div>

    <ClientOnly>
      <template v-if="cart && !cart.isEmpty">
        <ul class="flex flex-col flex-1 gap-4 p-6 overflow-y-scroll md:p-8">
          <CartCard v-for="item in cart.contents?.nodes" :key="item.key" :item />
        </ul>
        <div class="px-6 pb-8 mb-safe md:px-8">
          <!-- Hook: Before cart totals -->
          <HookOutlet name="cart.summary.beforeTotals" :ctx="{ cart }" as="div" class="mb-4" />

          <Button :to="cart && !cart.isEmpty ? '/checkout' : '/shop'" class="w-full" size="lg" variant="primary" @click="toggleCart()">
            <span class="mx-2" v-if="cart && !cart.isEmpty">{{ $t('shop.checkout') }}</span>
            <span class="mx-2" v-else>{{ $t('shop.continueShopping') }}</span>
            <span v-if="cart && !cart.isEmpty" v-html="cart.total" />
          </Button>

          <!-- Hook: After cart totals -->
          <HookOutlet name="cart.summary.afterTotals" :ctx="{ cart }" as="div" class="mt-4" />
        </div>
      </template>
      <!-- Empty Cart Message -->
      <EmptyCartMessage v-else-if="cart && cart.isEmpty" />
      <!-- Cart Loading -->
      <div v-else class="flex flex-col items-center justify-center flex-1 mb-20">
        <LoadingIcon />
      </div>
    </ClientOnly>
    <!-- Cart Loading Overlay -->
    <div v-if="isUpdatingCart" class="absolute inset-0 flex items-center justify-center bg-white/25 dark:bg-gray-800/50">
      <LoadingIcon />
    </div>
  </div>
</template>
