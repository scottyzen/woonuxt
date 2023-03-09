<script setup>
const { cart, toggleCart, isUpdatingCart } = useCart();
</script>

<template>
  <div v-if="cart" class="bg-white flex flex-col max-w-lg shadow-lg top-0 right-0 bottom-0 w-9/10 z-50 fixed overflow-x-hidden">
    <CloseIcon class="bg-white rounded-xl shadow-xl p-1.5" @click="toggleCart(false)" />
    <EmptyCart v-if="!cart.isEmpty" class="rounded-xl shadow-xl p-1.5 hover:bg-red-400 hover:text-white" />

    <div class="mt-8 text-center">{{ $t('messages.shop.cart') }}</div>

    <ClientOnly>
      <template v-if="!cart.isEmpty">
        <ul class="flex flex-col flex-1 p-8 gap-4 overflow-y-scroll">
          <div v-for="item in cart.contents.nodes" :key="item.key" :item="item">
            <CartCard :item="item" />
          </div>
        </ul>

        <div class="mb-8 px-8">
          <NuxtLink
            class="rounded-xl bg-gray-800 shadow-md text-white text-lg text-center p-3 block justify-evenly hover:bg-gray-900"
            to="/checkout/">
            <span class="mx-2">{{ $t('messages.shop.checkout') }}</span>
            <span>{{ cart.total }}</span>
          </NuxtLink>
        </div>
      </template>

      <!-- Empty Cart Message -->
      <div v-else class="flex flex-col flex-1 mb-12 items-center justify-center">
        <div class="text-xl mb-20 text-gray-300">{{ $t('messages.shop.cartEmpty') }}</div>
      </div>
    </ClientOnly>

    <!-- Cart Loading Overlay -->
    <div v-if="isUpdatingCart" class="bg-white flex bg-opacity-25 inset-0 absolute items-center justify-center">
      <LoadingIcon />
    </div>
  </div>
</template>

<style scoped>
section {
  background: linear-gradient(#fff, #ececf1);
}

.shrink-move {
  transition: all 500ms;
}
</style>
