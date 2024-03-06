<template>
  <div class="flex rounded bg-white text-sm leading-none shadow-sm shadow-gray-200 isolate">
    <button
      title="Decrease Quantity"
      aria-label="Decrease Quantity"
      @click="decrementQuantity"
      type="button"
      class="focus:outline-none border-r w-6 h-6 border rounded-l border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed"
      :disabled="isUpdatingCart || quantity <= 1">
      <Icon name="ion:remove" size="14" />
    </button>
    <input
      v-model.number="quantity"
      type="number"
      min="0"
      :max="productType.stockQuantity"
      aria-label="Quantity"
      class="flex items-center justify-center w-8 px-2 text-right text-xs focus:outline-none border-y border-gray-300" />
    <button
      title="Increase Quantity"
      aria-label="Increase Quantity"
      @click="incrementQuantity"
      type="button"
      class="focus:outline-none border-l w-6 h-6 border rounded-r hover:bg-gray-50 border-gray-300 disabled:cursor-not-allowed disabled:bg-gray-100"
      :disabled="isUpdatingCart || hasNoMoreStock">
      <Icon name="ion:add" size="14" />
    </button>
  </div>
</template>

<script setup lang="ts">
const { updateItemQuantity, isUpdatingCart } = useCart();
const { debounce } = useHelpers();

const { item } = defineProps({ item: { type: Object, required: true } });

const productType = computed(() => (item.variation ? item.variation?.node : item.product?.node));
const quantity = ref(item.quantity);
const key = item.key;
const hasNoMoreStock = computed(() => (productType.value.stockQuantity ? productType.value.stockQuantity <= quantity.value : false));

const incrementQuantity = () => quantity.value++;
const decrementQuantity = () => quantity.value > 1 && quantity.value--;

watch(
  quantity,
  debounce(() => {
    updateItemQuantity(key, quantity.value);
  }, 250),
);
</script>

<style scoped lang="postcss">
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type='number'] {
  -moz-appearance: textfield;
  appearance: textfield;
}
</style>
