<template>
  <button class="cursor-pointer top-6 right-8 absolute" @click="EmptyCart" title="Empty Cart">
    <TrashIcon />
  </button>
</template>

<script>
import EMPTY_CART from "~/gql/mutations/EMPTY_CART";
export default {
  methods: {
    async EmptyCart() {
      const { emptyCart } = await this.$graphql.default.request(EMPTY_CART);
      if (emptyCart) {
        this.$store.commit("updateCart", emptyCart.cart);
      }
    },
  },
};
</script>
