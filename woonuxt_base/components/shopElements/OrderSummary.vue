<script setup>
const { cart, isUpdatingCart } = useCart();
</script>

<template>
  <aside class="bg-white rounded-lg shadow-lg mb-8 w-full min-h-[250px] p-8 relative md:max-w-sm md:top-32 md:sticky">
    <h2 class="mb-4 text-xl font-semibold">{{ $t('messages.shop.orderSummary') }}</h2>

    <ul class="flex flex-col gap-4 overflow-y-scroll">
      <CartCard v-for="item in cart.contents.nodes" :key="item.key" :item="item" />
    </ul>

    <AddCoupon class="my-8" />

    <div class="grid gap-1 text-sm font-semibold text-gray-500">
      <div class="flex justify-between">
        <span>{{ $t('messages.shop.subtotal') }}</span
        ><spa class="text-gray-700 tabular-nums" v-html="cart.subtotal" />
      </div>
      <div class="flex justify-between">
        <span>{{ $t('messages.general.shipping') }}</span
        ><span class="text-gray-700 tabular-nums">+ <span v-html="cart.shippingTotal" /></span>
      </div>
      <Transition name="scale-y" mode="out-in">
        <div v-if="cart && cart.appliedCoupons" class="flex justify-between">
          <span>{{ $t('messages.shop.discount') }}</span
          ><span class="text-primary tabular-nums">- <span v-html="cart.discountTotal" /></span>
        </div>
      </Transition>
      <div class="flex justify-between mt-4">
        <span>{{ $t('messages.shop.total') }}</span
        ><span class="text-lg font-bold text-gray-700 tabular-nums" v-html="cart.total" />
      </div>
    </div>

    <slot></slot>

    <div v-if="isUpdatingCart" class="bg-white flex bg-opacity-50 inset-0 absolute justify-center items-center">
      <LoadingIcon />
    </div>
  </aside>
</template>
