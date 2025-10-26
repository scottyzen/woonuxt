// woonuxt_base/app/pages/product-category/[slug].vue
<script setup lang="ts">
defineNuxtRouteMiddleware((to) => {
  return navigateTo('/' + to.params.slug, { replace: true })
})
</script>

<template>
  <div />
</template>
