<script setup lang="ts">
interface ProductPriceProps {
  regularPrice?: string | null;
  salePrice?: string | null;
}

const { regularPrice, salePrice } = defineProps<ProductPriceProps>();
</script>

<template>
  <div v-if="regularPrice" class="flex font-semibold">
    <span :class="{ 'text-gray-400  line-through font-normal': salePrice }" v-html="regularPrice"></span>
    <span v-if="salePrice" class="ml-2" v-html="salePrice"></span>
  </div>
</template>
