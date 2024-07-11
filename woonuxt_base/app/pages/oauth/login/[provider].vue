<script setup lang="ts">
const route = useRoute();
const router = useRouter();

const provider = route.params.provider as string;

const code = route.query.code as string;
const state = route.query.state as string;

if (code && state && provider) {
  router.push({ name: 'my-account', query: { ...route.query, provider } });
}
</script>

<template>
  <div class="container min-h-[600px]">
    <div v-if="showLoader" class="flex flex-col min-h-[500px]">
      <LoadingIcon class="m-auto" />
    </div>
  </div>
</template>