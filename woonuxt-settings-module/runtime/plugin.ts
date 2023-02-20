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

      const { logoutUser } = useAuth();

      // Log out the user
      const logout = await logoutUser();
      if (!logout.success) {
        console.log('logoutUser failed');
      } else {
        console.log('logoutUser success');
      }

      window.location.reload(true);
    }
  }
});
