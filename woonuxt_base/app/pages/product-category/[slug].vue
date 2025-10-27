<script setup lang="ts">
const { setProducts, updateProductList } = useProducts();
const { isQueryEmpty } = useHelpers();
const { storeSettings } = useAppConfig();
const route = useRoute();
const slug = route.params.slug;

const { data } = await useAsyncGql('getProducts', { slug });
const productsInCategory = (data.value?.products?.nodes || []) as Product[];
const category = data.value?.productCategories?.nodes?.[0];

setProducts(productsInCategory);

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
  title: category?.name || 'Categorie',
  meta: [
    {
      hid: 'description',
      name: 'description',
      content: category?.description?.replace(/<[^>]+>/g, '').substring(0, 155) || '',
    },
  ],
});
</script>

<template>
  <div class="container flex flex-col gap-8">
    <!-- Breadcrumb + Title + Description -->
    <div class="mt-8">
      <nav class="text-sm text-gray-500 mb-4">
        <NuxtLink to="/" class="hover:underline">Home</NuxtLink>
        <span class="mx-2">/</span>
        <NuxtLink to="/dames" class="hover:underline">Dames</NuxtLink>
        <span class="mx-2">/</span>
        <span class="text-gray-700 font-medium">{{ category?.name }}</span>
      </nav>

      <h1 class="text-2xl font-semibold text-gray-800">{{ category?.name }}</h1>

      <div class="text-gray-600 mt-2" v-html="category?.description" />
    </div>

    <!-- Filters + Product Grid -->
    <div class="flex items-start gap-16" v-if="productsInCategory.length">
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
