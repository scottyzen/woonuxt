<script setup>
const { cart, toggleCart, isUpdatingCart, isUpdatingCoupon, applyCoupon } = useCart();
</script>

<template>
  <aside
    class="bg-white rounded-lg shadow-lg mt-8 mb-8 w-full min-h-[250px] p-8 relative md:max-w-sm md:top-32 md:sticky">
    <h2 class="font-semibold text-xl mb-4">{{ $t('messages.shop.orderSummary') }}</h2>

    <ClientOnly>
      <template v-if="!cart.isEmpty">
        <ul class="flex flex-col gap-4 overflow-y-scroll">
          <div v-for="item in cart.contents.nodes" :key="item.key" :item="item">
            <CartCard :item="item" />
          </div>
        </ul>
      </template>
    </ClientOnly>

    <AddCoupon class="my-8" />

    <div v-if="cart" class="font-semibold text-sm grid text-gray-500 gap-1">
      <div class="flex justify-between">
        <span>{{ $t('messages.shop.subtotal') }}</span><spa class="text-gray-700 tabular-nums">{{ cart.subtotal }}</spa>
      </div>
      <div class="flex justify-between">
        <span>{{ $t('messages.general.shipping') }}</span><span class="text-gray-700 tabular-nums">+ {{ cart.shippingTotal }}</span>
      </div>
      <Transition name="scale-y" mode="out-in">
        <div v-if="cart && cart.appliedCoupons" class="flex justify-between">
          <span>{{ $t('messages.shop.discount') }}</span><span class="text-primary tabular-nums">- {{ cart.discountTotal }}</span>
        </div>
      </Transition>
      <div class="flex mt-4 justify-between">
        <span>{{ $t('messages.shop.total') }}</span><span class="font-bold text-lg text-gray-700 tabular-nums">{{ cart.total }}</span>
      </div>
    </div>

    <slot></slot>
  </aside>
</template>
