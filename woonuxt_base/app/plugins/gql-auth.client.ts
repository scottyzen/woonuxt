export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('gql:auth:init', async ({ token }) => {
    const { getAuthTokenForRequest } = useAuthTokens();
    token.value = (await getAuthTokenForRequest()) ?? undefined;
  });
});
