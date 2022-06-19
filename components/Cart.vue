<template>
  <section class="bg-white flex flex-col max-w-lg shadow-lg top-0 right-0 bottom-0 w-9/10 fixed overflow-x-hidden" v-if="cart">
    <CloseModals class="bg-white rounded-xl shadow-xl p-1.5" />
    <EmptyCart v-if="cart && !cart.isEmpty" class="rounded-xl shadow-xl p-1.5 hover:bg-red-400 hover:text-white" />

    <div class="mt-8 text-center">Cart</div>

    <template v-if="cart && !cart.isEmpty">
      <ul class="flex flex-col flex-1 p-8 gap-4 overflow-y-scroll">
        <SwipeCard v-for="item in cart.contents.nodes" :key="item.key" :item="item" @has-swiped="removeItemFromCart(item.key)">
          <LazyCartCard :item="item" />
        </SwipeCard>
      </ul>

      <ShippingOptions
        :options="cart.availableShippingMethods[0].rates"
        :active-option="cart.chosenShippingMethods[0]"
        class="mb-4 px-8"
        @setActiveOption="setActiveOption"
      />

      <div class="mb-8 px-8">
        <NuxtLink class="bg-primary rounded-2xl shadow-md text-white text-lg text-center p-3 block justify-evenly hover:bg-primary-dark" to="/checkout">
          <span class="mx-2">Checkout</span>
          <span>{{ cart.total }}</span>
        </NuxtLink>
      </div>
    </template>

    <!-- Empty Cart Message -->
    <div v-else class="flex flex-col flex-1 mb-12 items-center justify-center">
      <div class="text-xl mb-20 text-gray-300">Cart is empty</div>
    </div>
  </section>
</template>

<script>
import UPDATE_CART_QUANTITY from "~/gql/mutations/updateCartQuantity";
import CHANGE_SHIPPING_METHOD from "~/gql/mutations/changeShippingMethod";
export default {
  methods: {
    closeCart() {
      this.$store.commit("toggleCart", false);
    },
    async removeItemFromCart(key) {
      const { updateItemQuantities } = await this.$graphql.default.request(UPDATE_CART_QUANTITY, { key, quantity: 0 });
      this.$store.commit("updateCart", updateItemQuantities.cart);
    },
    async setActiveOption(id) {
      const { updateShippingMethod } = await this.$graphql.default.request(CHANGE_SHIPPING_METHOD, { shippingMethods: id });
      this.$store.commit("updateCart", updateShippingMethod.cart);
    },
  },
  computed: {
    cart() {
      return this.$store.state.cart;
    },
  },
};
</script>

<style scoped>
section {
  background: linear-gradient(#fff, #ececf1);
}
.shrink-move {
  transition: all 500ms;
}
</style>
