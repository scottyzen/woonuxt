<script setup lang="ts">
const props = defineProps({
  loginClients: { type: Object as PropType<LoginClients>, default: [] },
});

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

const route = useRoute();
const router = useRouter();
const { loginWithProvider } = useAuth();

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
</script>

<template>
  <div class="flex justify-center items-center pt-4">
    <div v-for="(loginClient, index) in props.loginClients" :key="index">
      <NuxtLink v-if="loginClient && loginClient?.authorizationUrl" :to="loginClient?.authorizationUrl">
        <Icon :name="getIcon(loginClient.provider)" size="56" class="mx-6" />
      </NuxtLink>
    </div>
  </div>
</template>
  
