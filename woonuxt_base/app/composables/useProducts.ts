let allProducts = [] as Product[];

export function useProducts() {
  const products = ref([]);
  const productsLoading = ref(false);
  const productsError = ref(null);

  const fetchProducts = async (variables = {}) => {
    productsLoading.value = true;
    productsError.value = null;
    
    try {
      // Add debug logging
      console.log('Fetching products with variables:', variables);
      
      const { data, error } = await useAsyncQuery('getProducts', variables);
      
      // Log the raw response
      console.log('GraphQL response:', data.value, error.value);
      
      if (error.value) {
        productsError.value = error.value.message || 'Error loading products';
        console.error('GraphQL error:', error.value);
      } else if (data.value?.products?.nodes) {
        products.value = data.value.products.nodes;
        console.log('Products loaded:', products.value.length);
      } else {
        productsError.value = 'No products found';
      }
    } catch (err) {
      console.error('Error in fetchProducts:', err);
      productsError.value = err.message || 'Error loading products';
    } finally {
      productsLoading.value = false;
    }
  };

  /**
   * Sets the products state variable and the allProducts variable.
   * @param {Product[]} newProducts - The new products to set.
   */
  function setProducts(newProducts: Product[]): void {
    if (!Array.isArray(newProducts)) throw new Error('Products must be an array.');
    products.value = newProducts ?? [];
    allProducts = JSON.parse(JSON.stringify(newProducts));
  }

  const updateProductList = async (): Promise<void> => {
    const { scrollToTop } = useHelpers();
    const { isSortingActive, sortProducts } = useSorting();
    const { isFiltersActive, filterProducts } = useFiltering();
    const { isSearchActive, searchProducts } = useSearching();

    // scroll to top of page
    scrollToTop();

    // return all products if no filters are active
    if (!isFiltersActive.value && !isSearchActive.value && !isSortingActive.value) {
      products.value = allProducts;
      return;
    }

    // otherwise, apply filter, search and sorting in that order
    try {
      let newProducts = [...allProducts];
      if (isFiltersActive.value) newProducts = filterProducts(newProducts);
      if (isSearchActive.value) newProducts = searchProducts(newProducts);
      if (isSortingActive.value) newProducts = sortProducts(newProducts);

      products.value = newProducts;
    } catch (error) {
      console.error(error);
    }
  };

  return {
    products,
    productsLoading,
    productsError,
    fetchProducts,
    allProducts,
    setProducts,
    updateProductList
  };
}
