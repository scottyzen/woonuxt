<script setup>
const { updateItemQuantity, isUpdatingCart } = useCart();
const { formatURI } = useHelpers();
const props = defineProps({
  item: { type: Object, required: true },
});
const productType = computed(() => (props.item.variation ? props.item.variation?.node : props.item.product?.node));
const quantity = ref(props.item.quantity);
const productSlug = computed(() => `/product/${formatURI(props.item.product.node.slug)}`);

const updateQuantity = () => {
  updateItemQuantity(props.item.key, quantity.value);
};

const removeItem = () => {
  updateItemQuantity(props.item.key, 0);
};
</script>

<template>
  <SwipeCard @remove="removeItem">
    <div v-if="productType" class="flex items-center gap-3">
      <NuxtLink :to="productSlug">
        <img
          v-if="productType.image"
          width="64"
          height="64"
          class="w-16 h-16 rounded-md skeleton"
          :src="productType.image.cartSourceUrl || productType.image.sourceUrl || item.product.image.sourceUrl"
          :alt="productType.image?.altText || productType.name"
          :title="productType.image?.title || productType.name"
          loading="lazy" />
        <NuxtImg
          v-else
          src="/images/placeholder.jpg"
          width="64"
          height="64"
          class="w-16 h-16 rounded-md skeleton"
          :alt="productType.image?.altText || productType.name"
          :title="productType.image?.title || productType.name"
          loading="lazy" />
      </NuxtLink>
      <div class="flex-1">
        <NuxtLink class="leading-tight" :to="productSlug">{{ productType.name }}</NuxtLink>
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
      <button title="Remove Item" aria-label="Remove Item" @click="removeItem" type="button">
        <Icon name="ion:close-outline" class="removeItem hover:text-red-500 cursor-pointer p-1.5" size="34" />
      </button>
    </div>
  </SwipeCard>
</template>

<style scoped lang="postcss">
/* alwsys show up and down buttons on number inpout */
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  opacity: 1;
}

.removeItem {
  @apply hidden md:inline-block;
}
</style>
