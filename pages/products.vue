<script setup>
const { updateProductList, fetchAllProducts } = await useProducts();
await fetchAllProducts();

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
      <div class="flex items-center justify-between w-full gap-4 mt-8 md:gap-8">
        <ProductResultCount />
        <!-- <ProductSearch /> -->
        <OrderByDropdown />
        <ShowFilterTrigger class="md:hidden" />
        <!-- <OrderByDropdown class="hidden md:inline-flex" /> -->
      </div>
      <ProductGrid />
    </div>
  </div>
</template>
