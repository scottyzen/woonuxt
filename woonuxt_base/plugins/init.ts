export default defineNuxtPlugin(async (nuxtApp) => {
  useGqlCors({ credentials: 'include', mode: 'cors' });

  if (process.client) {
    const { clearAllCookies } = useHelpers();
    const sessionToken = useCookie('woocommerce-session');
    if (sessionToken.value) useGqlHeaders({ 'woocommerce-session': `Session ${sessionToken.value}` });

    // Wait for the user to interact with the page before refreshing the cart, this is helpful to prevent excessive requests to the server
    let initialised = false;
    const eventsToFireOn = ['mousedown', 'keydown', 'touchstart', 'scroll', 'wheel', 'click', 'resize', 'mousemove', 'mouseover'];

    eventsToFireOn.forEach((event) => {
      window.addEventListener(
        event,
        async () => {
          // We only want to execute this code block once, so we return if initialised is truthy.
          if (initialised) return;
          initialised = true;

          const { refreshCart } = useCart();
          const success = await refreshCart();
          if (!success) {
            clearAllCookies();

            // Add a new cookie to prevent infinite reloads
            const reloadCount = useCookie('reloadCount');
            if (!reloadCount.value) {
              reloadCount.value = '1';
            } else {
              return;
            }

            // Log out the user
            const { logoutUser } = useAuth();
            const logout = await logoutUser();

            if (!reloadCount.value) window.location.reload();
          }
        },
        { once: true },
      );
    });
  }

  // nuxtApp.hook('app:created', () => {
  // type Product = any; // Replace with your actual Product type
  // type PageInfo = { hasNextPage: boolean; endCursor: string };
  // type Data = { value: { products: { nodes: Product[]; pageInfo: PageInfo } } };

  // const loadAllProducts = async (after: string = '', tempArray: Product[] = []): Promise<Product[]> => {
  //   try {
  //     const { data }: { data: Data } = await useAsyncGql('getProducts', { after });
  //     const newProducts = data.value?.products?.nodes || [];
  //     tempArray = [...tempArray, ...newProducts];

  //     if (data.value.products?.pageInfo?.hasNextPage) {
  //       // add a delay to prevent rate limiting
  //       console.log('Number of products:', tempArray.length, 'Fetching more...');
  //       await new Promise((resolve, reject) => setTimeout(resolve, 1000)).catch(console.error);
  //       return loadAllProducts(data.value.products.pageInfo.endCursor, tempArray);
  //     } else {
  //       console.log('Number of products:', tempArray.length);
  //       nuxtApp.provide('wooproducts', tempArray);
  //       return tempArray;
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     return tempArray;
  //   }
  // };

  // const products = await loadAllProducts();
  // });
});
