<script setup lang="ts">
import type { Product } from '#types/gql';

const { setProducts, updateProductList } = useProducts();
const { isQueryEmpty } = useHelpers();
const { storeSettings } = useAppConfig();
const route = useRoute();
const slug = route.params.slug;

const { data, error, status } = await useAsyncGql('getProducts', { slug });
const productsInCategory = computed<Product[]>(() => (data.value?.products?.nodes ?? []) as Product[]);
const isLoading = computed<boolean>(() => status.value === 'idle' || status.value === 'pending');
const hasError = computed<boolean>(() => Boolean(error.value));

watchEffect(() => {
  setProducts(productsInCategory.value);
});

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
  title: 'Products',
  meta: [{ name: 'description', content: 'Products' }],
});
</script>

<template>
  <div v-if="isLoading" class="container flex items-center justify-center min-h-96">
    <LoadingIcon size="32" stroke="3" />
  </div>
  <div v-else-if="productsInCategory.length" class="container flex items-start gap-16">
    <Filters v-if="storeSettings.showFilters" :hide-categories="true" />

    <div class="w-full">
      <div class="flex items-center justify-between w-full gap-4 mt-8 md:gap-8">
        <ProductResultCount />
        <OrderByDropdown v-if="storeSettings.showOrderByDropdown" class="hidden md:inline-flex" />
        <ShowFilterTrigger v-if="storeSettings.showFilters" class="md:hidden" />
      </div>
      <ProductGrid />
    </div>
  </div>
  <NoProductsFound v-else-if="hasError">Products could not be loaded. Please refresh or try again in a moment.</NoProductsFound>
  <NoProductsFound v-else>No products found in this category. Please try adjusting your filters or check back later.</NoProductsFound>
</template>
