export default defineNuxtPlugin(async () => {
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
            !logout.success ? console.log('logoutUser failed') : console.log('logoutUser success');

            if (!reloadCount.value) window.location.reload();
          }
        },
        { once: true }
      );
    });
  }
});
