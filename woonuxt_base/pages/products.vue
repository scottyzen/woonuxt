<script setup >

const { setProducts, updateProductList } = useProducts();
const route = useRoute();
const currentPage =  route.params.pageNumber_0 
const { isQueryEmpty } = useHelpers();
const runtimeConfig = useRuntimeConfig();
const page = route.params.pageNumber_0 || '1'
const  products = await useFetch('https://batinour.com/appjs/products',
 {
  params: {'page': page }
})

const allProducts = products.data?.value?? [];
console.log(products)
setProducts(allProducts);

onMounted(() => {
  if (!isQueryEmpty.value) updateProductList();
});

watch(
  () => route.query,
  () => {
    if (route.name !== 'products') return;
    updateProductList();
  },
);

useHead({
  title: 'Products',
  meta: [{ hid: 'description', name: 'description', content: 'Products' }],
});
</script>

<template>
  <div class="container flex items-start gap-16" v-if="allProducts.length">
    <Filters />

    <div class="w-full">
      <div class="flex items-center justify-between w-full gap-4 mt-8 md:gap-8">
        <ProductResultCount />
        <OrderByDropdown class="hidden md:inline-flex" />
        <LazyShowFilterTrigger class="md:hidden" />
      </div>
      <ProductGrid />
    </div>
  </div>
  <NoProductsFound v-else>Could not fecth products from your store. Please check your configuration.</NoProductsFound>
</template>