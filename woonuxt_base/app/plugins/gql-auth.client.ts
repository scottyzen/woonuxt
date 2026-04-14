export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('gql:auth:init', async ({ token }) => {
    const { getAuthTokenForRequest } = useAuth();
    token.value = (await getAuthTokenForRequest()) ?? undefined;
  });
});
