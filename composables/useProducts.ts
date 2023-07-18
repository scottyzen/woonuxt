let allProducts = [] as Product[];

export function useProducts() {
  // Declare the state variables and the setter functions
  const products = useState<Product[]>('products', () => []);
  const isFetchingMoreProducts = useState<boolean>('isFetchingMoreProducts', () => false);

  function setProducts(newProducts: Product[]): void {
    products.value = newProducts;
    allProducts = JSON.parse(JSON.stringify(newProducts));
    isFetchingMoreProducts.value = false;
  }

  const fetchAllProducts = async (after: string): Promise<void> => {
    const { data } = await useAsyncGql('getProducts', { after });
    const { pageInfo, nodes } = data.value.products as any;

    allProducts = [...allProducts, ...nodes];

    if (pageInfo.hasNextPage) {
      if (process.env.NODE_ENV === 'development') console.log('fetching more products...');
      isFetchingMoreProducts.value = true;
      await fetchAllProducts(pageInfo.endCursor);
    } else {
      setProducts(allProducts);
    }

  }

  const updateProductList = async (): Promise<void> => {
    const { isFiltersActive, filterProducts } = await useFiltering();
    const { isSearchActive, searchProducts } = await useSearching();
    const { isSortingActive, sortProducts } = await useSorting();

    // return all products if no filters are active
    if (!isFiltersActive.value && !isSearchActive.value && !isSortingActive.value) {
      products.value = allProducts;
      return;
    }

    // otherwise, apply filter, search and sorting in that order
    let newProducts = [...allProducts];
    if (isFiltersActive.value) newProducts = await filterProducts(newProducts);
    if (isSearchActive.value) newProducts = await searchProducts(newProducts);
    if (isSortingActive.value) newProducts = await sortProducts(newProducts);

    products.value = newProducts;
  };

  return { products, allProducts, setProducts, updateProductList, fetchAllProducts, isFetchingMoreProducts };
}
