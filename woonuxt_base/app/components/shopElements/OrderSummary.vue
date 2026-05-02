<script setup>
const { cart, isCartMutating } = useCart();
</script>

<template>
  <aside v-if="cart" class="order-summary bg-white rounded-lg mb-8 w-full min-h-70 p-4 sm:p-8 relative shadow-md outline-gray-950/10 outline">
    <h2 class="mb-6 text-xl font-semibold leading-none">{{ $t('shop.orderSummary') }}</h2>

    <ul class="flex flex-col gap-4 overflow-y-auto">
      <CartCard v-for="item in cart.contents.nodes" :key="item.key" :item />
    </ul>

    <AddCoupon class="my-8" />

    <div class="grid gap-1 text-sm font-semibold text-gray-500">
      <div class="flex justify-between">
        <span>{{ $t('shop.subtotal') }}</span>
        <span class="text-gray-800 tabular-nums" v-html="cart.subtotal"></span>
      </div>
      <div class="flex justify-between">
        <span>{{ $t('general.shipping') }}</span>
        <span class="text-gray-800 tabular-nums"> {{ parseFloat(cart.shippingTotal) > 0 ? '+' : '' }} <span v-html="cart.shippingTotal"></span> </span>
      </div>
      <Transition name="scale-y" mode="out-in">
        <div v-if="cart && cart.appliedCoupons" class="flex justify-between">
          <span>{{ $t('shop.discount') }}</span>
          <span class="text-primary tabular-nums">- <span v-html="cart.discountTotal"></span></span>
        </div>
      </Transition>
      <div class="flex justify-between mt-4 pt-2 border-t border-gray-200">
        <span class="text-base">{{ $t('shop.total') }}</span>
        <span class="text-xl font-bold text-gray-900 tabular-nums" v-html="cart.total"></span>
      </div>
    </div>

    <slot></slot>

    <div v-if="isCartMutating" class="absolute inset-0 flex items-center justify-center bg-white/50">
      <LoadingIcon />
    </div>
  </aside>
</template>

<style scoped>
@reference "#tailwind";

@container (min-width: 64rem) {
  .order-summary {
    @apply max-w-md sticky top-32;
  }
}
</style>
