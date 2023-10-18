let allProducts = [] as Product[];

export function useProducts() {
  // Declare the state variables and the setter functions
  const products = useState<Product[]>('products', () => []);
  let tempArray: any[] = [];

  // Get all products
  const getAllProducts = async (after: string | null = '', categorySlug?: string): Promise<any[]> => {
    if (process.env.NODE_ENV === 'development') {
      // Default 40 products
      const { data } = await useAsyncGql('getProducts', { slug: categorySlug });
      return data.value?.products?.nodes.length ? data.value?.products?.nodes : [];
    } else {
      // All products
      const { data } = await useAsyncGql('getProducts', { after, first: 50, slug: categorySlug });
      const newProducts = data.value?.products?.nodes || [];
      tempArray = [...tempArray, ...newProducts];
      console.log('tempArray', tempArray.length, ' Has next page', data.value?.products?.pageInfo?.hasNextPage);
      return data.value?.products?.pageInfo?.hasNextPage ? getAllProducts(data.value?.products?.pageInfo?.endCursor) : tempArray;
    }
  };

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
    const { isFiltersActive, filterProducts } = await useFiltering();
    const { isSearchActive, searchProducts } = await useSearching();
    const { isSortingActive, sortProducts } = await useSorting();

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
    } catch (error) {
      console.error(error);
    }
  };

  return { products, allProducts, setProducts, updateProductList, getAllProducts };
}
