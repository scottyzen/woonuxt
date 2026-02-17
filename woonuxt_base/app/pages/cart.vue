<script setup lang="ts">
const { cart, isUpdatingCart, optimisticPendingMutations } = useCart();
const isCartUpdating = computed(() => isUpdatingCart.value || optimisticPendingMutations.value > 0);

definePageMeta({
  title: 'Cart',
});

useSeoMeta({
  title: 'Shopping Cart',
  description: 'View and manage items in your shopping cart',
});
</script>

<template>
  <main class="container my-16 min-h-150 items-center flex flex-col">
    <ClientOnly>
      <div v-if="cart && !cart.isEmpty" class="grid lg:grid-cols-3 gap-8 lg:gap-12 w-full">
        <!-- Cart Items -->
        <div class="lg:col-span-2">
          <ul class="flex flex-col gap-4">
            <CartCard v-for="item in cart.contents?.nodes" :key="item.key" :item />
          </ul>
        </div>

        <!-- Order Summary Sidebar -->
        <div class="lg:col-span-1">
          <div class="sticky top-24 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">{{ $t('shop.orderSummary') }}</h2>

            <div class="space-y-3 mb-6">
              <div class="flex justify-between text-gray-700 dark:text-gray-300">
                <span>{{ $t('shop.subtotal') }}</span>
                <span class="font-medium tabular-nums" v-html="cart.subtotal" />
              </div>

              <div v-if="cart.shippingTotal" class="flex justify-between text-gray-700 dark:text-gray-300">
                <span>{{ $t('general.shipping') }}</span>
                <span class="font-medium tabular-nums"> {{ parseFloat(cart.shippingTotal) > 0 ? '+' : '' }} <span v-html="cart.shippingTotal"></span> </span>
              </div>

              <div v-if="cart.discountTotal && parseFloat(cart.rawDiscountTotal || '0') > 0" class="flex justify-between text-primary dark:text-primary-light">
                <span>{{ $t('shop.discount') }}</span>
                <span class="font-medium tabular-nums">- <span v-html="cart.discountTotal" /></span>
              </div>

              <div class="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between items-center">
                <span class="text-lg font-semibold text-gray-900 dark:text-white">{{ $t('shop.total') }}</span>
                <span class="text-2xl font-bold text-gray-900 dark:text-white tabular-nums" v-html="cart.total" />
              </div>
            </div>

            <Button
              :to="isCartUpdating ? undefined : '/checkout'"
              :disabled="isCartUpdating"
              :loading="isCartUpdating"
              class="w-full"
              size="lg"
              variant="primary">
              <span class="mx-2">{{ isCartUpdating ? $t('general.updating') : $t('shop.checkout') }}</span>
            </Button>
          </div>
        </div>
      </div>

      <!-- Empty Cart Message -->
      <EmptyCartMessage v-else-if="cart && cart.isEmpty" />

      <!-- Cart Loading -->
      <div v-else class="flex flex-col items-center justify-center min-h-100">
        <LoadingIcon />
      </div>
    </ClientOnly>
  </main>
</template>
