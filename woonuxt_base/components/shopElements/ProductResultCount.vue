<script setup lang="ts">
const route = useRoute();
const { products } = useProducts();
const runtimeConfig = useRuntimeConfig();
const productsPerPage = runtimeConfig.public.PRODUCTS_PER_PAGE || 24;
const page = ref(parseInt(route.params.pageNumber as string) || 1);

// Showing 1 to 12 of 38 products
</script>

<template>
  <span class="text-sm font-light">
    <span>Showing </span>
    <span class="font-normal"> {{ (page - 1) * productsPerPage + 1 }} </span>
    <span> to </span>
    <span class="font-normal">{{ Math.min(page * productsPerPage, products.length) }} </span>
    <span> of </span>
    <span class="font-normal"> {{ products.length }} </span>
  </span>
</template>
