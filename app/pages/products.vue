<script setup lang="ts">
import type { Product } from '#types/gql';
import PlantProductGrid from '../components/shopElements/ProductGrid.vue';
const { setProducts, updateProductList } = useProducts();
const route = useRoute();
const { storeSettings } = useAppConfig();
const { data, error, status } = await useAsyncGql('getProducts');
const allProducts = computed<Product[]>(() => (data.value?.products?.nodes ?? []) as Product[]);
const isLoading = computed(() => status.value === 'idle' || status.value === 'pending');
const hasProducts = computed(() => allProducts.value.length > 0);
watchEffect(() => setProducts(allProducts.value));
onMounted(() => { if (Object.keys(route.query).length) updateProductList(); });
watch(() => route.query, () => { if (['products', 'product-page-pager'].includes(String(route.name))) updateProductList(); });
useHead({ title: 'Plants', meta: [{ name: 'description', content: 'Shop indoor plants' }] });
</script>

<template>
  <main class="bg-white"><div v-if="isLoading" class="container flex min-h-96 items-center justify-center"><LoadingIcon size="32" stroke="3" /></div><div v-else-if="hasProducts" class="container flex items-start gap-10 py-14"><Filters v-if="storeSettings.showFilters" class="hidden w-58 shrink-0 lg:block" /><div class="min-w-0 flex-1"><div class="mb-8 flex items-center justify-between gap-4"><ProductResultCount /><OrderByDropdown v-if="storeSettings.showOrderByDropdown" /><ShowFilterTrigger v-if="storeSettings.showFilters" class="lg:hidden" /></div><PlantProductGrid /></div></div><NoProductsFound v-else-if="error">We couldn't load plants right now. Please refresh and try again.</NoProductsFound><NoProductsFound v-else>No plants found.</NoProductsFound></main>
</template>
