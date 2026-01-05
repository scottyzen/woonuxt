<script setup>
const { cart, isUpdatingCart } = useCart();
</script>

<template>
  <aside
    v-if="cart"
    class="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900/50 mb-8 w-full min-h-[280px] p-4 sm:p-8 relative md:max-w-md md:top-32 md:sticky">
    <h2 class="mb-6 text-xl font-semibold leading-none dark:text-white">{{ $t('shop.orderSummary') }}</h2>

    <ul class="flex flex-col gap-4 overflow-y-auto">
      <CartCard v-for="item in cart.contents.nodes" :key="item.key" :item />
    </ul>

    <AddCoupon class="my-8" />

    <div class="grid gap-1 text-sm font-semibold text-gray-500 dark:text-gray-400">
      <div class="flex justify-between">
        <span>{{ $t('shop.subtotal') }}</span>
        <span class="text-gray-700 dark:text-gray-200 tabular-nums" v-html="cart.subtotal" />
      </div>
      <div class="flex justify-between">
        <span>{{ $t('general.shipping') }}</span>
        <span class="text-gray-700 dark:text-gray-200 tabular-nums">
          {{ parseFloat(cart.shippingTotal) > 0 ? '+' : '' }} <span v-html="cart.shippingTotal"></span>
        </span>
      </div>
      <Transition name="scale-y" mode="out-in">
        <div v-if="cart && cart.appliedCoupons" class="flex justify-between">
          <span>{{ $t('shop.discount') }}</span>
          <span class="text-primary tabular-nums">- <span v-html="cart.discountTotal" /></span>
        </div>
      </Transition>
      <div class="flex justify-between mt-4">
        <span>{{ $t('shop.total') }}</span>
        <span class="text-lg font-bold text-gray-700 dark:text-white tabular-nums" v-html="cart.total" />
      </div>
    </div>

    <slot></slot>

    <div v-if="isUpdatingCart" class="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-800 bg-opacity-50 dark:bg-opacity-50">
      <LoadingIcon />
    </div>
  </aside>
</template>
