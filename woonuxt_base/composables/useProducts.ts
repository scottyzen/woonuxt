let allProducts = [] as Product[];

export function useProducts() {
  // Declare the state variables and the setter functions
  const products = useState<Product[]>('products', () => []);

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

  /**
   * get all products from the api, it's a recursive function that will fetch all products
   * @param {string} category - the category to filter by (optional)
   * @param {string} after - the cursor to start fetching from
   * @param {Product[]} tempArray - the array to store the products in
   */
  const getAllProducts = async (category: string = '', after: string = '', tempArray: Product[] = []): Promise<Product[]> => {
    const isDev = process.env.NODE_ENV === 'development';
    const isServer = process.server;
    console.log('getAllProducts', process.client, isServer, isDev);
    if (isServer || isDev) {
      console.log('Fetching products from the server');
      try {
        const payload = category ? { after, slug: category } : { after };
        const { data }: any = await useAsyncGql('getProducts', payload);
        const newProducts = data?.value?.products?.nodes || [];
        tempArray = [...tempArray, ...newProducts];
        const hasMore = data?.value?.products?.pageInfo?.hasNextPage;

        return hasMore ? getAllProducts(category, data.value.products.pageInfo.endCursor, tempArray) : tempArray;
      } catch (error) {
        console.error(error);
        return tempArray;
      }
    }

    return tempArray;
  };

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
