<script setup>
const { setProducts, updateProductList, getAllProducts, products } = useProducts();
const isDev = process.env.NODE_ENV === 'development';
const isServer = process.server;

if (isDev || isServer) {
  const allProducts = await getAllProducts();
  console.log('Number of Products: ', allProducts.length);
  if (allProducts.length) setProducts(allProducts);
}

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
        <OrderByDropdown class="hidden md:inline-flex" />
        <ShowFilterTrigger class="md:hidden" />
      </div>
      <Transition name="fade" mode="out-in">
        <ProductGrid v-if="products.length" />
        <NoProductsFound v-else />
      </Transition>
    </div>
  </div>
</template>
