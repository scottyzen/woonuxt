let allProducts = [] as Product[];

export function useProducts() {
  // Initialize state variables with default values
  const products = useState<Product[]>('products', () => []);
  const productsLoading = useState<boolean>('productsLoading', () => false);
  const error = useState<string | null>('productsError', () => null);

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

    productsLoading.value = true;
    error.value = null;

    try {
      // scroll to top of page
      scrollToTop();

      // return all products if no filters are active
      if (!isFiltersActive.value && !isSearchActive.value && !isSortingActive.value) {
        products.value = allProducts;
        return;
      }

      // otherwise, apply filter, search and sorting in that order
      let newProducts = [...allProducts];
      if (isFiltersActive.value) newProducts = filterProducts(newProducts);
      if (isSearchActive.value) newProducts = searchProducts(newProducts);
      if (isSortingActive.value) newProducts = sortProducts(newProducts);

      products.value = newProducts;
    } catch (err: any) {
      console.error('Error updating product list:', err);
      error.value = err.message;
    } finally {
      productsLoading.value = false;
    }
  };

  return { products, allProducts, setProducts, updateProductList, productsLoading, error };
}
