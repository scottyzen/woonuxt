let allProducts = [] as Product[];

export function useProducts() {
  // Declare the state variables and the setter functions
  const products = useState<Product[]>('products');

  /**
   * Sets the products state variable and the allProducts variable.
   * @param {Product[]} newProducts - The new products to set.
   */
  function setProducts(newProducts: Product[]): void {
    // If newProducts is not an array, reset products and allProducts
    // to empty arrays to avoid errors in the UI.
    if (!Array.isArray(newProducts)) {
      products.value = [];
      allProducts = [];
      return;
    }
    products.value = [...newProducts];
    allProducts = JSON.parse(JSON.stringify(newProducts));
  }

  // Named function for product filtering pipeline
  function applyProductFilters(products: Product[]): Product[] {
    const { isSortingActive, sortProducts } = useSorting();
    const { isFiltersActive, filterProducts } = useFiltering();
    const { isSearchActive, searchProducts } = useSearching();

    let newProducts = [...products];
    if (isFiltersActive.value) newProducts = filterProducts(newProducts);
    if (isSearchActive.value) newProducts = searchProducts(newProducts);
    if (isSortingActive.value) newProducts = sortProducts(newProducts);

    return newProducts;
  }

  // Named async function for better performance and debugging
  async function updateProductList(): Promise<void> {
    const { scrollToTop } = useHelpers();
    const { isSortingActive } = useSorting();
    const { isFiltersActive } = useFiltering();
    const { isSearchActive } = useSearching();

    // scroll to top of page
    scrollToTop();

    // return all products if no filters are active
    if (!isFiltersActive.value && !isSearchActive.value && !isSortingActive.value) {
      products.value = allProducts;
      return;
    }

    // otherwise, apply filter, search and sorting in that order
    try {
      products.value = applyProductFilters(allProducts);
    } catch (error) {
      console.error(error);
    }
  }

  return { products, allProducts, setProducts, updateProductList };
}
