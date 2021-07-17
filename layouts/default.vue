<template>
  <div>
    <Header />
    <transition name="slide">
      <Cart v-if="showCart" class="z-50" />
    </transition>
    <transition name="page" mode="out-in">
      <Nuxt />
    </transition>
    <transition name="page">
      <div
        v-if="showCart"
        class="fixed inset-0 bg-black opacity-25"
        @click="closeCart"
      ></div>
    </transition>
  </div>
</template>

<script>
export default {
  computed: {
    showCart() {
      return this.$store.state.showCart
    },
  },
  methods: {
    closeCart() {
      this.$store.commit('toggleCart', false)
    },
  },
}
</script>

<style lang="postcss">
.page-enter-active,
.page-leave-active {
  transition: opacity 300ms ease-in-out;
}
.page-enter,
.page-leave-active {
  opacity: 0;
}
body {
  @apply bg-gray-50;
}

/* Enter and leave animations can use different */
/* durations and timing functions.              */
.slide-leave-active,
.slide-enter-active {
  transition: transform 400ms ease-in-out;
}
.slide-enter,
.slide-leave-to {
  transform: translateX(500px);
}
</style>
