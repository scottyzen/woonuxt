<script setup lang="ts">
const route = useRoute();
const { products } = useProducts();
const { productsPerPage } = useHelpers();
const page = ref(parseInt(route.params.pageNumber as string) || 1);
</script>

<template>
  <span class="text-sm font-light">
    <span>Showing </span>
    <span v-if="products.length === 0" class="font-normal">No products</span>
    <template v-else>
      <span class="font-normal"> {{ (page - 1) * productsPerPage + 1 }} </span>
      <span> to </span>
      <span class="font-normal">{{ Math.min(page * productsPerPage, products.length) }} </span>
      <span> of </span>
      <span class="font-normal"> {{ products.length }} </span>
    </template>
  </span>
</template>
