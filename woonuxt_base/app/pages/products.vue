<script setup lang="ts">
import { useProducts } from "../composables/useProducts";
import { useRoute } from "vue-router";
import { useHelpers } from "../composables/useHelpers";
import { useAsyncGql } from "../composables/useAsyncGql";
import { useI18n } from "vue-i18n";

const { setProducts, updateProductList } = useProducts();
const route = useRoute();
const appConfig = useAppConfig();
const { isQueryEmpty } = useHelpers();
const { t } = useI18n();

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

useHead({
  title: `Products`,
  meta: [{ hid: 'description', name: 'description', content: 'Products' }],
});
</script>

<template>
  <div class="container flex items-start gap-16" v-if="allProducts.length">
    <Filters v-if="appConfig.showFilters" />

    <div class="w-full">
      <div class="flex items-center justify-between w-full gap-4 mt-8 md:gap-8">
        <ProductResultCount />
        <OrderByDropdown class="hidden md:inline-flex" v-if="appConfig.showOrderByDropdown" />
        <ShowFilterTrigger v-if="appConfig.showFilters" class="md:hidden" />
      </div>
      <ProductGrid />
    </div>
  </div>
  <NoProductsFound v-else>Could not fetch products from your store. Please check your configuration.</NoProductsFound>
</template>
