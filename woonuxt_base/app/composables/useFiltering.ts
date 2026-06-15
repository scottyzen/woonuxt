/**
 * @name useFiltering
 * @description A composable that handles the filtering of products. For reference this
 * is what the filter query looks like: ?filter=pa_color[green,blue],pa_size[md]
 */
import type { Product } from '#types/gql';

export function useFiltering() {
  const route = useRoute();
  const router = useRouter();
  const runtimeConfig = useRuntimeConfig(); // Declare a variable for the runtime config and the filter and order functions
  const { updateProductList } = useProducts();

  const filterQuery = useState<string>('filter', () => '');

  filterQuery.value = route.query.filter as string;

  /**
   * Get the filter value from the url
   * @param {string} filterName
   * @returns {string[]} - An array of filter values
   * @example getFilter('pa_color') // ["green", "blue"]
   */
  function getFilter(filterName: string): string[] {
    return filterQuery.value?.split(`${filterName}[`)[1]?.split(']')[0]?.split(',') || [];
  }

  /**
   * Set the filter value in the url
   * @param {string}
   * @param {string[]}
   * @example Just like the example above, but in reverse. setFilter('pa_color', ['green', 'blue'])
   */
  async function setFilter(filterName: string, filterValue: string[]): Promise<void> {
    let newFilterQuery = filterQuery.value || '';

    // If there are filters and filterName is not one of them, add the filter query
    if (!filterQuery.value?.includes(filterName)) {
      newFilterQuery = filterQuery.value ? `${filterQuery.value},${filterName}[${filterValue}]` : `${filterName}[${filterValue}]`;
    } else {
      // If filterValue is empty, remove the filter query
      newFilterQuery = !filterValue.length
        ? filterQuery.value.replace(`${filterName}[${getFilter(filterName)}]`, '')
        : filterQuery.value.replace(`${filterName}[${getFilter(filterName)}]`, `${filterName}[${filterValue}]`);
    }

    // remove the first or last comma
    newFilterQuery = newFilterQuery.replace(/^,/, '').replace(/,$/, '');

    // if there is 2 or more commas in a row, replace them with one
    newFilterQuery = newFilterQuery.replace(/,{2,}/g, ',');

    // Update the filter query
    filterQuery.value = newFilterQuery;

    // remove pagination from the url
    const path = route.path.includes('/page/') ? route.path.split('/page/')[0] : route.path;

    await router.push({
      path,
      query: { ...route.query, filter: newFilterQuery || undefined },
    });

    await updateProductList();
  }

  /**
   * Reset the filter value in the url
   */
  async function resetFilter(): Promise<void> {
    const { scrollToTop } = useHelpers();
    filterQuery.value = '';
    await router.push({ query: { ...route.query, filter: undefined } });
    await updateProductList();
    scrollToTop();
  }

  /**
   * Check if there are any filters active
   * @returns {boolean}
   */
  const isFiltersActive = computed<boolean>(() => !!filterQuery.value);

  /**
   * Filter the products based on the active filters
   * @param {Product[]} products - An array of all the products
   * @returns {Product[]} - An array of filtered products
   */
  function filterProducts(products: Product[]): Product[] {
    return products.filter((product) => {
      // Category filter
      const category = getFilter('category') || []; // ["category-slug"]
      const categoryCondition = category.length ? product.productCategories?.nodes?.find((node) => category.includes(node.slug as string)) : true;

      // price filter
      const priceRange = getFilter('price') || []; // ["0", "100"]
      // Variable products returns an array of prices, so we need to find the highest price.
      const productPrice = product.rawPrice ? Math.max(...product.rawPrice.split(',').map(Number)) : 0;
      const priceCondition = priceRange.length
        ? productPrice >= parseFloat(priceRange[0] as string) && productPrice <= parseFloat(priceRange[1] as string)
        : true;

      // Star rating filter
      const starRating = getFilter('rating') || [];
      const ratingCondition = starRating.length ? (product?.averageRating || 0) >= parseFloat(starRating[0] as string) : true;

      // Product attribute filters
      const globalProductAttributes = runtimeConfig?.public?.GLOBAL_PRODUCT_ATTRIBUTES?.map((attribute: any) => attribute.slug) || [];
      const attributeCondition = globalProductAttributes
        .map((attribute: string) => {
          const attributeValues = getFilter(attribute) || [];
          if (!attributeValues.length) return true;
          return product.terms?.nodes?.find((node: any) => node.taxonomyName === attribute && attributeValues.includes(node.slug));
        })
        .every((condition: any) => condition);

      // onSale filter
      const onSale = getFilter('sale');
      const saleItemsOnlyCondition = onSale.length ? product.onSale : true;

      return ratingCondition && priceCondition && attributeCondition && categoryCondition && saleItemsOnlyCondition;
    });
  }

  return { getFilter, setFilter, resetFilter, isFiltersActive, filterProducts };
}
