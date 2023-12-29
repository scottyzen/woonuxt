<script setup>
const { setProducts, updateProductList } = useProducts();
const route = useRoute();

const { isQueryEmpty } = useHelpers();
const pageSize = 25;
let afterProduct = "0";
const productsRef = ref([{ data: '0' }]);
setProducts(productsRef.value);
async function datagrab(afterProductId) {
  try {
    console.log(productsRef.value[0].data)

    const updatedData = await useAsyncGql('getProducts', { first: 24, after: afterProductId })
    const updatedProducts = updatedData.data._value.products.nodes

    if (productsRef.value[0].data) {
      console.log('test 1')
      productsRef.value = updatedProducts;
    } else {
      console.log('test 2')
      productsRef.value = [...productsRef.value, ...updatedProducts];
    }

    afterProduct = updatedData.data._value.products.pageInfo.endCursor ?? [];
    setProducts(productsRef.value);
    console.log(updatedData)
  } catch (e) { console.log('error: ' + e.message) }
}

datagrab(afterProduct)
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
  <div class="container flex items-start gap-16">
    <Filters />

    <div class="w-full">
      <div class="flex items-center justify-between w-full gap-4 mt-8 md:gap-8">
        <ProductResultCount />
        <OrderByDropdown class="hidden md:inline-flex" />
        <button @click="datagrab(afterProduct)">Load more</button>
        <LazyShowFilterTrigger class="md:hidden" />
      </div>
      <ProductGrid />
      <NoProductsFound />
    </div>
  </div>
</template>
