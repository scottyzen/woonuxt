let allProducts = [] as Product[];
let productHaveBeenFetched = false;

export function useProducts() {
  // Declare the state variables and the setter functions
  const products = useState<Product[]>('products', () => []);

  function setProducts(newProducts: Product[]): void {
    products.value = newProducts;
    allProducts = JSON.parse(JSON.stringify(newProducts));
    productHaveBeenFetched = true;
  }

  const fetchAllProducts = async (after: string): Promise<void> => {
    // Return if all products are already fetched
    if (productHaveBeenFetched) return;

    try {
      const { data } = await useAsyncGql('getProducts', { after });
      const { pageInfo, nodes } = data.value?.products || { pageInfo: {}, nodes: [] };

      allProducts = [...allProducts, ...nodes] as Product[];

      if (allProducts.length) {
        if (pageInfo?.hasNextPage === true) {
          if (process.env.NODE_ENV === 'development') console.log('fetching more products...');
          await fetchAllProducts(pageInfo?.endCursor || '');
        } else {
          setProducts(allProducts);
        }
      }
    } catch (error: any) {
      console.error(error);
    }
  };

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

  return { products, allProducts, setProducts, updateProductList, fetchAllProducts };
}
