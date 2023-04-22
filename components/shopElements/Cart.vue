<script setup>
const { cart, toggleCart, isUpdatingCart } = useCart();
</script>

<template>
  <div v-if="cart" class="fixed top-0 bottom-0 right-0 z-50 flex flex-col w-9/12 max-w-lg overflow-x-hidden bg-white shadow-lg">
    <CloseIcon class="bg-white rounded-xl shadow-xl p-1.5" @click="toggleCart(false)" />
    <EmptyCart v-if="!cart.isEmpty" class="rounded-xl shadow-xl p-1.5 hover:bg-red-400 hover:text-white" />

    <div class="mt-8 text-center">{{ $t('messages.shop.cart') }}</div>

    <ClientOnly>
      <template v-if="!cart.isEmpty">
        <ul class="flex flex-col flex-1 gap-4 p-8 overflow-y-scroll">
          <div v-for="item in cart.contents.nodes" :key="item.key" :item="item">
            <CartCard :item="item" />
          </div>
        </ul>

        <div class="px-8 mb-8">
          <NuxtLink class="block p-3 text-lg text-center text-white bg-gray-800 shadow-md rounded-xl justify-evenly hover:bg-gray-900" to="/checkout/">
            <span class="mx-2">{{ $t('messages.shop.checkout') }}</span>
            <span v-html="cart.total" />
          </NuxtLink>
        </div>
      </template>

      <!-- Empty Cart Message -->
      <div v-else class="flex flex-col items-center justify-center flex-1 mb-12">
        <div class="mb-20 text-xl text-gray-300">{{ $t('messages.shop.cartEmpty') }}</div>
      </div>
    </ClientOnly>

    <!-- Cart Loading Overlay -->
    <div v-if="isUpdatingCart" class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-25">
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
