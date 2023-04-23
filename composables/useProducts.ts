let allProducts = [] as Product[];

export function useProducts() {
  // Declare the state variables and the setter functions
  const products = useState<Product[]>('products', () => []);

  function setProducts(newProducts: Product[]): void {
    products.value = newProducts;
    allProducts = JSON.parse(JSON.stringify(newProducts));
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

  return { products, allProducts, setProducts, updateProductList };
}
