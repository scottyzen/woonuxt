<script setup lang="ts">
const { viewer } = useAuth();
const linkTitle = computed(() => (viewer.value ? viewer.value.username : 'Sign In'));
</script>

<template>
  <NuxtLink to="/my-account" :title="linkTitle">
    <Icon name="ion:person-outline" size="20" />
  </NuxtLink>
</template>
