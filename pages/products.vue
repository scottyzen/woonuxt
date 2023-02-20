<script setup>
const { setProducts } = await useProducts();
const { data } = await useAsyncGql('getProducts');
setProducts(data.value?.products?.nodes || []);

onMounted(async () => {
  const { isFiltersActive, filterProducts } = await useFiltering();
  const { isSearchActive, searchProducts } = await useSearching();
  const { isSortingActive, sortProducts } = await useSorting();

  if (isSearchActive.value) searchProducts();
  if (isFiltersActive.value) filterProducts();
  if (isSortingActive.value) sortProducts();
});

useHead({
  title: 'Products',
  meta: [{ hid: 'description', name: 'description', content: 'Products' }],
});
</script>

<template>
  <div class="container flex gap-16 items-start">
    <Filters />

    <div class="w-full">
      <div class="flex mt-8 w-full gap-8 items-center justify-between">
        <ShowFilterTrigger class="md:hidden" />
        <ProductSearch />
        <OrderByDropdown class="hidden md:inline-flex" />
      </div>
      <ProductGrid />
    </div>
  </div>
</template>
