export const useAuth = () => {
  const { refreshCart } = useCart();

  const customer = useState<any | null>('customer', () => {
    return {
      billing: {},
      shipping: {},
    }
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
    } catch (error) {
      console.log('error', error);
      isPending.value = false;
      return { success: false, error };
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
  const registerUser = async (userInfo) => {
    console.log('registerUser', userInfo);
    isPending.value = true;
    try {
      const { registerCustomer } = await GqlRegisterCustomer({ input: userInfo });
      if (registerCustomer?.customer) {
        refreshCart();
      } else {
        isPending.value = false;
        return { success: false, error: registerCustomer?.customer };
      }
      return { success: true, error: null, data: registerCustomer };
    } catch (error) {
      console.log('error', error);
      isPending.value = false;
      return { success: false, error };
    }
  };


  // Update the user state
  const updateCustomer = (data: any) => {

    const sessionToken = data?.sessionToken;
    if (sessionToken) {
      useGqlHeaders({ 'woocommerce-session': `Session ${sessionToken}` });
      const newToken = useCookie('woocommerce-session');
      newToken.value = sessionToken;
    }
    customer.value = data;
    isPending.value = false;
  };

  const updateViewer = (data: any) => {
    viewer.value = data;
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
    registerUser
  };
};
