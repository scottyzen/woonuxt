import type {
  ApiResponse,
  AuthResponse,
  CreateAccountInput,
  Customer,
  DownloadableItem,
  LoginClient,
  LoginInput,
  Order,
  RegisterCustomerInput,
  ResetPasswordEmailMutationVariables,
  ResetPasswordKeyMutationVariables,
  Viewer,
} from '#types/gql';

let refreshInFlight: Promise<boolean> | null = null;
const LEGACY_GQL_TOKEN_COOKIE = 'gql:default';
const AUTH_TOKEN_COOKIE = 'auth-token';
const REFRESH_TOKEN_COOKIE = 'auth-refresh-token';
const AUTH_TOKEN_EXPIRES_AT_COOKIE = 'auth-token-expires-at';

export const useAuth = () => {
  const parseUnix = (value?: string | number | null): number => {
    if (typeof value === 'number') return value;
    if (!value) return 0;
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const parseJwtExpiry = (token?: string | null): number => {
    if (!token) return 0;

    try {
      const [, payload] = token.split('.');
      if (!payload) return 0;
      const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
      const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
      const decoded =
        import.meta.client ? JSON.parse(window.atob(padded)) : JSON.parse(Buffer.from(padded, 'base64').toString('utf-8'));
      return typeof decoded?.exp === 'number' ? decoded.exp : 0;
    } catch {
      return 0;
    }
  };

  const { refreshCart, updateCart } = useCart();
  const { clearAllCookies, getDomain, getErrorMessage } = useHelpers();
  const router = useRouter();
  const runtimeConfig = useRuntimeConfig();

  const authTokenCookie = useCookie<string | null>(AUTH_TOKEN_COOKIE, { path: '/' });
  const refreshTokenCookie = useCookie<string | null>(REFRESH_TOKEN_COOKIE, { path: '/' });
  const authTokenExpiresAtCookie = useCookie<string | null>(AUTH_TOKEN_EXPIRES_AT_COOKIE, { path: '/' });
  const legacyGqlTokenCookie = useCookie<string | null>(LEGACY_GQL_TOKEN_COOKIE, { path: '/' });

  const customer = useState<Customer>('customer', () => ({ billing: {}, shipping: {} }));
  const viewer = useState<Viewer | null>('viewer', () => null);
  const isPending = useState<boolean>('isPending', () => false);
  const orders = useState<Order[] | null>('orders', () => null);
  const downloads = useState<DownloadableItem[] | null>('downloads', () => null);
  const loginClients = useState<LoginClient[] | null>('loginClients', () => null);
  const returnUrl = useState<string | null>('loginReturnUrl', () => null);
  const authToken = useState<string | null>('authToken', () => authTokenCookie.value ?? null);
  const authTokenExpiresAt = useState<number>('authTokenExpiresAt', () => parseUnix(authTokenExpiresAtCookie.value) || parseJwtExpiry(authTokenCookie.value));
  const refreshToken = useState<string | null>('authRefreshToken', () => refreshTokenCookie.value ?? null);

  if (authTokenExpiresAt.value && authTokenExpiresAt.value <= Math.floor(Date.now() / 1000) && authTokenCookie.value) {
    authToken.value = null;
    authTokenCookie.value = null;
    legacyGqlTokenCookie.value = null;
    useGqlToken(null);
    useGqlHeaders({ Authorization: '' });
  }

  const syncGraphqlAuth = (token: string | null): void => {
    authToken.value = token;
    authTokenCookie.value = token;
    legacyGqlTokenCookie.value = null;
    useGqlToken(token);
    if (!token) useGqlHeaders({ Authorization: '' });
  };

  if (authToken.value) {
    syncGraphqlAuth(authToken.value);
  }

  const persistAuthSession = (): void => {
    authTokenCookie.value = authToken.value;
    refreshTokenCookie.value = refreshToken.value;
    authTokenExpiresAtCookie.value = authTokenExpiresAt.value ? String(authTokenExpiresAt.value) : null;
    legacyGqlTokenCookie.value = null;
  };

  const clearActiveAuthToken = (): void => {
    syncGraphqlAuth(null);
    authTokenExpiresAt.value = 0;
    authTokenExpiresAtCookie.value = null;
  };

  const clearAuthSession = (): void => {
    clearActiveAuthToken();
    refreshToken.value = null;
    persistAuthSession();
  };

  const setAuthSessionFromLogin = (payload: any): void => {
    if (!payload?.authToken) return;

    syncGraphqlAuth(payload.authToken);
    authTokenExpiresAt.value = parseUnix(payload.authTokenExpiration);
    refreshToken.value = payload.refreshToken ?? null;
    persistAuthSession();
  };

  const requestRefreshedAuthToken = async (
    token: string,
  ): Promise<{ authToken?: string | null; authTokenExpiration?: string | number | null; success?: boolean } | null> => {
    const defaultClient = runtimeConfig.public?.['graphql-client']?.clients?.default;
    const endpoint = typeof defaultClient === 'string' ? defaultClient : defaultClient?.host;
    if (!endpoint) return null;

    const sessionCookie = import.meta.client
      ? useCookie<string | null>('woocommerce-session', { domain: getDomain(window.location.href), path: '/' }).value ||
        useCookie<string | null>('woocommerce-session', { path: '/' }).value
      : null;

    const response = await fetch(endpoint, {
      method: 'POST',
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/graphql-response+json, application/json',
        ...(sessionCookie ? { 'woocommerce-session': `Session ${sessionCookie}` } : {}),
      },
      body: JSON.stringify({
        query: `mutation refreshToken($token: String!) { refreshToken(input: { refreshToken: $token }) { authToken authTokenExpiration success } }`,
        variables: { token },
        operationName: 'refreshToken',
      }),
    });

    const body = await response.json().catch(() => null);
    return body?.data?.refreshToken ?? null;
  };

  const refreshAuthToken = async (force = false): Promise<boolean> => {
    if (refreshInFlight) return await refreshInFlight;

    const currentRefreshToken = refreshToken.value;
    if (!currentRefreshToken) return false;
    const hasAuthToken = !!authToken.value;

    const now = Math.floor(Date.now() / 1000);
    const remainingSeconds = authTokenExpiresAt.value - now;
    if (!force && hasAuthToken && authTokenExpiresAt.value && remainingSeconds > 60) return true;

    refreshInFlight = (async () => {
      try {
        const refreshed = await requestRefreshedAuthToken(currentRefreshToken);
        if (!refreshed?.success || !refreshed?.authToken) {
          if (authTokenExpiresAt.value && authTokenExpiresAt.value <= now) {
            clearActiveAuthToken();
          }
          return false;
        }

        syncGraphqlAuth(refreshed.authToken);
        authTokenExpiresAt.value = parseUnix((refreshed as any).authTokenExpiration) || now + 240;
        persistAuthSession();
        return true;
      } catch {
        if (authTokenExpiresAt.value && authTokenExpiresAt.value <= now) {
          clearActiveAuthToken();
        }
        return false;
      } finally {
        refreshInFlight = null;
      }
    })();

    return await refreshInFlight;
  };

  const getAuthTokenForRequest = async (): Promise<string | null> => {
    const now = Math.floor(Date.now() / 1000);

    if (!authToken.value && refreshToken.value) {
      await refreshAuthToken();
      return authToken.value;
    }

    if (authTokenExpiresAt.value && authTokenExpiresAt.value <= now + 60) {
      await refreshAuthToken();
    }

    return authToken.value;
  };

  // Store the URL to redirect to after login
  const setReturnUrl = (url: string) => {
    returnUrl.value = url;
  };

  const getReturnUrl = (): string | null => {
    return returnUrl.value;
  };

  const clearReturnUrl = () => {
    returnUrl.value = null;
  };

  // High-level function to handle navigation to login page
  const navigateToLogin = (currentRoute?: string) => {
    const route = currentRoute || (typeof window !== 'undefined' ? window.location.pathname + window.location.search : '');

    // Only store return URL if it's not already the login page
    if (route && route !== '/my-account') {
      setReturnUrl(route);
    }

    // Navigate to login page
    return navigateTo('/my-account');
  };

  // High-level function to handle post-login redirect
  const handlePostLoginRedirect = () => {
    const returnUrl = getReturnUrl();
    if (returnUrl && returnUrl !== '/my-account') {
      clearReturnUrl();
      return navigateTo(returnUrl);
    }
    return null;
  };

  // Log in the user
  const loginUser = async (credentials: CreateAccountInput): Promise<AuthResponse> => {
    isPending.value = true;

    try {
      const { login } = await GqlLogin(credentials);
      if (login?.user && login?.authToken) {
        setAuthSessionFromLogin(login as any);
        await refreshCart();
      }

      isPending.value = false;
      return {
        success: true,
      };
    } catch (error: unknown) {
      const errorMsg = getErrorMessage(error);

      return {
        success: false,
        error: errorMsg || 'There was an error logging in. Please try again.',
      };
    } finally {
      isPending.value = false;
    }
  };

  const loginWithProvider = async (state: string, code: string, provider: any): Promise<AuthResponse> => {
    isPending.value = true;

    try {
      const input: LoginInput = { oauthResponse: { state, code }, provider };
      const response = await GqlLoginWithProvider({ input });
      if (response.login?.authToken) {
        setAuthSessionFromLogin(response.login as any);
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
      };
    } catch (error: unknown) {
      const errorMsg = getErrorMessage(error);

      return {
        success: false,
        error: errorMsg,
      };
    } finally {
      isPending.value = false;
    }
  };

  // Log out the user
  async function logoutUser(): Promise<AuthResponse> {
    isPending.value = true;
    let errorMsg: string | undefined;

    try {
      const { logout } = await GqlLogout();
      if (!logout?.success) {
        errorMsg = 'There was an error logging out. Your session was cleared locally.';
      }
    } catch (error: unknown) {
      errorMsg = getErrorMessage(error);
    }

    try {
      // Clear auth token/header before refreshing cart to avoid stale auth state.
      clearAuthSession();
      useGqlHeaders({ Authorization: '', 'woocommerce-session': '' });

      if (import.meta.client) {
        useCookie<string | null>('woocommerce-session', { path: '/' }).value = null;
        const domain = getDomain(window.location.href);
        if (domain) {
          useCookie<string | null>('woocommerce-session', { domain, path: '/' }).value = null;
        }
      }

      clearAllCookies();
      clearReturnUrl();

      orders.value = null;
      downloads.value = null;
      updateCustomer({ billing: {}, shipping: {} } as Customer);
      updateViewer(null);

      const refreshed = await refreshCart();
      if (!refreshed) updateCart(null);

      if (errorMsg) {
        return { success: false, error: errorMsg };
      }

      return { success: true };
    } finally {
      isPending.value = false;
      if (router.currentRoute.value.path === '/my-account' && viewer.value === null) {
        await router.push('/my-account');
      } else {
        await router.push('/');
      }
    }
  }

  async function registerUser(userInfo: RegisterCustomerInput): Promise<AuthResponse> {
    isPending.value = true;
    try {
      await GqlRegisterCustomer({ input: userInfo });
      return { success: true };
    } catch (error: unknown) {
      const errorMsg = getErrorMessage(error);
      return { success: false, error: errorMsg };
    } finally {
      isPending.value = false;
    }
  }

  // Update the user state
  const updateCustomer = (payload: Customer): void => {
    const sessionToken = payload?.sessionToken;
    if (sessionToken) {
      useGqlHeaders({ 'woocommerce-session': `Session ${sessionToken}` });
      const domain = import.meta.client ? getDomain(window.location.href) : '';
      const cookieOptions = domain ? { domain, path: '/' } : { path: '/' };
      const newToken = useCookie<string | null>('woocommerce-session', cookieOptions);
      newToken.value = sessionToken;
    }
    customer.value = payload;
    isPending.value = false;
  };

  const updateViewer = (payload: Viewer | null): void => {
    viewer.value = payload;
    isPending.value = false;
  };

  const sendResetPasswordEmail = async ({ username }: ResetPasswordEmailMutationVariables): Promise<AuthResponse> => {
    try {
      isPending.value = true;
      const { sendPasswordResetEmail } = await GqlResetPasswordEmail({ username });
      if (sendPasswordResetEmail?.success) {
        isPending.value = false;
        return { success: true };
      }
      return { success: false, error: 'There was an error sending the reset password email. Please try again later.' };
    } catch (error: unknown) {
      const errorMsg = getErrorMessage(error);
      isPending.value = false;
      return { success: false, error: errorMsg };
    }
  };

  const resetPasswordWithKey = async ({ key, login, password }: ResetPasswordKeyMutationVariables): Promise<AuthResponse> => {
    try {
      isPending.value = true;
      const { resetUserPassword } = await GqlResetPasswordKey({ key, login, password });
      const wasPasswordReset = Boolean(resetUserPassword?.user?.id);
      if (wasPasswordReset) {
        isPending.value = false;
        return { success: true };
      }
      return { success: false, error: 'There was an error resetting the password. Please try again later.' };
    } catch (error: unknown) {
      isPending.value = false;
      return { success: false, error: getErrorMessage(error) };
    }
  };

  const getOrders = async (): Promise<ApiResponse<Order[]>> => {
    try {
      await refreshAuthToken();
      const { customer } = await GqlGetOrders();
      if (customer) {
        const orderNodes = customer.orders?.nodes ?? [];
        orders.value = orderNodes;
        return { success: true, data: orderNodes };
      }
      return { success: false, error: 'There was an error getting your orders. Please try again later.' };
    } catch (error: unknown) {
      const errorMsg = getErrorMessage(error);
      return { success: false, error: errorMsg };
    }
  };

  const getDownloads = async (): Promise<ApiResponse<DownloadableItem[]>> => {
    try {
      await refreshAuthToken();
      const { customer } = await GqlGetDownloads();
      if (customer) {
        const downloadNodes = customer.downloadableItems?.nodes ?? [];
        downloads.value = downloadNodes;
        return { success: true, data: downloadNodes };
      }
      return { success: false, error: 'There was an error getting your downloads. Please try again later.' };
    } catch (error: unknown) {
      const errorMsg = getErrorMessage(error);
      return { success: false, error: errorMsg };
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
    refreshAuthToken,
    getAuthTokenForRequest,
    clearActiveAuthToken,
    clearAuthSession,
    updateLoginClients,
    navigateToLogin,
    handlePostLoginRedirect,
  };
};
