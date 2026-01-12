<script setup>
const { cart } = useCart();
const props = defineProps({
  disabled: { type: Boolean, default: false },
});
const isLoading = ref(false);
const { t } = useI18n();
const addToCartButtonText = computed(() => (isLoading.value ? t('shop.adding') : t('shop.addToCart')));

// stop loading when cart is updated
watch(cart, (val) => {
  isLoading.value = false;
});
</script>

<template>
  <button
    type="submit"
    class="rounded-lg flex font-bold bg-gray-800 dark:bg-gray-700 text-white text-center min-w-37.5 p-2.5 gap-4 items-center justify-center focus:outline-hidden disabled:cursor-not-allowed disabled:bg-gray-400 dark:disabled:bg-gray-600 hover:bg-gray-700 dark:hover:bg-gray-600"
    :disabled="props.disabled"
    @click="isLoading = true">
    <span>{{ addToCartButtonText }}</span>
    <LoadingIcon v-if="isLoading" stroke="4" size="12" color="#fff" />
  </button>
</template>

<style scoped>
button {
  outline: none !important;
  transition: all 150ms ease-in;
}
</style>
