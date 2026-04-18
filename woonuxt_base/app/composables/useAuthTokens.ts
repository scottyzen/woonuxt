import type { LoginSession } from '#types/gql';

const REFRESH_TOKEN_COOKIE = 'auth-refresh-token';
const LEGACY_GQL_TOKEN_COOKIE = 'gql:default';
const REFRESH_BUFFER_SECONDS = 60;

let refreshInFlight: Promise<boolean> | null = null;

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

export const useAuthTokens = () => {
  const { getDomain } = useHelpers();
  const runtimeConfig = useRuntimeConfig();
  const authToken = useState<string | null>('authToken', () => null);
  const refreshToken = useCookie<string | null>(REFRESH_TOKEN_COOKIE, { path: '/' });
  const legacyGqlToken = useCookie<string | null>(LEGACY_GQL_TOKEN_COOKIE, { path: '/' });

  const now = () => Math.floor(Date.now() / 1000);
  const liveToken = () => {
    const token = authToken.value;
    return token && parseJwtExpiry(token) > now() ? token : null;
  };
  const reusableToken = () => {
    const token = liveToken();
    return token && parseJwtExpiry(token) > now() + REFRESH_BUFFER_SECONDS ? token : null;
  };

  const setActiveAuthToken = (token: string | null): void => {
    authToken.value = token;
    legacyGqlToken.value = null;
    useGqlToken(token);
    if (!token) useGqlHeaders({ Authorization: '' });
  };

  const clearActiveAuthToken = (): void => {
    setActiveAuthToken(null);
  };

  const clearAuthSession = (): void => {
    clearActiveAuthToken();
    refreshToken.value = null;
  };

  const setAuthSessionFromLogin = (payload?: LoginSession | null): void => {
    if (!payload?.authToken) return;
    refreshToken.value = payload.refreshToken ?? null;
    setActiveAuthToken(payload.authToken);
  };

  const requestRefreshedAuthToken = async (): Promise<string | null> => {
    if (!refreshToken.value) return null;

    const defaultClient = runtimeConfig.public?.['graphql-client']?.clients?.default;
    const endpoint = typeof defaultClient === 'string' ? defaultClient : defaultClient?.host;
    if (!endpoint) return null;

    const wooSession =
      import.meta.client
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
        ...(wooSession ? { 'woocommerce-session': `Session ${wooSession}` } : {}),
      },
      body: JSON.stringify({
        query: `mutation refreshToken($token: String!) {
          refreshToken(input: { refreshToken: $token }) {
            authToken
            success
          }
        }`,
        variables: { token: refreshToken.value },
        operationName: 'refreshToken',
      }),
    });

    const body = await response.json().catch(() => null);
    return body?.data?.refreshToken?.success ? (body.data.refreshToken.authToken ?? null) : null;
  };

  const refreshAuthToken = async (force = false): Promise<boolean> => {
    if (refreshInFlight) return refreshInFlight;
    if (!refreshToken.value) {
      if (!liveToken()) clearActiveAuthToken();
      return false;
    }
    if (!force && reusableToken()) return true;

    refreshInFlight = (async () => {
      try {
        const token = await requestRefreshedAuthToken();
        if (!token) {
          if (!liveToken()) clearActiveAuthToken();
          return false;
        }

        setActiveAuthToken(token);
        return true;
      } catch {
        if (!liveToken()) clearActiveAuthToken();
        return false;
      } finally {
        refreshInFlight = null;
      }
    })();

    return refreshInFlight;
  };

  const getAuthTokenForRequest = async (): Promise<string | null> => {
    legacyGqlToken.value = null;

    const token = reusableToken();
    if (token) {
      setActiveAuthToken(token);
      return token;
    }

    const refreshed = await refreshAuthToken();
    return refreshed ? authToken.value : liveToken();
  };

  if (authToken.value) {
    const token = liveToken();
    if (token) setActiveAuthToken(token);
    else clearActiveAuthToken();
  } else {
    legacyGqlToken.value = null;
  }

  return {
    refreshAuthToken,
    getAuthTokenForRequest,
    clearActiveAuthToken,
    clearAuthSession,
    setAuthSessionFromLogin,
  };
};
