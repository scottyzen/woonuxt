<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useProducts } from '../composables/useProducts';
import { useRoute } from 'vue-router';
import { useAppConfig } from '../composables/useAppConfig';
import { useHelpers } from '../composables/useHelpers';
import { useAsyncGql } from '../composables/useAsyncGql';
import { useHead } from 'unhead';
import { onMounted, nextTick, computed } from 'vue';

const { setProducts, updateProductList, products, productsLoading, error } = useProducts();
const route = useRoute();
const { storeSettings } = useAppConfig();
const { isQueryEmpty } = useHelpers();
const { t } = useI18n();

const { data } = await useAsyncGql('getProducts');
const allProducts = (data.value?.products?.nodes || []) as Product[];
setProducts(allProducts);

// Add loading state management
const isInitialLoad = ref(true);

onMounted(() => {
  if (!isQueryEmpty.value) updateProductList();
  // Remove initial load state after first render
  nextTick(() => {
    setTimeout(() => {
      isInitialLoad.value = false;
    }, 100);
  });
});

watch(
  () => route.query,
  () => {
    if (route.name !== 'products') return;
    updateProductList();
  },
);

// Computed state with loading optimization
const pageState = computed(() => {
  if (isInitialLoad.value && productsLoading.value) return 'initial-loading';
  if (error.value) return 'error';
  if (!products.value?.nodes?.length) return 'empty';
  return 'ready';
});

useHead({
  title: `Products`,
  meta: [{ hid: 'description', name: 'description', content: 'Products' }],
});
</script>

<template>
  <div class="container flex items-start gap-16" v-if="allProducts.length">
    <Filters v-if="storeSettings.showFilters" />

    <div class="w-full">
      <div class="flex items-center justify-between w-full gap-4 mt-8 md:gap-8">
        <ProductResultCount />
        <OrderByDropdown class="hidden md:inline-flex" v-if="storeSettings.showOrderByDropdown" />
        <ShowFilterTrigger v-if="storeSettings.showFilters" class="md:hidden" />
      </div>
      <ProductGrid />
    </div>
  </div>
  <NoProductsFound v-else>Could not fetch products from your store. Please check your configuration.</NoProductsFound>
</template>
