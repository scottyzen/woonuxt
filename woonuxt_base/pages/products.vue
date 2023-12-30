<script setup>
const { setProducts, updateProductList } = useProducts();
const route = useRoute();

let { isQueryEmpty, productsPerPage } = useHelpers();

const pageNumber = route.params?.pageNumber_0 ?? "";
const { data } = await useAsyncGql('getProducts', { after: pageNumber, first: productsPerPage });
const storedPageId = localStorage.getItem('pageId');
let pageId;

try {
  // Attempt to parse the stored value as JSON
  pageId = JSON.parse(storedPageId) || [];
} catch (error) {
  // If parsing fails, set pageId to an empty array
  pageId = [];
}

const afterPageId = data.value?.products?.pageInfo?.endCursor ?? "";
if (pageId) {
  pageId.push(afterPageId);
  localStorage.setItem('pageId', JSON.stringify(pageId));
} else {  
  localStorage.setItem('pageId', JSON.stringify([afterPageId]));
}
localStorage.setItem('hasnextpage', data._value.products.pageInfo.hasNextPage);

const allProducts = data.value?.products?.nodes ?? [];
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
  <div class="container flex items-start gap-16">
    <Filters />

    <div class="w-full">
      <div class="flex items-center justify-between w-full gap-4 mt-8 md:gap-8">
        <ProductResultCount />
        <OrderByDropdown class="hidden md:inline-flex" />
        <LazyShowFilterTrigger class="md:hidden" />
      </div>
      <ProductGrid />
      <NoProductsFound />
    </div>
  </div>
</template>