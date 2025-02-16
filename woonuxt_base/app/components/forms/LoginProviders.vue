<script setup lang="ts">
import { LoginProviderEnum } from '#woo';
const { loginClients, loginWithProvider } = useAuth();

const route = useRoute();
const router = useRouter();
const { storeSettings } = useAppConfig();

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

const providerIcons = {
  FACEBOOK: 'ion:logo-facebook',
  GITHUB: 'ion:logo-github',
  GOOGLE: 'ion:logo-google',
  INSTAGRAM: 'ion:logo-instagram',
  LINKEDIN: 'ion:logo-linkedin',
};

const socialLoginsDisplay = storeSettings?.socialLoginsDisplay || 'buttons';
const socialLoginProviders = computed(
  () => loginClients.value?.filter((loginClient: LoginClient) => loginClient?.provider !== LoginProviderEnum.PASSWORD) || [],
);

const labelFallback = (provider?: LoginProviderEnum | null) => {
  if (!provider) return 'Login';
  return `Login with ${provider.charAt(0).toUpperCase() + provider.slice(1).toLowerCase()}`;
};
</script>

<template>
  <div v-if="socialLoginProviders?.length">
    <div
      class="gap-4"
      :class="
        socialLoginsDisplay === 'buttons' ? 'grid gap-4 grid-cols-[repeat(auto-fit,minmax(180px,1fr))] justify-center' : ' flex gap-4 flex-wrap justify-center'
      ">
      <div v-for="(loginClient, index) in socialLoginProviders" :key="index">
        <NuxtLink
          v-if="loginClient && loginClient?.authorizationUrl"
          :to="loginClient?.authorizationUrl"
          class="flex items-center justify-center gap-3 p-3 bg-white rounded-lg shadow-sm hover:shadow transition duration-100 ease-in-out">
          <Icon v-if="loginClient.provider" :name="providerIcons[loginClient.provider as keyof typeof providerIcons]" size="20" />
          <icon v-else name="ion:log-in" size="20" />
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
