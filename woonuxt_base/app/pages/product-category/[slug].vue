<script setup lang="ts">
const { setProducts, updateProductList } = useProducts();
const { isQueryEmpty } = useHelpers();
const { storeSettings } = useAppConfig();
const route = useRoute();
const slug = route.params.slug;

const { data } = await useAsyncGql('getProducts', { slug });

// ✅ Haal producten op
const productsInCategory = (data.value?.products?.nodes || []) as Product[];
setProducts(productsInCategory);

// ✅ Haal categorienaam op van eerste product
const category = data.value?.products?.nodes?.[0]?.categories?.nodes?.[0] || {
  name: 'Categorie',
  description: '',
};

onMounted(() => {
  if (!isQueryEmpty.value) updateProductList();
});

watch(
  () => route.query,
  () => {
    if (route.name !== 'product-category-slug') return;
    updateProductList();
  },
);

useHead({
  title: category.name,
});
</script>

<template>
  <div>
    <!-- ✅ Toon categorienaam -->
    <div class="container py-8">
      <h1 class="text-3xl font-bold">{{ category.name }}</h1>
    </div>

    <!-- WooNuxt standaard layout -->
    <div class="container flex items-start gap-16" v-if="productsInCategory.length">
      <Filters v-if="storeSettings.showFilters" :hide-categories="true" />
      <div class="w-full">
        <div class="flex items-center justify-between w-full gap-4 mt-8 md:gap-8">
          <ProductResultCount />
          <OrderByDropdown class="hidden md:inline-flex" v-if="storeSettings.showOrderByDropdown" />
          <ShowFilterTrigger v-if="storeSettings.showFilters" class="md:hidden" />
        </div>
        <ProductGrid />
      </div>
    </div>
  </div>
</template>
