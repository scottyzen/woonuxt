<script setup>
const { toggleCart, cart } = useCart();
</script>

<template>
  <div 
    class="relative cursor-pointer inline-flex items-center justify-center p-1.5 rounded-full hover:bg-blue-50 transition-all duration-300 group" 
    title="Cart" 
    @click="toggleCart"
  >
    <Icon 
      name="ion:cart-outline" 
      size="22" 
      class="mr-1 md:mr-0 text-gray-700 group-hover:text-blue-600 transition-colors duration-300 transform group-hover:scale-110" 
    />
    <ClientOnly>
      <Transition name="popIn" mode="out-in">
        <span
          v-if="cart?.contents?.itemCount > 0"
          class="bg-blue-600 shadow-sm rounded-full text-white leading-none min-w-[18px] h-[18px] p-[3px] -top-1 -right-1 md:-right-2 text-[10px] absolute inline-flex justify-center items-center font-bold">
          {{ cart?.contents?.itemCount }}
        </span>
      </Transition>
    </ClientOnly>
    <span class="sr-only">Cart</span>
  </div>
</template>

<style lang="postcss">
/* popIn */
.popIn-enter-active,
.popIn-leave-active {
  transition: all 300ms cubic-bezier(0, 0, 0.57, 1.61);
}

.popIn-enter-from,
.popIn-leave-to {
  transform: scale(0);
  opacity: 0;
}

.popIn-enter-to,
.popIn-leave-from {
  transform: scale(1);
  opacity: 1;
}
</style>
