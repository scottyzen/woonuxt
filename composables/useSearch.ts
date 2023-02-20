// Example: ?search=shirt
const searchQuery = ref('' as string);

export function useSearching() {
  const route = useRoute();
  const router = useRouter();

  searchQuery.value = route.query.search as string;

  function getSearchQuery() {
    return route.query.search as string;
  }

  function setSearchQuery(search: string) {
    searchQuery.value = search;
    if (!searchQuery.value) {
      router.push({ query: { ...route.query, search: undefined } });
    } else {
      router.push({ query: { ...route.query, search } });
    }
    searchProducts();
  }

  function clearSearchQuery() {
    searchQuery.value = '';
    router.push({ query: { ...route.query, search: undefined } });
    searchProducts();
  }

  async function searchProducts() {
    const { products, allProducts } = await useProducts();
    const { isFiltersActive, filterProducts } = useFiltering();

    products.value = allProducts.value;

    if (isFiltersActive.value) await filterProducts();

    if (searchQuery.value) {
      products.value = products.value.filter((product: any) => {
        return product.name.toLowerCase().includes(searchQuery.value.toLowerCase());
      });
    }

    return products.value;
  }

  const isSearchActive = computed(() => { return !!searchQuery.value });


  return { getSearchQuery, setSearchQuery, clearSearchQuery, searchProducts, isSearchActive };
}
