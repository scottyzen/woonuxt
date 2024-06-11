export default defineNuxtPlugin(async (nuxtApp) => {
  if (process.client) {
    const { clearAllCookies, clearAllLocalStorage } = useHelpers();
    const sessionToken = useCookie('woocommerce-session');
    if (sessionToken.value) useGqlHeaders({ 'woocommerce-session': `Session ${sessionToken.value}` });

    // Wait for the user to interact with the page before refreshing the cart, this is helpful to prevent excessive requests to the server
    let initialised = false;
    const eventsToFireOn = ['mousedown', 'keydown', 'touchstart', 'scroll', 'wheel', 'click', 'resize', 'mousemove', 'mouseover'];

    async function initStore() {
      if (initialised) {
        // We only want to execute this code block once, so we return if initialised is truthy and remove the event listeners
        eventsToFireOn.forEach((event) => {
          window.removeEventListener(event, initStore);
        });
        return;
      }

      initialised = true;

      const { refreshCart } = useCart();
      const success = await refreshCart();
      if (!success) {
        clearAllCookies();
        clearAllLocalStorage();

        // Add a new cookie to prevent infinite reloads
        const reloadCount = useCookie('reloadCount');
        if (!reloadCount.value) {
          reloadCount.value = '1';
        } else {
          return;
        }

        // Log out the user
        const { logoutUser } = useAuth();
        await logoutUser();

        if (!reloadCount.value) window.location.reload();
      }
    }

    eventsToFireOn.forEach((event) => {
      window.addEventListener(event, initStore, { once: true });
    });

    // If we are in development mode, we want to initialise the store immediately
    if (process.env.NODE_ENV === 'development') initStore();
  }
});
