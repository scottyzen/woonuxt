<script setup lang="ts">
import { computed } from 'vue';
import { useProducts } from '../stores/products';
import { useRoute } from 'vue-router';
import { useAppConfig } from '../stores/appConfig';
import { useHelpers } from '../composables/helpers';
import { useAsyncGql } from '../composables/useAsyncGql';

const { setProducts, updateProductList } = useProducts();
const route = useRoute();
const { storeSettings } = useAppConfig();
const { isQueryEmpty } = useHelpers();

const { orderby, order } = route.query;

const filter = computed(() => {
  const filterParams = {};
  Object.entries(route.query).forEach(([key, value]) => {
    if (key.startsWith('filter_')) {
      const filterKey = key.replace('filter_', '');
      filterParams[filterKey] = value;
    }
  });
  return filterParams;
});

const { data: productData } = await useAsyncGql('getProducts', { 
  first: 24, 
  orderby: orderby || 'DATE',
  order: order || 'DESC',
  where: { 
    ...filter.value
  } 
});

const products = computed(() => productData.value?.products?.nodes || []);
const pageInfo = computed(() => productData.value?.products?.pageInfo || {});

setProducts(products);

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
  title: `Products`,
  meta: [{ hid: 'description', name: 'description', content: 'Products' }],
});
</script>

<template>
  <div class="container flex items-start gap-16" v-if="products.length">
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
