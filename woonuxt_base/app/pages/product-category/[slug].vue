<script setup lang="ts">
defineNuxtRouteMiddleware((to) => {
  return navigateTo('/' + to.params.slug, { replace: true })
})
</script>

<template>
  <div />
</template>
