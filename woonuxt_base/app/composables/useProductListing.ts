import { computed, onMounted, watch, watchEffect, nextTick } from 'vue';
import { useRoute } from '#imports';

export function useProductListing() {
  const route = useRoute();
  const { setProducts, updateProductList, setBaseFilter } = useProducts();
  const { storeSettings } = useAppConfig();
  const { isQueryEmpty } = useHelpers();

  // ✅ Detecteer of dit een categoriepagina is
  const isCategoryPage = computed(() => !!route.params?.categorySlug);

  // ✅ Kies de juiste querynaam (exacte match met jouw .gql)
  const queryKey = computed(() =>
    isCategoryPage.value ? 'GetProductsByCategory' : 'getProducts'
  );

  // ✅ Stel de juiste GraphQL-variabelen in
  const variables = computed(() =>
    isCategoryPage.value
      ? { slug: String(route.params.categorySlug), first: 24 }
      : { first: 24 }
  );

  // ✅ Ophalen via useAsyncGql
  const { data, pending, error } = useAsyncGql(queryKey.value, variables.value, {
    cache: 'force-cache',
    revalidate: 60,
  });

  // ✅ Debug (mag je later verwijderen)
  watchEffect(() => {
    if (data.value) {
      console.log('🧩 GraphQL response:', data.value);
    }
  });

  // ✅ Normaliseer producten afhankelijk van de query
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

    if (allProducts.value?.length) {
      setProducts(allProducts.value);
    }
  };

  // ✅ Bereken of er producten zijn
  const hasProducts = computed<boolean>(
    () => Array.isArray(allProducts.value) && allProducts.value.length > 0
  );

  // ✅ Init bij laden
  onMounted(() => {
    initProducts();

    if (!isQueryEmpty.value) {
      updateProductList();
    }
  });

  // ✅ Herbereken bij filterquery-verandering (facetfilters, sort, etc.)
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
