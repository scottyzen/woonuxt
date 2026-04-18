export default defineNuxtPlugin((nuxtApp) => {
  const { getAuthTokenForRequest } = useAuthTokens();

  nuxtApp.hook('gql:auth:init', async ({ token }) => {
    token.value = (await getAuthTokenForRequest()) ?? undefined;
  });
});
