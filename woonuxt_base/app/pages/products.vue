<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useProducts } from '../composables/useProducts';
import { useRoute } from 'vue-router';
import { useAppConfig } from '../composables/useAppConfig';
import { useHelpers } from '../composables/useHelpers';
import { useAsyncGql } from '../composables/useAsyncGql';
import { useHead } from 'vue-head';

const { t } = useI18n();
const { setProducts, updateProductList, products, productsLoading, error } = useProducts();
const route = useRoute();
const { storeSettings } = useAppConfig();
const { isQueryEmpty } = useHelpers();

const { data } = await useAsyncGql('getProducts');
const allProducts = (data.value?.products?.nodes || []) as Product[];
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

// Add safety checks for computed values
const hasProducts = computed(() => {
  return products.value?.nodes?.length > 0;
});

// Ensure proper error and loading states
const pageState = computed(() => {
  if (error.value) return 'error';
  if (productsLoading.value) return 'loading';
  if (!hasProducts.value) return 'empty';
  return 'ready';
});

useHead({
  title: `Products`,
  meta: [{ hid: 'description', name: 'description', content: 'Products' }],
});
</script>

<template>
  <div class="container">
    <div v-if="pageState === 'error'" class="text-center py-12">
      <p class="text-red-500">{{ error }}</p>
    </div>

    <div v-else-if="pageState === 'loading'" class="text-center py-12">
      <LoadingIcon />
    </div>

    <div v-else-if="pageState === 'empty'" class="text-center py-12">
      <p>{{ t('messages.products.noProducts') }}</p>
    </div>

    <div v-else class="grid gap-8 my-8 md:grid-cols-3 lg:grid-cols-4">
      <ProductCard 
        v-for="product in products?.nodes" 
        :key="product.databaseId" 
        :product="product"
      />
    </div>
  </div>
</template>
