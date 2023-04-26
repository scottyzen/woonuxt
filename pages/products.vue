<script setup>
const { setProducts, updateProductList } = await useProducts();
const { data } = await useAsyncGql('getProducts');
const products = data.value?.products?.nodes || [];
setProducts(products || []);

onMounted(() => {
  updateProductList();
});

useHead({
  title: 'Products',
  meta: [{ hid: 'description', name: 'description', content: 'Products' }],
});
</script>

<template>
  <div class="container flex items-start gap-16">
    <Filters />

    <div class="w-full">
      <div class="flex items-center justify-between w-full gap-8 mt-8">
        <ShowFilterTrigger class="md:hidden" />
        <ProductSearch />
        <OrderByDropdown class="hidden md:inline-flex" />
      </div>
      <ProductGrid />
    </div>
  </div>
</template>
