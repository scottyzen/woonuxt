export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.server) return;

  const { storeSettings } = useAppConfig();
  const { clearAllCookies, getDomain, getErrorContext } = useHelpers();
  const { clearActiveAuthToken, refreshAuthToken } = useAuthTokens();
  const { refreshCart, refreshCartSummary } = useCart();
  const sessionToken = useCookie('woocommerce-session', { domain: getDomain(window.location.href), path: '/' });
  const fallbackSessionToken = useCookie('woocommerce-session', { path: '/' });
  const wooSessionToken = sessionToken.value || fallbackSessionToken.value;
  if (wooSessionToken) useGqlHeaders({ 'woocommerce-session': `Session ${wooSessionToken}` });

  if (import.meta.dev && 'serviceWorker' in navigator) {
    void navigator.serviceWorker.getRegistrations().then(async (registrations) => {
      if (!registrations.length) return;
      await Promise.all(registrations.map((registration) => registration.unregister()));
      if (navigator.serviceWorker.controller && sessionStorage.getItem('woonuxt:dev-sw-cleared') !== '1') {
        sessionStorage.setItem('woonuxt:dev-sw-cleared', '1');
        window.location.reload();
      }
    });
  }

  const clearAuthOnly = (): void => {
    clearActiveAuthToken();
    useGqlHeaders({ Authorization: '' });
  };

  const hasKnownSession = (): boolean => {
    const authToken = useCookie('auth-token', { path: '/' });
    const refreshToken = useCookie('auth-refresh-token', { path: '/' });
    const legacyGqlToken = useCookie('gql:default', { path: '/' });

    return !!(wooSessionToken || authToken.value || refreshToken.value || legacyGqlToken.value);
  };

  let authErrorHandlerRegistered = false;
  const registerAuthErrorHandler = (): void => {
    if (authErrorHandlerRegistered) return;
    authErrorHandlerRegistered = true;

    useGqlError((err: unknown) => {
      const { isAuthError, message } = getErrorContext(err);
      if (!isAuthError) return;

      // Wrapped with runWithContext because this calls composables (useGqlHeaders via clearAuthOnly,
      // refreshCart, etc.) after several `await`s, where the ambient Nuxt instance can otherwise be
      // lost on the client. See NUXT_E1001.
      void nuxtApp.runWithContext(async () => {
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
        await refreshCart();
      });
    });
  };

  async function initFullCart(): Promise<void> {
    registerAuthErrorHandler();

    const success: boolean = await refreshCart();

    // If cart refresh failed, clear the Woo session header and retry once
    if (!success) {
      // Wrapped with runWithContext: useGqlHeaders is called after an `await`, where the ambient Nuxt
      // instance can otherwise be lost on the client. See NUXT_E1001.
      nuxtApp.runWithContext(() => useGqlHeaders({ 'woocommerce-session': '' }));
      await refreshCart();
    }
  }

  // If we are in development mode, we want to initialise the store immediately
  const isDev = import.meta.dev || process.env.NODE_ENV === 'development';

  // Pages that need the full cart payload before the page renders
  const pagesToInitializeRightAway = ['/checkout', '/my-account', '/order-summary'];
  const isPathThatRequiresInit = pagesToInitializeRightAway.some((page) => useRoute().path.includes(page));

  const shouldInitFullCart = isDev || isPathThatRequiresInit || !storeSettings.initStoreOnUserActionToReduceServerLoad;

  if (shouldInitFullCart) {
    void initFullCart();
    return;
  }

  registerAuthErrorHandler();

  let summaryLoaded = false;
  const loadSummaryOnce = (): void => {
    if (summaryLoaded) return;
    summaryLoaded = true;
    void refreshCartSummary();
  };

  if (hasKnownSession()) {
    loadSummaryOnce();
  } else {
    ['mousedown', 'keydown', 'touchstart', 'click'].forEach((event) => {
      window.addEventListener(event, loadSummaryOnce, { once: true });
    });
  }
});
