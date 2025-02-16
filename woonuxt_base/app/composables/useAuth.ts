import type {
  RegisterCustomerInput,
  CreateAccountInput,
  ResetPasswordKeyMutationVariables,
  ResetPasswordEmailMutationVariables,
  LoginInput,
  LoginClientFragment,
} from '#gql';

export const useAuth = () => {
  const { refreshCart } = useCart();
  const { logGQLError, clearAllCookies } = useHelpers();
  const router = useRouter();

  const customer = useState<Customer>('customer', () => ({ billing: {}, shipping: {} }));
  const viewer = useState<Viewer | null>('viewer', () => null);
  const isPending = useState<boolean>('isPending', () => false);
  const orders = useState<Order[] | null>('orders', () => null);
  const downloads = useState<DownloadableItem[] | null>('downloads', () => null);
  const loginClients = useState<LoginClient[] | null>('loginClients', () => null);

  // Log in the user
  const loginUser = async (credentials: CreateAccountInput): Promise<{ success: boolean; error: any }> => {
    isPending.value = true;

    try {
      const { login } = await GqlLogin(credentials);
      if (login?.user && login?.authToken) {
        useGqlToken(login.authToken);
        await refreshCart();
      }

      isPending.value = false;
      return {
        success: true,
        error: null,
      };
    } catch (error: any) {
      logGQLError(error);
      isPending.value = false;

      return {
        success: false,
        error: error?.gqlErrors?.[0]?.message,
      };
    }
  };

  const loginWithProvider = async (state: string, code: string, provider: any): Promise<{ success: boolean; error: any }> => {
    isPending.value = true;

    try {
      const input: LoginInput = { oauthResponse: { state, code }, provider };
      const response = await GqlLoginWithProvider({ input });
      if (response.login?.authToken) {
        useGqlToken(response.login.authToken);
        await refreshCart();
        if (viewer.value === null) {
          return {
            success: false,
            error:
              'Your credentials are correct, but there was an error logging in. This is most likely due to an SSL error. Please try again later. If the problem persists, please contact support.',
          };
        }
      }

      return {
        success: true,
        error: null,
      };
    } catch (error: any) {
      logGQLError(error);

      return {
        success: false,
        error: error?.gqlErrors?.[0]?.message,
      };
    } finally {
      isPending.value = false;
    }
  };

  // Log out the user
  const logoutUser = async (): Promise<{ success: boolean; error: any }> => {
    isPending.value = true;
    try {
      const { logout } = await GqlLogout();
      if (logout) {
        await refreshCart();
        clearAllCookies();
        customer.value = { billing: {}, shipping: {} };
      }
      return { success: true, error: null };
    } catch (error: any) {
      logGQLError(error);
      return { success: false, error };
    } finally {
      updateViewer(null);
      if (router.currentRoute.value.path === '/my-account' && viewer.value === null) {
        router.push('/my-account');
      } else {
        router.push('/');
      }
    }
  };

  const registerUser = async (userInfo: RegisterCustomerInput): Promise<{ success: boolean; error: any }> => {
    isPending.value = true;
    try {
      await GqlRegisterCustomer({ input: userInfo });
      return { success: true, error: null };
    } catch (error: any) {
      logGQLError(error);
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

  const updateViewer = (payload: Viewer | null): void => {
    viewer.value = payload;
    isPending.value = false;
  };

  const sendResetPasswordEmail = async ({ username }: ResetPasswordEmailMutationVariables): Promise<{ success: boolean; error: any }> => {
    try {
      isPending.value = true;
      const { sendPasswordResetEmail } = await GqlResetPasswordEmail({ username });
      if (sendPasswordResetEmail?.success) {
        isPending.value = false;
        return { success: true, error: null };
      }
      return { success: false, error: 'There was an error sending the reset password email. Please try again later.' };
    } catch (error: any) {
      logGQLError(error);
      isPending.value = false;
      const gqlError = error?.gqlErrors?.[0];
      return { success: false, error: gqlError?.message };
    }
  };

  const resetPasswordWithKey = async ({ key, login, password }: ResetPasswordKeyMutationVariables): Promise<{ success: boolean; error: any }> => {
    try {
      isPending.value = true;
      const { resetUserPassword } = await GqlResetPasswordKey({ key, login, password });
      const wasPasswordReset = Boolean(resetUserPassword?.user?.id);
      if (wasPasswordReset) {
        isPending.value = false;
        return { success: true, error: null };
      }
      return { success: false, error: 'There was an error resetting the password. Please try again later.' };
    } catch (error: any) {
      isPending.value = false;
      const gqlError = error?.gqlErrors?.[0];
      return { success: false, error: gqlError?.message };
    }
  };

  const getOrders = async (): Promise<{ success: boolean; error: any }> => {
    try {
      const { customer } = await GqlGetOrders();
      if (customer) {
        orders.value = customer.orders?.nodes ?? [];
        return { success: true, error: null };
      }
      return { success: false, error: 'There was an error getting your orders. Please try again later.' };
    } catch (error: any) {
      logGQLError(error);
      const gqlError = error?.gqlErrors?.[0];
      return { success: false, error: gqlError?.message };
    }
  };

  const getDownloads = async (): Promise<{ success: boolean; error: any }> => {
    try {
      const { customer } = await GqlGetDownloads();
      if (customer) {
        downloads.value = customer.downloadableItems?.nodes ?? [];
        return { success: true, error: null };
      }
      return { success: false, error: 'There was an error getting your downloads. Please try again later.' };
    } catch (error: any) {
      logGQLError(error);
      const gqlError = error?.gqlErrors?.[0];
      return { success: false, error: gqlError?.message };
    }
  };

  const updateLoginClients = (payload: LoginClient[]): void => {
    loginClients.value = payload;
  };

  const avatar = computed(() => viewer.value?.avatar?.url ?? null);
  const wishlistLink = computed<string>(() => (viewer.value ? '/my-account?tab=wishlist' : '/wishlist'));

  return {
    viewer,
    customer,
    isPending,
    orders,
    downloads,
    avatar,
    wishlistLink,
    loginUser,
    loginClients,
    loginWithProvider,
    updateCustomer,
    updateViewer,
    logoutUser,
    registerUser,
    sendResetPasswordEmail,
    resetPasswordWithKey,
    getOrders,
    getDownloads,
    updateLoginClients,
  };
};
