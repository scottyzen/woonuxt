<script setup>
const { toggleCart, cart } = useCart();
// Watch for a check in cart count and add an animation to show when the count had increased
watch(
  () => cart.value?.contents?.itemCount ?? 0,
  (newCount, oldCount) => {
    if (newCount > oldCount) {
      const trigger = document.querySelector('.cart-trigger');
      const badge = trigger?.querySelector('.cart-badge');
      if (badge) {
        badge.classList.add('animate-popIn');
        setTimeout(() => badge.classList.remove('animate-popIn'), 300);
      }
    }
  },
);
</script>

<template>
  <div class="cart-trigger relative cursor-pointer inline-flex" title="Cart" @click="toggleCart">
    <Icon name="ion:cart-outline" size="22" class="mr-1 md:mr-0" />
    <ClientOnly>
      <Transition name="popIn" mode="out-in">
        <span
          v-if="cart?.contents?.itemCount > 0"
          class="cart-badge bg-primary rounded-full text-white leading-none min-w-4 p-0.75 -top-1 -right-1 md:-right-2 text-[10px] absolute inline-flex justify-center items-center tabular-nums">
          {{ cart?.contents?.itemCount }}
        </span>
      </Transition>
    </ClientOnly>
  </div>
</template>

<style>
/* popIn */
.popIn-enter-active,
.popIn-leave-active {
  transition: all 200ms cubic-bezier(0, 0, 0.57, 1.61);
}

.popIn-enter-from,
.popIn-leave-to {
  transform: scale(0);
}

/* Additional animation for the cart badge when count increases */
.cart-badge.animate-popIn {
  animation: cartPop 250ms cubic-bezier(0.2, 0.9, 0.3, 1.3);
}

@keyframes cartPop {
  50% {
    transform: scale(1.25);
  }
  100% {
    background-color: var(--color-primary-dark);
  }
}
</style>
