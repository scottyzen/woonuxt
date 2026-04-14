export default defineNuxtPlugin(async (nuxtApp) => {
  if (!import.meta.env.SSR) {
    const { storeSettings } = useAppConfig();
    const { clearAllCookies, getDomain, getErrorContext } = useHelpers();
    const sessionToken = useCookie('woocommerce-session', { domain: getDomain(window.location.href), path: '/' });
    if (sessionToken.value) useGqlHeaders({ 'woocommerce-session': `Session ${sessionToken.value}` });

    const clearAuthOnly = (): void => {
      const { clearActiveAuthToken } = useAuth();
      clearActiveAuthToken();
      useGqlHeaders({ Authorization: '' });
    };

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

      useGqlError((err: unknown) => {
        const { isAuthError, message } = getErrorContext(err);
        if (!isAuthError) return;

        const { refreshAuthToken } = useAuth();
        void (async () => {
          const refreshed = await refreshAuthToken(true);
          if (refreshed) {
            await refreshCart();
            return;
          }

          const normalizedMessage = message?.toLowerCase() || '';
          const fatalAuthErrors = ['the iss do not match with this server', 'invalid-secret-key'];
          if (fatalAuthErrors.some((fatal) => normalizedMessage.includes(fatal))) {
            clearAllCookies();
            window.location.reload();
            return;
          }

          clearAuthOnly();

          const { refreshCart: retryRefreshCart } = useCart();
          await retryRefreshCart();
        })();
      });

      // If cart refresh failed, clear the Woo session header and retry once
      if (!success) {
        // Remove the old session header
        useGqlHeaders({ 'woocommerce-session': '' });

        // Retry the cart refresh with clean state
        success = await refreshCart();
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
