<script setup>
const { viewer } = useAuth();
</script>

<template>
  <NuxtLink to="/my-account/" :title="viewer?.username || 'Sign In'">
    <Icon name="ion:person-outline" size="20" />
  </NuxtLink>
</template>
