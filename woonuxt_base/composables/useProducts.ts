let allProducts = [] as Product[];

export function useProducts() {
  // Declare the state variables and the setter functions
  const products = useState<Product[]>('products', () => []);

  // Get all products
  const getAllProducts = async (after: string | null = '', categorySlug?: string, tempArray: any[] = []): Promise<Product[]> => {
    try {
      const payload = categorySlug ? { after, slug: categorySlug } : { after };
      const { data } = await useAsyncGql('getProducts', payload);
      const newProducts = data.value?.products?.nodes || [];
      if (newProducts.length) {
        tempArray = [...tempArray, ...newProducts];
      }

      // return data.value.products?.pageInfo?.hasNextPage ? getAllProducts(data.value.products.pageInfo.endCursor) : tempArray;
      if (data.value.products?.pageInfo?.hasNextPage) {
        // add a delay to prevent rate limiting
        console.log('Number of products:', tempArray.length, 'Fetching more...');
        await new Promise((resolve, reject) => setTimeout(resolve, 1000)).catch(console.error);
        return getAllProducts(data.value.products.pageInfo.endCursor, categorySlug, tempArray);
      } else {
        console.log('Number of products:', tempArray.length);
        return tempArray;
      }
    } catch (error) {
      console.error(error);
      return [];
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
