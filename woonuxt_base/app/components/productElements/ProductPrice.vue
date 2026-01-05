<script setup lang="ts">
interface ProductPriceProps {
  regularPrice?: string | null;
  salePrice?: string | null;
}

const { regularPrice, salePrice } = defineProps<ProductPriceProps>();
</script>

<template>
  <div v-if="regularPrice" class="flex font-semibold dark:text-gray-100">
    <span :class="{ 'text-gray-400 dark:text-gray-500 line-through font-normal': salePrice }" v-html="regularPrice" />
    <span v-if="salePrice" class="ml-2" v-html="salePrice" />
  </div>
</template>
