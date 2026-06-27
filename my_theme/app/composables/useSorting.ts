// Example: ?orderby=price&order=asc
import type { Product } from '#types/gql';

/** Returns the highest price value from a WooCommerce raw price string (may be comma-separated for variable products). */
function getMaxRawPrice(raw: string | null | undefined): number {
  if (!raw) return 0;
  return Math.max(...raw.split(',').map(Number));
}

export function useSorting() {
  const route = useRoute();
  const router = useRouter();
  const { updateProductList } = useProducts();

  const orderQuery = useState<string>('order', () => '');

  orderQuery.value = route.query.orderby as string;

  function getOrderQuery(): { orderBy: string; order: string } {
    return { orderBy: route.query.orderby as string, order: route.query.order as string };
  }

  async function setOrderQuery(orderby: string, order?: string): Promise<void> {
    await router.push({ query: { ...route.query, orderby: orderby ?? undefined, order: order ?? undefined } });
    await updateProductList();
  }

  const isSortingActive = computed<boolean>(() => !!orderQuery.value);

  // Define a function to order the products
  function sortProducts(products: Product[]): Product[] {
    if (!isSortingActive.value) return products;

    const orderby: string = (route.query.orderby as string) || 'date';
    const order: string = (route.query.order as string) || 'DESC';

    // Named sort comparison function
    function productComparator(a: Product, b: Product): number {
      // Format values for sorting
      const aDate: any = a.date ? new Date(a.date).getTime() : 0;
      const bDate: any = b.date ? new Date(b.date).getTime() : 0;
      const aPrice = getMaxRawPrice(a.rawPrice);
      const bPrice = getMaxRawPrice(b.rawPrice);
      const aSalePrice = getMaxRawPrice(a.rawSalePrice);
      const aRegularPrice = getMaxRawPrice(a.rawRegularPrice);
      const bSalePrice = getMaxRawPrice(b.rawSalePrice);
      const bRegularPrice = getMaxRawPrice(b.rawRegularPrice);
      const aDiscount: number = a.onSale && aRegularPrice ? Math.round(((aSalePrice - aRegularPrice) / aRegularPrice) * 100) : 0;
      const bDiscount: number = b.onSale && bRegularPrice ? Math.round(((bSalePrice - bRegularPrice) / bRegularPrice) * 100) : 0;
      const aName: string = a.name || '';
      const bName: string = b.name || '';
      const aRating: number = a.averageRating || 0;
      const bRating: number = b.averageRating || 0;

      switch (orderby) {
        case 'price':
          return order === 'DESC' ? bPrice - aPrice : aPrice - bPrice;
        case 'rating':
          return order === 'DESC' ? bRating - aRating : aRating - bRating;
        case 'discount':
          return order === 'DESC' ? bDiscount - aDiscount : aDiscount - bDiscount;
        case 'alphabetically':
          return order === 'DESC' ? bName.localeCompare(aName) : aName.localeCompare(bName);
        default:
          return order === 'DESC' ? bDate - aDate : aDate - bDate;
      }
    }

    return [...products].sort(productComparator);
  }

  return { getOrderQuery, setOrderQuery, isSortingActive, orderQuery, sortProducts };
}
