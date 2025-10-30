import { computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from '#imports';

export function useProductListing() {
  const route = useRoute();
  const router = useRouter();
  const { setProducts, updateProductList, setBaseFilter } = useProducts(); 
  // ⬆️ We gaan zo stap 3 doen: kleine uitbreiding in useProducts.ts met setBaseFilter(...)
  const { storeSettings } = useAppConfig();
  const { isQueryEmpty } = useHelpers();

  const isCategoryPage = computed(() => route.name === 'categorySlug' || route.params?.categorySlug);

  // build variables & query key
  const queryKey = computed(() =>
    isCategoryPage.value ? 'getProductsByCategory' : 'getProducts'
  );

  const variables = computed(() =>
    isCategoryPage.value ? { slug: String(route.params.categorySlug) } : { first: 24 }
  );

  // Fetch via Woonuxt helper
  const { data } = useAsyncGql(queryKey.value, variables.value, {
    // SSR + cache hints (pas aan naar je beleid)
    cache: 'force-cache',
    revalidate: 60,
  });

  // Normalize products from either query
  const allProducts = computed(() => {
    if (isCategoryPage.value) {
      return data.value?.productCategory?.products?.nodes ?? [];
    }
    return data.value?.products?.nodes ?? [];
  });

  // Set initial products in the shared store
  // and lock category as a base filter if we're on a category page
  const lockCategory = () => {
    if (!isCategoryPage.value) return;
    const slug = String(route.params.categorySlug);
    // 1) Zet een 'baseFilter' die altijd wordt toegepast in updateProductList()
    setBaseFilter({ categorySlug: slug });
    // 2) (optioneel) Zorg dat 'category' niet uitzetbaar is in UI (zie stap 4)
  };

  // initialize
  if (allProducts.value?.length) setProducts(allProducts.value);
  lockCategory();

  const hasProducts = computed<boolean>(() => Array.isArray(allProducts.value) && allProducts.value.length > 0);

  onMounted(() => {
    // Trigger client-side filtering once the dataset lives in the store
    if (!isQueryEmpty.value) updateProductList();
  });

  // Re-run filters on query change (facet filters, sort, prijs, etc.)
  watch(
    () => route.query,
    () => {
      updateProductList();
    }
  );

  // Re-fetch when category slug changes
  watch(
    () => route.params.categorySlug,
    async (newSlug, oldSlug) => {
      if (newSlug !== oldSlug) {
        // update base filter
        setBaseFilter({ categorySlug: String(newSlug) });
        // (optioneel) kun je hier een nieuwe fetch doen indien je data niet server-side revalidate
        updateProductList();
      }
    }
  );

  return {
    allProducts,
    hasProducts,
    storeSettings,
    isCategoryPage,
  };
}
