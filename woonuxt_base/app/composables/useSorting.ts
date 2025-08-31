// Example: ?orderby=price&order=asc

export function useSorting() {
  const route = useRoute();
  const router = useRouter();
  const { updateProductList } = useProducts();

  const orderQuery = useState<string>('order', () => '');

  orderQuery.value = route.query.orderby as string;

  function getOrderQuery(): { orderBy: string; order: string } {
    return { orderBy: route.query.orderby as string, order: route.query.order as string };
  }

  function setOrderQuery(orderby: string, order?: string): void {
    router.push({ query: { ...route.query, orderby: orderby ?? undefined, order: order ?? undefined } });
    setTimeout(() => {
      updateProductList();
    }, 100);
  }

  const isSortingActive = computed<boolean>(() => !!orderQuery.value);

  // Define a function to order the products
  function sortProducts(products: Product[]): Product[] {
    if (!isSortingActive) return products;

    const orderQuery = getOrderQuery();

    if (!orderQuery.orderBy && !orderQuery.order) return products;

    const orderby: string = orderQuery.orderBy || 'date';
    const order: string = orderQuery.order || 'DESC';

    // Named function for max price calculation (reused multiple times)
    function getMaxPrice(priceString: string): number {
      return parseFloat([...priceString.split(',')].reduce(maxPriceReducer));
    }

    // Named reducer function for maximum price calculation
    function maxPriceReducer(a: string, b: string): string {
      return String(Math.max(Number(a), Number(b)));
    }

    // Named sort comparison function
    function productComparator(a: Product, b: Product): number {
      // Format values for sorting
      const aDate: any = a.date ? new Date(a.date).getTime() : 0;
      const bDate: any = b.date ? new Date(b.date).getTime() : 0;
      const aPrice = a.rawPrice ? getMaxPrice(a.rawPrice) : 0;
      const bPrice = b.rawPrice ? getMaxPrice(b.rawPrice) : 0;
      const aSalePrice: number = a.rawSalePrice ? getMaxPrice(a.rawSalePrice) : 0;
      const aRegularPrice: number = a.rawRegularPrice ? getMaxPrice(a.rawRegularPrice) : 0;
      const bSalePrice: number = b.rawSalePrice ? getMaxPrice(b.rawSalePrice) : 0;
      const bRegularPrice: number = b.rawRegularPrice ? getMaxPrice(b.rawRegularPrice) : 0;
      const aDiscount: number = a.onSale ? Math.round(((aSalePrice - aRegularPrice) / aRegularPrice) * 100) : 0;
      const bDiscount: number = b.onSale ? Math.round(((bSalePrice - bRegularPrice) / bRegularPrice) * 100) : 0;
      const aName: string = a.name || '';
      const bName: string = b.name || '';
      const aRating: number = a.averageRating || 0;
      const bRating: number = b.averageRating || 0;

      switch (orderby) {
        case 'price':
          return order !== 'DESC' ? aPrice - bPrice : bPrice - aPrice;
        case 'rating':
          return order !== 'DESC' ? bRating - aRating : aRating - bRating;
        case 'discount':
          return order !== 'DESC' ? bDiscount - aDiscount : aDiscount - bDiscount;
        case 'alphabetically':
          return order !== 'DESC' ? aName.localeCompare(bName) : bName.localeCompare(aName);
        default:
          return order !== 'DESC' ? aDate - bDate : bDate - aDate;
      }
    }

    return products.sort(productComparator);
  }

  return { getOrderQuery, setOrderQuery, isSortingActive, orderQuery, sortProducts };
}
