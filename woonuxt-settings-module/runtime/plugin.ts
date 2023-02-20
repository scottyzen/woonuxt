export default defineNuxtPlugin(async () => {
  useGqlCors({ credentials: 'include', mode: 'cors' });
  if (process.client) {
    const { clearAllCookies } = useHelpers();
    const sessionToken = useCookie('woocommerce-session');
    if (sessionToken.value) useGqlHeaders({ 'woocommerce-session': `Session ${sessionToken.value}` });

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
  }
});
