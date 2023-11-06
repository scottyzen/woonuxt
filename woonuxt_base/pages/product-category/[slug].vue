<script setup>
const { setProducts, updateProductList, products } = useProducts();
const { isQueryEmpty } = useHelpers();
const route = useRoute();
const slug = route.params.slug;

const { data } = await useAsyncGql('getProducts', { slug });
setProducts(data.value?.products?.nodes || []);

onMounted(() => {
  if (!isQueryEmpty.value) updateProductList();
});

useHead({
  title: 'Products',
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
