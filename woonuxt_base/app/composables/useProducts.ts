let allProducts = [] as Product[];

export function useProducts() {
  const products = useState<Product[]>('products');

  // 🆕 1. Base filter ref (voor categorie-lock)
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
    if (isFiltersActive.value) newProducts = filterProducts(newPr
