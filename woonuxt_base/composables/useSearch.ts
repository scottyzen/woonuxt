// Example: ?search=shirt
// const searchQuery = ref('' as string);

export function useSearching() {
  const isShowingSearch = useState<boolean>('isShowingSearch', () => false);
  const route = useRoute();
  const router = useRouter();
  const { updateProductList } = useProducts();

  const searchQuery = useState<string>('searchQuery', () => '');

  searchQuery.value = route.query.search as string;

  function getSearchQuery(): string {
    return route.query.search as string;
  }

  function setSearchQuery(search: string): void {
    searchQuery.value = search;
    router.push({ query: { ...route.query, search: search || undefined } });
    setTimeout(() => {
      updateProductList();
    }, 50);
  }

  function clearSearchQuery(): void {
    setSearchQuery('');
  }

  const isSearchActive = computed(() => {
    return !!searchQuery.value;
  });

  const toggleSearch = () => {
    isShowingSearch.value = !isShowingSearch.value;
  };

  function searchProducts(products: Product[]): Product[] {
    const currentRouteName = route.name || 'products'; // Default to products

    // If we are on a category page, we need to add the category slug to the route, otherwise every search will redirect to the products page
    if (route.name === 'product-category-slug') {
      const categorySlug = route.params.categorySlug as string;
      router.push({ name: currentRouteName, params: { categorySlug }, query: { ...route.query, search: searchQuery.value } });
    } else {
      router.push({ name: 'products', query: { ...route.query, search: searchQuery.value } });
    }

    const query = getSearchQuery();
    return query
      ? products.filter((product: Product) => {
          const name = product.name?.toLowerCase();
          const description = product.description ? product.description.toLowerCase() : null;
          const shortDescription = product.shortDescription ? product.shortDescription.toLowerCase() : null;
          const search = query.toLowerCase();
          return name?.includes(search) || description?.includes(search) || shortDescription?.includes(search);
        })
      : products;
  }

  return { getSearchQuery, setSearchQuery, clearSearchQuery, searchProducts, isSearchActive, isShowingSearch, toggleSearch };
}
