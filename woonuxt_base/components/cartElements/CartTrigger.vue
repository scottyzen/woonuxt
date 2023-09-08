<script setup>
const { toggleCart, cart } = useCart();
</script>

<template>
  <div class="cursor-pointer relative" title="Cart" @click="toggleCart">
    <Icon name="ion:cart-outline" size="20" class="mr-1 md:mr-0" />
    <ClientOnly>
      <Transition name="popIn" mode="out-in">
        <span
          v-if="cart?.contents?.itemCount > 0"
          class="bg-primary rounded-full text-white leading-none min-w-[16px] p-[3px] -top-1 -right-2 text-[10px] absolute inline-flex justify-center items-center"
          >{{ cart?.contents?.itemCount }}</span
        >
      </Transition>
    </ClientOnly>
  </div>
</template>

<style lang="postcss">
/* popIn */
.popIn-enter-active,
.popIn-leave-active {
  transition: all 200ms cubic-bezier(0, 0, 0.57, 1.61);
}

.popIn-enter-from,
.popIn-leave-to {
  transform: scale(0);
}
</style>
