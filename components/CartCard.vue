<template>
  <li class="flex gap-4 items-center relative" v-if="item">
    <NuxtImg
      class="rounded-xl h-16 w-16"
      v-if="productType.image"
      :src="productType.image.sourceUrl"
      :alt="productType.image.altText || productType.name"
      :title="productType.image.altText || productType.name"
    />
    <div class="flex-1">
      <div class="leading-tight">{{ productType.name }}</div>
      <ProductPrice
        class="mt-1 text-xs"
        :salePrice="productType.salePrice"
        :regularPrice="productType.regularPrice"
      />
    </div>
    <QuantityButtons :quantity="quantity" @quantity-change="updateQuantity" />
    <div
      class="bg-white flex bg-opacity-50 inset-0 absolute items-center justify-center"
      v-if="isLoading"
    >
      <LoadingIcon size="20" color="#8B5CF6" />
    </div>
  </li>
</template>

<script>
import updateCartQuantity from '~/gql/mutations/updateCartQuantity';
export default {
  data() {
    return {
      isLoading: false,
    };
  },
  props: ['item'],
  methods: {
    async updateQuantity(quantity) {
      if (!quantity) return;
      try {
        this.isLoading = true;
        const { updateItemQuantities } = await this.$graphql.default.request(
          updateCartQuantity,
          { key: this.item.key, quantity: parseInt(quantity || 0) }
        );
        this.$store.commit('updateCart', updateItemQuantities.cart);
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
    },
  },
  computed: {
    productType() {
      return this.item.variation
        ? this.item.variation?.node
        : this.item.product?.node;
    },
    quantity() {
      return this.item.quantity;
    },
    product() {
      return this.item.variation ? this.item.variation : this.item.product;
    },
  },
};
</script>
