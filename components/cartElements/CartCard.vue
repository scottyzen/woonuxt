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
  <li v-if="item" class="flex gap-4 items-center">
    <img
      v-if="productType.image"
      width="64"
      height="64"
      class="rounded-lg h-16 w-16"
      :src="productType.image.cartSourceUrl"
      :alt="productType.image.altText || productType.name"
      :title="productType.image.altText || productType.name"
      loading="lazy" />
    <div class="flex-1">
      <div class="leading-tight">{{ productType.name }}</div>
      <ProductPrice
        class="mt-1 text-xs"
        :sale-price="productType.salePrice"
        :regular-price="productType.regularPrice" />
    </div>
    <input
      v-model.number="quantity"
      type="number"
      min="0"
      aria-label="Quantity"
      class="bg-white border rounded-lg flex text-left p-2 w-16 gap-4 items-center justify-center focus:outline-none"
      :disabled="isUpdatingCart"
      @input="updateQuantity" />
  </li>
</template>
