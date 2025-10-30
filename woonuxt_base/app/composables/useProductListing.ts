import { computed, onMounted, watch, nextTick } from 'vue';
import { useRoute } from '#imports';

export function useProductListing() {
  const route = useRoute();
  const { setProducts, updateProductList, setBaseFilter } = useProducts();
  const { storeSettings } = useAppConfig();
  const { isQueryEmpty } = useHelpers();

  // ✅ Detecteer of we op een categoriepagina zitten
  const isCategoryPage = computed(() => !!route.params?.categorySlug);

  // ✅ Kies de juiste querynaam (exact zoals in je .gql)
  const queryKey = computed(() =>
    isCategoryPage.value ? 'GetProductsByCategory' : 'getProducts'
  );

  // ✅ Stel de GraphQL-variabelen in
  const variables = computed(() =>
    isCategoryPage.value
      ? { slug: String(route.params.categorySlug), first: 24 }
      : { first: 24 }
  );

  // ✅ Ophalen via Woonuxt GraphQL helper
  const { data, pending, error } = useAsyncGql(queryKey.value, variables.value, {
    cache: 'force-cache',
    revalidate: 60,
  });

  // ✅ Normaliseer de producten uit de query
  const allProducts = computed(() => {
    if (isCategoryPage.value) {
      return data.value?.productCategory?.products?.nodes ?? [];
    }
    return data.value?.products?.nodes ?? [];
  });

  // ✅ Zet producten in de store + lock categorie-filter
  const initProducts = async () => {
    await nextTick();

    if (isCategoryPage.value) {
      const slug = String(route.params.categorySlug);
      setBaseFilter({ categorySlug: slug });
    }

    if (Array.isArray(allProducts.value) && allProducts.value.length > 0) {
      setProducts(allProducts.value);
    }
  };

  // ✅ Controleer of er producten zijn (veilig)
  const hasProducts = computed<boolean>(() => {
    const list = allProducts.value || [];
    return Array.isArray(list) && list.length > 0;
  });

  // ✅ Init bij laden
  onMounted(() => {
    initProducts();

    if (!isQueryEmpty.value) {
      updateProductList();
    }
  });

  // ✅ Herbereken bij filters (prijs, sortering, etc.)
  watch(
    () => route.query,
    () => {
      updateProductList();
    }
  );

  // ✅ Herladen als slug verandert (nieuwe categorie)
  watch(
    () => route.params.categorySlug,
    async (newSlug, oldSlug) => {
      if (newSlug && newSlug !== oldSlug) {
        setBaseFilter({ categorySlug: String(newSlug) });
        await initProducts();
        updateProductList();
      }
    }
  );

  return {
    allProducts,
    hasProducts,
    storeSettings,
    isCategoryPage,
    pending,
    error,
  };
}
