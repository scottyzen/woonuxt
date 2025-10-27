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
  <div class="container">
    <!-- Grid: Sidebar + Main Content -->
    <div class="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-16 mt-8">
      <!-- Sidebar -->
      <aside class="order-2 md:order-1">
        <Filters v-if="storeSettings.showFilters" :hide-categories="true" />
      </aside>

      <!-- Main Content -->
      <section class="order-1 md:order-2 w-full">
        <!-- Breadcrumb -->
        <nav class="text-sm text-gray-500 mb-2">
          <NuxtLink to="/" class="hover:underline">Home</NuxtLink>
          <span class="mx-2">/</span>
          <NuxtLink to="/dames" class="hover:underline">Dames</NuxtLink>
          <span class="mx-2">/</span>
          <span class="text-gray-700 font-medium">{{ category?.name }}</span>
        </nav>

        <!-- Title -->
        <h1 class="text-2xl font-semibold text-gray-900 mb-2">{{ category?.name }}</h1>

        <!-- Description -->
        <div
          class="text-sm text-gray-700 leading-relaxed mb-6"
          v-html="category?.description"
        />

        <!-- Controls (orderby etc.) -->
        <div class="flex items-center justify-between w-full gap-4 mb-6 md:gap-8">
          <ProductResultCount />
          <OrderByDropdown class="hidden md:inline-flex" v-if="storeSettings.showOrderByDropdown" />
          <ShowFilterTrigger v-if="storeSettings.showFilters" class="md:hidden" />
        </div>

        <!-- Product Grid -->
        <ProductGrid />
      </section>
    </div>
  </div>
</template>
