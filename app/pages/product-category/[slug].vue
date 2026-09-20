<script setup lang="ts">
import type { Product } from '#types/gql';
import PlantProductGrid from '../../components/shopElements/ProductGrid.vue';

const { setProducts, updateProductList } = useProducts();
const { storeSettings } = useAppConfig();
const route = useRoute();
const routeSlug = route.params.slug ?? route.params.categorySlug;
const slug = Array.isArray(routeSlug) ? routeSlug[0] : routeSlug;
const categoryName = computed(() => String(slug || 'Plants').replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()));
const { data, error, status } = await useAsyncGql('getProducts', { slug: slug ? [slug] : undefined });
const productsInCategory = computed<Product[]>(() => (data.value?.products?.nodes ?? []) as Product[]);
const isLoading = computed(() => status.value === 'idle' || status.value === 'pending');
watchEffect(() => setProducts(productsInCategory.value));
onMounted(() => { if (Object.keys(route.query).length) updateProductList(); });
watch(() => route.query, () => updateProductList());
useHead(() => ({ title: categoryName.value, meta: [{ name: 'description', content: `Shop ${categoryName.value}` }] }));
</script>

<template>
  <main class="bg-white">
    <section class="border-y border-[#edf0eb] bg-[#f6f8f3] py-14 text-center">
      <p class="mb-2 text-xs font-bold uppercase tracking-[.2em] text-[#538363]">Grow your space</p>
      <h1 class="plant-display text-5xl text-[#143d29]">{{ categoryName }}</h1>
      <p class="mt-3 text-sm text-gray-500"><NuxtLink to="/">Home</NuxtLink><span class="mx-2">/</span><NuxtLink to="/products">Plants</NuxtLink><span class="mx-2">/</span>{{ categoryName }}</p>
    </section>
    <div v-if="isLoading" class="container flex min-h-96 items-center justify-center"><LoadingIcon size="32" stroke="3" /></div>
    <div v-else-if="productsInCategory.length" class="container flex items-start gap-10 py-14">
      <Filters v-if="storeSettings.showFilters" :hide-categories="true" class="hidden w-58 shrink-0 lg:block" />
      <div class="min-w-0 flex-1"><div class="mb-8 flex items-center justify-between gap-4"><ProductResultCount /><OrderByDropdown v-if="storeSettings.showOrderByDropdown" /><ShowFilterTrigger v-if="storeSettings.showFilters" class="lg:hidden" /></div><PlantProductGrid /></div>
    </div>
    <NoProductsFound v-else-if="error">We couldn't load products in this category. Please refresh and try again.</NoProductsFound>
    <NoProductsFound v-else>No plants found in this category. Please try adjusting your filters or check back later.</NoProductsFound>
  </main>
</template>
