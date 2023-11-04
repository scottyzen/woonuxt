<script setup>
const { setProducts, getAllProducts, updateProductList, products } = useProducts();
const { isQueryEmpty } = useHelpers();
const route = useRoute();
const categorySlug = route.params.slug;

const allProducts = await getAllProducts(categorySlug);
if (allProducts) setProducts(allProducts);

onMounted(() => {
  if (!isQueryEmpty.value) updateProductList();
});

useHead({
  title: 'Products - ' + categorySlug,
  meta: [{ hid: 'description', name: 'description', content: 'Products' }],
});
</script>

<template>
  <div class="container flex items-start gap-16">
    <Filters :hide-categories="true" />

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
