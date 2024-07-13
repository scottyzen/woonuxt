let allProducts = [] as Product[];

export function useProducts() {
  // Declare the state variables and the setter functions
  const products = useState<Product[]>('products');

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

  return { products, allProducts, setProducts, updateProductList };
}
