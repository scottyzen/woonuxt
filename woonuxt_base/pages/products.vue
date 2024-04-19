<script setup lang="ts">
const { setProducts, updateProductList } = useProducts();
let temporaryProducts = [] as any[];

const fetchAllProducts = async (after = '') => {
  const { products } = await GqlGetProducts({ after });
  if (products?.nodes.length) temporaryProducts.push(...products.nodes);

  if (products?.pageInfo.hasNextPage) {
    const endCursor = products.pageInfo.endCursor;
    if (endCursor) await fetchAllProducts(endCursor);
  }

  return temporaryProducts;
};

const allProducts = await fetchAllProducts();
if (allProducts.length) setProducts(allProducts);

const { isQueryEmpty } = useHelpers();
onActivated(() => {
  if (!isQueryEmpty.value) updateProductList();
});

const route = useRoute();
watch(
  () => route.query,
  () => {
    if (route.name !== 'products') return;
    updateProductList();
  },
);

useHead({
  title: `Products`,
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
  <NoProductsFound v-else> Could not fecth products from your store. Please check your configuration.</NoProductsFound>
</template>
