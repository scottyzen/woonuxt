// Example: ?filter=pa_color[green,blue],pa_size[md]
const filterQuery = ref('' as string);

export function useFiltering() {
  const route = useRoute();
  const router = useRouter();
  const runtimeConfig = useRuntimeConfig(); // Declare a variable for the runtime config and the filter and order functions

  filterQuery.value = route.query.filter as string;

  function getFilter(filterName: string) {
    return (
      filterQuery.value?.split(`${filterName}[`)[1]?.split(']')[0]?.split(',') || []
    );
  }

  function setFilter(filterName: string, filterValue: string[]) {

    let newFilterQuery = filterQuery.value || '';

    // If there are filters and filterName is not one of them, add the filter query
    if (!filterQuery.value || !filterQuery.value.includes(filterName)) {
      newFilterQuery = filterQuery.value ? `${filterQuery.value},${filterName}[${filterValue}]` : `${filterName}[${filterValue}]`;
    } else {
      // If filterValue is empty, remove the filter query
      newFilterQuery = !filterValue.length ? filterQuery.value.replace(`${filterName}[${getFilter(filterName)}]`, '')
        : filterQuery.value.replace(`${filterName}[${getFilter(filterName)}]`, `${filterName}[${filterValue}]`);
    }

    // remove the first or last comma
    newFilterQuery = newFilterQuery.replace(/^,/, '').replace(/,$/, '');

    // if there is 2 or more commas in a row, replace them with one
    newFilterQuery = newFilterQuery.replace(/,{2,}/g, ',');

    // Update the filter query
    filterQuery.value = newFilterQuery;

    router.push({ query: { ...route.query, filter: newFilterQuery } });

    // if the filter query is empty, remove it from the url
    // !newFilterQuery ? router.push({ query: { ...route.query, filter: undefined } }) : router.push({ query: { filter: newFilterQuery } });
    if (!newFilterQuery) {
      router.push({ query: { ...route.query, filter: undefined } });
    } else {
      router.push({ query: { ...route.query, filter: newFilterQuery } });
    }

    filterProducts();

  }

  function resetFilter() {
    filterQuery.value = '';
    router.push({ query: { ...route.query, filter: undefined } });

    filterProducts();
  }

  const isFiltersActive = computed(() => !!filterQuery.value);

  // Define a function to filter the products
  async function filterProducts() {
    const { products, allProducts } = await useProducts();

    if (!isFiltersActive.value) {
      products.value = allProducts.value;
      return;
    }

    products.value = allProducts.value.filter((product) => {
      // Category filter
      const category = getFilter('category') || []; // ["category-slug"]
      const categoryCondition = category.length ? product.productCategories?.nodes?.find((node: any) => category.includes(node.slug)) : true;

      // price filter
      const priceRange = getFilter('price') || [];
      // Variable products returns an array of prices, so we need to find the highest price.
      const productPrice = product.rawPrice ? parseFloat([...product.rawPrice.split(',')].reduce((a, b) => Math.max(a, b))) : 0;
      const priceCondition = priceRange.length ? productPrice >= parseFloat(priceRange[0]) && productPrice <= parseFloat(priceRange[1]) : true;

      // Star rating filter
      const starRating = getFilter('rating') || [];
      const ratingCondition = starRating.length ? product.averageRating ? product.averageRating >= parseFloat(starRating[0]) : false : true;

      // Product attribute filters
      const globalProductAttributes = runtimeConfig?.public?.GLOBAL_PRODUCT_ATTRIBUTES?.map((attribute: any) => attribute.slug) || [];
      const attributeCondition = globalProductAttributes.map((attribute: string) => {
        const attributeValues = getFilter(attribute) || [];
        if (!attributeValues.length) return true;
        return product.terms?.nodes?.find((node: any) => node.taxonomyName === attribute && attributeValues.includes(node.slug));
      }).every((condition: object) => condition);

      // onSale filter
      const onSale = getFilter('sale') || [];
      const saleItemsOnlyCondition = onSale.length ? product.onSale : true;

      return (ratingCondition && priceCondition && attributeCondition && categoryCondition && saleItemsOnlyCondition);

    });

    // If sorting is active, sort the products
    const { sortProducts, isSortingActive } = useSorting();
    if (isSortingActive.value) sortProducts();

    return products.value;
  }

  return { getFilter, setFilter, resetFilter, isFiltersActive, filterProducts };
}
