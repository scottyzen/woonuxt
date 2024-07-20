<script lang="ts" setup>
const { viewer } = useAuth();
const router = useRouter();
if (viewer.value) router.push(`my-account?tab=wishlist`);
</script>

<template>
  <WishList />
</template>
