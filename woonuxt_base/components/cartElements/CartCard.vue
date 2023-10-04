<script setup>
const { updateItemQuantity, isUpdatingCart } = useCart();
const props = defineProps({
  item: { type: Object, required: true },
});
const productType = computed(() => (props.item.variation ? props.item.variation?.node : props.item.product?.node));
const quantity = ref(props.item.quantity);

const updateQuantity = () => {
  updateItemQuantity(props.item.key, quantity.value);
};
</script>

<template>
  <li v-if="item" class="flex items-center gap-4">
    <NuxtLink :to="`/product/${props.item.product.node.slug}`">
      <img
        v-if="productType.image"
        width="64"
        height="64"
        class="w-16 h-16 rounded-md"
        :src="productType.image.cartSourceUrl || productType.image.sourceUrl || item.product.image.sourceUrl"
        :alt="productType.image?.altText || productType.name"
        :title="productType.image?.title || productType.name"
        loading="lazy" />
      <img
        v-else
        src="/images/placeholder.jpg"
        width="64"
        height="64"
        class="w-16 h-16 rounded-md"
        :alt="productType.image?.altText || productType.name"
        :title="productType.image?.title || productType.name"
        loading="lazy" />
    </NuxtLink>
    <div class="flex-1">
      <NuxtLink class="leading-tight" :to="`/product/${props.item.product.node.slug}`">{{ productType.name }}</NuxtLink>
      <ProductPrice class="mt-1 text-xs" :sale-price="productType.salePrice" :regular-price="productType.regularPrice" />
    </div>
    <input
      v-model.number="quantity"
      type="number"
      min="0"
      aria-label="Quantity"
      class="flex items-center justify-center w-16 gap-4 p-2 text-left bg-white border rounded-md focus:outline-none"
      :disabled="isUpdatingCart"
      @input="updateQuantity" />
  </li>
</template>

<style scoped>
/* alwsys show up and down buttons on number inpout */
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  opacity: 1;
}
</style>
