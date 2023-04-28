export const useAuth = () => {
  const { refreshCart } = useCart();

  const customer = useState<Customer>('customer', () => {
    return { billing: {}, shipping: {} };
  });
  const viewer = useState<Viewer | null>('viewer', () => null);
  const isPending = useState<boolean>('isPending', () => false);

  // Log in the user
  const loginUser = async (credentials: CreateAccountInput): Promise<{ success: boolean; error: any }> => {
    isPending.value = true;

    try {
      const { loginWithCookies } = await GqlLogin(credentials);

      if (loginWithCookies?.status === 'SUCCESS') {
        const cart = await refreshCart();
        if (cart && viewer.value === null) {
          return { success: false, error: 'Password was correct, but there was an error logging in. Plwase try again later. If the problem persists, please contact support.' };
        }
      } else {
        isPending.value = false;
        return { success: false, error: loginWithCookies?.status };
      }
      return { success: true, error: null };
    } catch (error: any) {
      isPending.value = false;
      const gqlError = error?.gqlErrors?.[0];
      return { success: false, error: gqlError?.message };
    }
  };

  // Log out the user
  const logoutUser = async (): Promise<{ success: boolean; error: any }> => {
    const { clearAllCookies } = useHelpers();
    isPending.value = true;
    try {
      const { logout } = await GqlLogout();
      if (logout) {
        isPending.value = false;
        await refreshCart();
        clearAllCookies();
        viewer.value = null;
        customer.value = { billing: {}, shipping: {} };
      }
      return { success: true, error: null };
    } catch (error) {
      isPending.value = false;
      return { success: false, error };
    }
  };

  // Register the user
  const registerUser = async (userInfo: CreateAccountInput): Promise<{ success: boolean; error: any }> => {
    isPending.value = true;
    try {
      const { registerCustomer } = await GqlRegisterCustomer({ input: userInfo });
      return { success: true, error: null };
    } catch (error: any) {
      const gqlError = error?.gqlErrors?.[0];
      isPending.value = false;
      return { success: false, error: gqlError?.message };
    }
  };

  // Update the user state
  const updateCustomer = (payload: Customer): void => {
    const sessionToken = payload?.sessionToken;
    if (sessionToken) {
      useGqlHeaders({ 'woocommerce-session': `Session ${sessionToken}` });
      const newToken = useCookie('woocommerce-session');
      newToken.value = sessionToken;
    }
    customer.value = payload;
    isPending.value = false;
  };

  const updateViewer = (payload: Viewer): void => {
    viewer.value = payload;
    isPending.value = false;
  };

  return {
    viewer,
    customer,
    loginUser,
    updateCustomer,
    updateViewer,
    logoutUser,
    isPending,
    registerUser,
  };
};
