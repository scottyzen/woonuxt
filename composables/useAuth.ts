export const useAuth = () => {
  const { refreshCart } = useCart();

  const customer = useState<any | null>('customer', () => {
    return { billing: {}, shipping: {} };
  });
  const viewer = useState<any | null>('viewer', () => null);
  const isPending = useState<boolean>('isPending', () => false);

  // Log in the user
  const loginUser = async (credentials: CreateAccountInput) => {
    isPending.value = true;

    try {
      const { loginWithCookies } = await GqlLogin(credentials);

      if (loginWithCookies?.status === 'SUCCESS') {
        refreshCart();
      } else {
        isPending.value = false;
        return { success: false, error: loginWithCookies?.status };
      }
      return { success: true, error: null, data: loginWithCookies };
    } catch (error: any) {
      isPending.value = false;
      const gqlError = error?.gqlErrors?.[0];
      return { success: false, error: gqlError?.message };
    }
  };

  // Log out the user
  const logoutUser = async () => {
    isPending.value = true;
    try {
      const data = await GqlLogout();
      if (data) refreshCart();
      return { success: true, error: null };
    } catch (error) {
      isPending.value = false;
      return { success: false, error };
    }
  };

  // Register the user
  const registerUser = async (userInfo: CreateAccountInput) => {
    isPending.value = true;
    try {
      const { registerCustomer } = await GqlRegisterCustomer({ input: userInfo });
      return { success: true, error: null, data: registerCustomer };
    } catch (error: any) {
      const gqlError = error?.gqlErrors?.[0];
      isPending.value = false;
      return { success: false, error: gqlError?.message };
    }
  };

  // Update the user state
  const updateCustomer = <T>(data: any): void => {
    const sessionToken = data?.sessionToken;
    if (sessionToken) {
      useGqlHeaders({ 'woocommerce-session': `Session ${sessionToken}` });
      const newToken = useCookie('woocommerce-session');
      newToken.value = sessionToken;
    }
    customer.value = data;
    isPending.value = false;
  };

  const updateViewer = <T>(payload: any): void => {
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
