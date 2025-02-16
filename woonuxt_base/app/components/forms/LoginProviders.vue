<script setup lang="ts">
const props = defineProps({
  loginClients: { type: Object as PropType<LoginClients>, default: [] },
});

const route = useRoute();
const router = useRouter();
const { loginWithProvider } = useAuth();
const { storeSettings } = useAppConfig();
const loading = ref(true);

watch(
  () => props.loginClients,
  () => {
    loading.value = false;
  },
);

const { provider, code, state } = route.query as { provider?: string; code?: string; state?: string };
if (code && state && provider) {
  loginWithProvider(state, code, provider.toUpperCase())
    .then(() => {
      router.replace({ query: {} });
    })
    .catch((error) => {
      console.error('Login failed:', error);
    });
}

const getIcon = (provider: any) => {
  switch (provider) {
    case 'FACEBOOK':
      return 'ion:logo-facebook';
    case 'GITHUB':
      return 'ion:logo-github';
    case 'GOOGLE':
      return 'ion:logo-google';
    case 'INSTAGRAM':
      return 'ion:logo-instagram';
    case 'LINKEDIN':
      return 'ion:logo-linkedin';
    default:
      return 'ion:log-in';
  }
};

const socialLoginsDisplay = storeSettings?.socialLoginsDisplay || 'buttons';
const socialLoginProviders = computed(() => props?.loginClients?.filter((loginClient) => loginClient?.provider !== 'PASSWORD'));

const labelFallback = (provider?: any) => {
  if (!provider) return 'Login';
  return `Login with ${provider.charAt(0).toUpperCase() + provider.slice(1).toLowerCase()}`;
};
</script>

<template>
  <div v-if="socialLoginProviders?.length && !loading">
    <div class="gap-4" :class="socialLoginsDisplay === 'buttons' ? 'grid grid-cols-2 gap-4' : ' flex gap-4 flex-wrap justify-center'">
      <div v-for="(loginClient, index) in socialLoginProviders" :key="index">
        <NuxtLink
          v-if="loginClient && loginClient?.authorizationUrl"
          :to="loginClient?.authorizationUrl"
          class="flex items-center justify-center gap-2 p-3 bg-white rounded-lg shadow-sm hover:shadow transition duration-100 ease-in-out">
          <Icon :name="getIcon(loginClient.provider)" size="20" />
          <span v-if="socialLoginsDisplay === 'buttons'">{{ loginClient.name || labelFallback(loginClient.provider) }}</span>
        </NuxtLink>
      </div>
    </div>

    <!-- or continue with email -->
    <div class="flex items-center justify-center gap-4 my-8 leading-none">
      <div class="border-b w-1/3 flex-1"></div>
      <div class="text-gray-400">{{ $t('messages.account.orContinueWithEmail') }}</div>
      <div class="border-b w-1/3 flex-1"></div>
    </div>
  </div>
</template>

<style scoped></style>
