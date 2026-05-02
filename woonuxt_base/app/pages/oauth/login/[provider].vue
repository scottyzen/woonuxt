<script setup lang="ts">
const route = useRoute();
const router = useRouter();

const { cart } = useCart();
const { viewer, handlePostLoginRedirect } = useAuth();
const showLoader = computed(() => !cart.value && !viewer.value);

const provider = route.params.provider as string;

const code = route.query.code as string;
const state = route.query.state as string;
const error = route.query.error as string;

if (code && state && provider && !error) {
  // Try to use stored return URL, otherwise go to my-account
  const redirectResult = handlePostLoginRedirect();
  if (!redirectResult) {
    router.push({ name: 'my-account', query: { ...route.query, provider } });
  }
} else {
  router.push('/my-account');
}
</script>

<template>
  <div class="container min-h-[600px]">
    <div v-if="showLoader" class="flex flex-col min-h-[500px]">
      <LoadingIcon class="m-auto" />
    </div>
  </div>
</template>
