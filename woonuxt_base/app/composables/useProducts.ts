let allProducts = [] as Product[];

export function useProducts() {
  // ✅ altijd een lege array als startwaarde
  const products = useState<Product[]>('products', () => []);

  // ✅ baseFilter blijft zoals eerder
  const baseFilter = useState<{ categorySlug?: string }>('baseFilter', () => ({}));

  /**
   * Zet vaste filterwaarden die altijd gelden (zoals categorie)
   * @param {Object} payload - bijvoorbeeld { categorySlug: 'dames' }
   */
  function setBaseFilter(payload: { categorySlug?: string }) {
    baseFilter.value = { ...baseFilter.value, ...payload };
  }

  /**
   * Sets the products state variable and the allProducts variable.
   * @param {Product[]} newProducts - The new products to set.
   */
  function setProducts(newProducts: Product[]): void {
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

    // 🆕 2. Altijd eerst de baseFilter toepassen (bv. categorie)
    if (baseFilter.value.categorySlug) {
      newProducts = newProducts.filter((p) => {
        const cats = p.productCategories?.nodes || [];
        return cats.some((c) => c.slug === baseFilter.value.categorySlug);
      });
    }

    // Daarna pas dynamische filters, zoeken en sorteren
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
      // 🆕 zelfs zonder actieve filters willen we nog steeds de baseFilter toepassen
      if (baseFilter.value.categorySlug) {
        products.value = allProducts.filter((p) =>
          p.productCategories?.nodes?.some((c) => c.slug === baseFilter.value.categorySlug)
        );
        return;
      }

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

  // ✅ Sluit het exportobject af
  return { products, allProducts, setProducts, updateProductList, setBaseFilter, baseFilter };
}
