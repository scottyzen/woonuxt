import { GraphQLClient, type RequestOptions } from 'graphql-request';
import { ref, type Ref } from 'vue';
import type { AsyncDataOptions } from 'nuxt/app';
import { getSdk, type Sdk, type SdkFunctionWrapper } from '#gql/default';

type RuntimeGraphQLClientConfig = {
  host?: string;
  headers?: Record<string, string | undefined>;
  fetchOptions?: {
    credentials?: RequestCredentials;
    mode?: RequestMode;
  };
};

type RuntimeGraphQLConfig = {
  clients?: {
    default?: RuntimeGraphQLClientConfig | string;
  };
};

type GqlHeaderInput = Record<string, string | null | undefined>;
type GqlHeaders = Record<string, string>;
type GqlErrorHandler = (error: unknown) => void;
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
type GqlErrorRecord = {
  gqlErrors?: unknown;
  response?: {
    errors?: unknown;
    data?: {
      errors?: unknown;
      data?: {
        errors?: unknown;
      };
    };
  };
  data?: {
    errors?: unknown;
  };
};

const errorHandlers = new Set<GqlErrorHandler>();

const cleanHeaders = (headers: GqlHeaderInput): GqlHeaders => {
  return Object.entries(headers).reduce<GqlHeaders>((acc, [key, value]) => {
    if (typeof value === 'string' && value.length > 0) acc[key] = value;
    return acc;
  }, {});
};

const headersToRecord = (headers?: GraphQLClientRequestHeaders): GqlHeaders => {
  if (!headers) return {};
  return Object.fromEntries(new Headers(headers).entries());
};

const useGqlHeaderState = () => useState<GqlHeaders>('woonuxt:gql:headers', () => ({}));

const getRuntimeClientConfig = (): RuntimeGraphQLClientConfig => {
  const runtimeConfig = useRuntimeConfig();
  const gqlConfig = runtimeConfig.public?.['graphql-client' as keyof typeof runtimeConfig.public] as RuntimeGraphQLConfig | undefined;
  const defaultClient = gqlConfig?.clients?.default;

  if (typeof defaultClient === 'string') return { host: defaultClient };
  return defaultClient ?? {};
};

const getGraphQLEndpoint = (): string => {
  const endpoint = getRuntimeClientConfig().host;
  if (!endpoint) throw new Error('GraphQL endpoint is not configured. Set GQL_HOST in your environment.');
  return endpoint;
};

const getBaseHeaders = (): GqlHeaders => {
  return cleanHeaders(getRuntimeClientConfig().headers ?? {});
};

const getRequestHeaders = async ({
  nuxtApp,
  baseHeaders,
  headerState,
  requestHeaders,
}: {
  nuxtApp: ReturnType<typeof useNuxtApp>;
  baseHeaders: GqlHeaders;
  headerState: Ref<GqlHeaders>;
  requestHeaders?: GraphQLClientRequestHeaders;
}): Promise<GqlHeaders> => {
  const token = ref<string | undefined>();
  await nuxtApp.callHook('gql:auth:init', { client: 'default', token });

  return cleanHeaders({
    ...baseHeaders,
    ...headerState.value,
    ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
    ...headersToRecord(requestHeaders),
  });
};

const notifyGqlError = (error: unknown): void => {
  for (const handler of errorHandlers) {
    try {
      handler(error);
    } catch (handlerError) {
      console.error('[woonuxt] GraphQL error handler failed', handlerError);
    }
  }
};

export const normalizeGqlError = <T>(error: T): T => {
  if (!error || typeof error !== 'object') return error;

  const writableError = error as GqlErrorRecord;
  const gqlErrors =
    writableError.gqlErrors ??
    writableError.response?.errors ??
    writableError.response?.data?.errors ??
    writableError.response?.data?.data?.errors ??
    writableError.data?.errors;

  if (Array.isArray(gqlErrors) && !writableError.gqlErrors) {
    writableError.gqlErrors = gqlErrors;
  }

  return error;
};

export const useGqlHeaders = (headers: GqlHeaderInput): void => {
  const currentHeaders = useGqlHeaderState();

  for (const [key, value] of Object.entries(headers)) {
    if (typeof value === 'string' && value.length > 0) {
      currentHeaders.value[key] = value;
    } else {
      Reflect.deleteProperty(currentHeaders.value, key);
    }
  }
};

export const useGqlToken = ({ token, config }: { token?: string | null; config?: { name?: string; type?: string } }): void => {
  const headerName = config?.name || 'Authorization';
  const tokenType = config?.type || 'Bearer';
  useGqlHeaders({ [headerName]: token ? `${tokenType} ${token}` : '' });
};

export const useGqlError = (handler: GqlErrorHandler): (() => void) => {
  errorHandlers.add(handler);
  return () => errorHandlers.delete(handler);
};

export const useWooGraphQL = (): Sdk => {
  const nuxtApp = useNuxtApp();
  const headerState = useGqlHeaderState();
  const clientConfig = getRuntimeClientConfig();
  const baseHeaders = getBaseHeaders();
  const client = new GraphQLClient(getGraphQLEndpoint(), {
    credentials: clientConfig.fetchOptions?.credentials ?? 'include',
    mode: clientConfig.fetchOptions?.mode ?? 'cors',
    headers: baseHeaders,
  });

  const wrapper: SdkFunctionWrapper = async (action, _operationName, _operationType, _variables) => {
    try {
      return await action(
        await getRequestHeaders({
          nuxtApp,
          baseHeaders,
          headerState,
        }),
      );
    } catch (error) {
      const normalizedError = normalizeGqlError(error);
      notifyGqlError(normalizedError);
      throw normalizedError;
    }
  };

  return getSdk(client, wrapper);
};

export const useAsyncGql = <TMethod extends keyof Sdk>(
  operation: TMethod,
  variables?: Parameters<Sdk[TMethod]>[0],
  options?: {
    requestHeaders?: Parameters<Sdk[TMethod]>[1];
    asyncDataOptions?: AsyncDataOptions<Awaited<ReturnType<Sdk[TMethod]>>>;
  },
) => {
  const key = `gql:${String(operation)}:${JSON.stringify(variables ?? {})}`;
  const gql = useWooGraphQL();
  const method = gql[operation] as (...args: unknown[]) => Promise<Awaited<ReturnType<Sdk[TMethod]>>>;

  return useAsyncData<Awaited<ReturnType<Sdk[TMethod]>>>(key, () => method(variables, options?.requestHeaders), options?.asyncDataOptions);
};
