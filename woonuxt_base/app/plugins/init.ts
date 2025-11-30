export default defineNuxtPlugin(async (nuxtApp) => {
  if (!import.meta.env.SSR) {
    const { storeSettings } = useAppConfig();
    const { clearAllCookies, getDomain } = useHelpers();
    const sessionToken = useCookie('woocommerce-session', { domain: getDomain(window.location.href) });
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
      let success: boolean = await refreshCart();

      useGqlError((err: any) => {
        const serverErrors = ['The iss do not match with this server', 'Invalid session token'];
        if (serverErrors.includes(err?.gqlErrors?.[0]?.message)) {
          clearAllCookies();
          window.location.reload();
        }
      });

      // If cart refresh failed, clear cookies and try one more time
      if (!success) {
        clearAllCookies();
        // clearAllLocalStorage();

        // Remove the old session header
        useGqlHeaders({ 'woocommerce-session': '' });

        // Retry the cart refresh with clean state
        success = await refreshCart();

        // If still failing, log out the user
        if (!success) {
          const { logoutUser } = useAuth();
          await logoutUser();
        }
      }
    }

    // If we are in development mode, we want to initialise the store immediately
    const isDev = import.meta.dev || process.env.NODE_ENV === 'development';

    // Check if the current route path is one of the pages that need immediate initialization
    const pagesToInitializeRightAway = ['/checkout', '/my-account', '/order-summary'];
    const isPathThatRequiresInit = pagesToInitializeRightAway.some((page) => useRoute().path.includes(page));

    const shouldInit = isDev || isPathThatRequiresInit || !storeSettings.initStoreOnUserActionToReduceServerLoad;

    if (shouldInit) {
      initStore();
    } else {
      eventsToFireOn.forEach((event) => {
        window.addEventListener(event, initStore, { once: true });
      });
    }
  }
});
