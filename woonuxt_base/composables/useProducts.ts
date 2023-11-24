let allProducts = [] as Product[];

export function useProducts() {
  // Declare the state variables and the setter functions
  const products = useState<Product[]>('products');

  // Set the products state and the allProducts variable
  function setProducts(newProducts: Product[]): void {
    if (!Array.isArray(newProducts)) throw new Error('Products must be an array.');
    try {
      products.value = newProducts;
      allProducts = JSON.parse(JSON.stringify(newProducts));
    } catch (e) {
      console.log(e);
    }
  }

  const updateProductList = async (): Promise<void> => {
    const { isSortingActive, sortProducts } = await useSorting();
    const { isFiltersActive, filterProducts } = await useFiltering();
    const { isSearchActive, searchProducts } = await useSearching();
    const { scrollToTop } = useHelpers();

    // return all products if no filters are active
    if (!isFiltersActive.value && !isSearchActive.value && !isSortingActive.value) {
      products.value = allProducts;
      return;
    }

    // otherwise, apply filter, search and sorting in that order
    try {
      let newProducts = [...allProducts];
      if (isFiltersActive.value) newProducts = await filterProducts(newProducts);
      if (isSearchActive.value) newProducts = await searchProducts(newProducts);
      if (isSortingActive.value) newProducts = await sortProducts(newProducts);

      products.value = newProducts;
      scrollToTop();
    } catch (error) {
      console.error(error);
    }
  };

  return { products, allProducts, setProducts, updateProductList };
}
