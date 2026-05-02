import type {
  ApiResponse,
  AuthResponse,
  CreateAccountInput,
  Customer,
  DownloadableItem,
  LoginClient,
  LoginInput,
  LoginSession,
  Order,
  RegisterCustomerInput,
  ResetPasswordEmailMutationVariables,
  ResetPasswordKeyMutationVariables,
  Viewer,
} from '#types/gql';

const EMPTY_CUSTOMER = { billing: {}, shipping: {} } as Customer;
const LOGIN_ERROR = 'There was an error logging in. Please try again.';
const OAUTH_LOGIN_ERROR =
  'Your credentials are correct, but there was an error logging in. This is most likely due to an SSL error. Please try again later. If the problem persists, please contact support.';

export const useAuth = () => {
  const { refreshCart, updateCart } = useCart();
  const { clearAllCookies, getDomain, getErrorMessage } = useHelpers();
  const { refreshAuthToken, clearAuthSession, setAuthSessionFromLogin } = useAuthTokens();
  const router = useRouter();

  const customer = useState<Customer>('customer', () => ({ ...EMPTY_CUSTOMER }));
  const viewer = useState<Viewer | null>('viewer', () => null);
  const isPending = useState<boolean>('isPending', () => false);
  const orders = useState<Order[] | null>('orders', () => null);
  const downloads = useState<DownloadableItem[] | null>('downloads', () => null);
  const loginClients = useState<LoginClient[] | null>('loginClients', () => null);
  const returnUrl = useState<string | null>('loginReturnUrl', () => null);

  const withPending = async <T>(action: () => Promise<T>): Promise<T> => {
    isPending.value = true;
    try {
      return await action();
    } finally {
      isPending.value = false;
    }
  };

  const authError = (error: unknown, fallback?: string): AuthResponse => ({
    success: false,
    error: getErrorMessage(error) || fallback,
  });

  const setWooSession = (sessionToken?: string | null): void => {
    if (!sessionToken) return;

    useGqlHeaders({ 'woocommerce-session': `Session ${sessionToken}` });
    const domain = import.meta.client ? getDomain(window.location.href) : '';
    useCookie<string | null>('woocommerce-session', domain ? { domain, path: '/' } : { path: '/' }).value = sessionToken;
  };

  const clearWooSession = (): void => {
    useGqlHeaders({ 'woocommerce-session': '' });
    if (!import.meta.client) return;

    useCookie<string | null>('woocommerce-session', { path: '/' }).value = null;
    const domain = getDomain(window.location.href);
    if (domain) {
      useCookie<string | null>('woocommerce-session', { domain, path: '/' }).value = null;
    }
  };

  const updateCustomer = (payload: Customer): void => {
    setWooSession(payload?.sessionToken);
    customer.value = payload;
    isPending.value = false;
  };

  const updateViewer = (payload: Viewer | null): void => {
    viewer.value = payload;
    isPending.value = false;
  };

  const resetAccountState = (): void => {
    returnUrl.value = null;
    orders.value = null;
    downloads.value = null;
    customer.value = { ...EMPTY_CUSTOMER };
    viewer.value = null;
  };

  const applyLoginSession = async (payload?: LoginSession | null): Promise<boolean> => {
    if (!payload?.authToken) return false;
    setAuthSessionFromLogin(payload);
    await refreshCart();
    return true;
  };

  const loadCustomerCollection = async <T>(
    query: () => Promise<{ customer?: any }>,
    getNodes: (customer: any) => T[] | null | undefined,
    assign: (nodes: T[]) => void,
    fallbackError: string,
  ): Promise<ApiResponse<T[]>> => {
    try {
      await refreshAuthToken();
      const { customer } = await query();
      if (!customer) return { success: false, error: fallbackError };

      const nodes = getNodes(customer) ?? [];
      assign(nodes);
      return { success: true, data: nodes };
    } catch (error: unknown) {
      return { success: false, error: getErrorMessage(error) };
    }
  };

  const navigateToLogin = (currentRoute?: string) => {
    const route = currentRoute || (import.meta.client ? window.location.pathname + window.location.search : '');
    if (route && route !== '/my-account') returnUrl.value = route;
    return navigateTo('/my-account');
  };

  const handlePostLoginRedirect = () => {
    if (returnUrl.value && returnUrl.value !== '/my-account') {
      const destination = returnUrl.value;
      returnUrl.value = null;
      return navigateTo(destination);
    }
    return null;
  };

  const loginUser = (credentials: CreateAccountInput): Promise<AuthResponse> =>
    withPending(async () => {
      try {
        await applyLoginSession((await GqlLogin(credentials)).login);
        return { success: true };
      } catch (error: unknown) {
        return authError(error, LOGIN_ERROR);
      }
    });

  const loginWithProvider = (state: string, code: string, provider: any): Promise<AuthResponse> =>
    withPending(async () => {
      try {
        const loggedIn = await applyLoginSession((await GqlLoginWithProvider({ input: { oauthResponse: { state, code }, provider } })).login);
        return loggedIn && viewer.value === null ? { success: false, error: OAUTH_LOGIN_ERROR } : { success: true };
      } catch (error: unknown) {
        return authError(error);
      }
    });

  const logoutUser = async (): Promise<AuthResponse> => {
    isPending.value = true;
    let errorMsg: string | undefined;

    try {
      try {
        const { logout } = await GqlLogout();
        if (!logout?.success) errorMsg = 'There was an error logging out. Your session was cleared locally.';
      } catch (error: unknown) {
        errorMsg = getErrorMessage(error);
      }

      // Clear all auth/session state synchronously first so the UI updates immediately.
      clearAuthSession();
      clearWooSession();
      clearAllCookies();
      resetAccountState();
      updateCart(null);

      // Navigate now — don't wait for refreshCart() first. refreshCart() can take 1-2s
      // and applyCartSnapshot could restore viewer state if a stale cookie survived.
      await router.push(router.currentRoute.value.path === '/my-account' ? '/my-account' : '/');

      // Fire-and-forget: get a fresh anonymous guest cart/session in the background.
      void refreshCart().catch(() => {});

      return errorMsg ? { success: false, error: errorMsg } : { success: true };
    } finally {
      isPending.value = false;
    }
  };

  const registerUser = (userInfo: RegisterCustomerInput): Promise<AuthResponse> =>
    withPending(async () => {
      try {
        await GqlRegisterCustomer({ input: userInfo });
        return { success: true };
      } catch (error: unknown) {
        return authError(error);
      }
    });

  const sendResetPasswordEmail = ({ username }: ResetPasswordEmailMutationVariables): Promise<AuthResponse> =>
    withPending(async () => {
      try {
        const { sendPasswordResetEmail } = await GqlResetPasswordEmail({ username });
        return sendPasswordResetEmail?.success
          ? { success: true }
          : { success: false, error: 'There was an error sending the reset password email. Please try again later.' };
      } catch (error: unknown) {
        return authError(error);
      }
    });

  const resetPasswordWithKey = ({ key, login, password }: ResetPasswordKeyMutationVariables): Promise<AuthResponse> =>
    withPending(async () => {
      try {
        const { resetUserPassword } = await GqlResetPasswordKey({ key, login, password });
        return resetUserPassword?.user?.id
          ? { success: true }
          : { success: false, error: 'There was an error resetting the password. Please try again later.' };
      } catch (error: unknown) {
        return authError(error);
      }
    });

  const getOrders = (): Promise<ApiResponse<Order[]>> =>
    loadCustomerCollection(
      () => GqlGetOrders(),
      (customer) => customer.orders?.nodes,
      (nodes) => {
        orders.value = nodes;
      },
      'There was an error getting your orders. Please try again later.',
    );

  const getDownloads = (): Promise<ApiResponse<DownloadableItem[]>> =>
    loadCustomerCollection(
      () => GqlGetDownloads(),
      (customer) => customer.downloadableItems?.nodes,
      (nodes) => {
        downloads.value = nodes;
      },
      'There was an error getting your downloads. Please try again later.',
    );

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
    navigateToLogin,
    handlePostLoginRedirect,
  };
};
