// Example: ?search=shirt
import type { Product } from '#types/gql';

export function useSearching() {
  const route = useRoute();
  const router = useRouter();

  const isShowingSearch = useState<boolean>('isShowingSearch', () => false);
  const searchQuery = useState<string>('searchQuery', () => '');
  const isSearchActive = computed<boolean>(() => !!searchQuery.value);

  searchQuery.value = route.query.search as string;

  function getSearchQuery(): string {
    return route.query.search as string;
  }

  async function setSearchQuery(search: string): Promise<void> {
    const { updateProductList } = useProducts();
    searchQuery.value = search;
    await router.push({ query: { ...route.query, search: search || undefined } });
    await updateProductList();
  }

  function clearSearchQuery(): void {
    setSearchQuery('');
  }

  const toggleSearch = (): void => {
    isShowingSearch.value = !isShowingSearch.value;
  };

  // Named predicate function for product search filtering
  function productMatchesSearch(product: Product, searchQuery: string): boolean {
    const name = product.name?.toLowerCase();
    const description = product.description ? product.description.toLowerCase() : null;
    const shortDescription = product.shortDescription ? product.shortDescription.toLowerCase() : null;
    const query = searchQuery.toLowerCase();
    return !!(name?.includes(query) || description?.includes(query) || shortDescription?.includes(query));
  }

  function searchProducts(products: Product[]): Product[] {
    const search = getSearchQuery();
    return search ? products.filter((product: Product) => productMatchesSearch(product, search)) : products;
  }

  return { getSearchQuery, setSearchQuery, clearSearchQuery, searchProducts, isSearchActive, isShowingSearch, toggleSearch };
}
