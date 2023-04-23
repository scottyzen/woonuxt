// Example: ?search=shirt
// const searchQuery = ref('' as string);

export function useSearching() {
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

  function searchProducts(products: Product[]): Product[] {
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

  return { getSearchQuery, setSearchQuery, clearSearchQuery, searchProducts, isSearchActive };
}
