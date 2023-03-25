// Example: ?orderby=price&order=asc
const orderQuery = ref('' as string);

export function useSorting() {
  const route = useRoute();
  const router = useRouter();
  const { updateProductList } = useProducts();

  orderQuery.value = route.query.orderby as string;

  function getOrderQuery(): { orderBy: string; order: string } {
    return { orderBy: route.query.orderby as string, order: route.query.order as string };
  }

  function setOrderQuery(orderby: string, order?: string): void {
    router.push({ query: { ...route.query, orderby: orderby ? orderby : undefined, order: order ? order : undefined } });
    setTimeout(() => {
      updateProductList();
    }, 100);
  }

  const isSortingActive = computed(() => !!orderQuery.value);

  // Define a function to order the products
  function sortProducts(products: any) {
    if (!isSortingActive) return;

    const orderQuery = getOrderQuery();

    if (!orderQuery.orderBy && !orderQuery.order) return;

    const orderby: string = orderQuery.orderBy || 'date';
    const order: string = orderQuery.order || 'DESC';

    return products.sort((a: any, b: any) => {
      // Format values for sorting
      const aDate: any = new Date(a.date).getTime();
      const bDate: any = new Date(b.date).getTime();
      const aPrice: number = a.rawPrice ? parseFloat([a.rawPrice.split(',')].reduce((a, b) => Math.max(a, b))) : 0;
      const bPrice: number = b.rawPrice ? parseFloat([b.rawPrice.split(',')].reduce((a, b) => Math.max(a, b))) : 0;
      const aSalePrice: number = a.rawSalePrice ? parseFloat(a.rawSalePrice?.split(',').reduce((a: string, b: string) => Math.max(parseFloat(a), parseFloat(b)))) : 0;
      const aRegularPrice: number = a.rawRegularPrice ? parseFloat(a.rawRegularPrice?.split(',').reduce((a: string, b: string) => Math.max(parseFloat(a), parseFloat(b)))) : 0;
      const bSalePrice: number = b.rawSalePrice ? parseFloat(b.rawSalePrice?.split(',').reduce((a: string, b: string) => Math.max(parseFloat(a), parseFloat(b)))) : 0;
      const bRegularPrice: number = b.rawRegularPrice ? parseFloat(b.rawRegularPrice?.split(',').reduce((a: string, b: string) => Math.max(parseFloat(a), parseFloat(b)))) : 0;
      const aDiscount: number = a.onSale ? Math.round(((aSalePrice - aRegularPrice) / aRegularPrice) * 100) : 0;
      const bDiscount: number = b.onSale ? Math.round(((bSalePrice - bRegularPrice) / bRegularPrice) * 100) : 0;

      switch (orderby) {
        case 'price':
          return order !== 'DESC' ? aPrice - bPrice : bPrice - aPrice;
        case 'rating':
          return order !== 'DESC' ? a.averageRating - b.averageRating : b.averageRating - a.averageRating;
        case 'discount':
          return order !== 'DESC' ? bDiscount - aDiscount : aDiscount - bDiscount;
        case 'alphabetically':
          return order !== 'DESC' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        default:
          return order !== 'DESC' ? aDate - bDate : bDate - aDate;
      }
    });
  }

  return { getOrderQuery, setOrderQuery, isSortingActive, orderQuery, sortProducts };
}
