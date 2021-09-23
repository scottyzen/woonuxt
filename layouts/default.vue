<template>
  <div>
    <div class="text-xs text-white bg-gray-600">
      <div class="container flex justify-between py-1.5">
        <div>NEXT DAY DELIVERY</div>
        <nuxt-link to="/login" v-if="!this.$auth.loggedIn"> LOGIN / SIGN UP </nuxt-link>
        <div @click="logOut" v-else>LOGOUT</div>
      </div>
    </div>
    <Header />
    <transition name="slide">
      <Cart v-if="showCart" class="z-50" />
    </transition>
    <transition name="page" mode="out-in">
      <Nuxt />
    </transition>
    <transition name="page">
      <div v-if="showCart" class="fixed inset-0 bg-black opacity-25" @click="closeCart"></div>
    </transition>
    <Footer />
  </div>
</template>

<script>
export default {
  computed: {
    showCart() {
      return this.$store.state.showCart;
    },
  },
  methods: {
    closeCart() {
      this.$store.commit("toggleCart", false);
    },
    async logOut() {
      const data = await this.$auth.logout();
      console.log(data);
    },
  },
};
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
