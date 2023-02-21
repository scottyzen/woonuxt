<script setup>
const { isShowingMobileMenu, toggleMobileMenu } = useHelpers();
</script>

<template>
  <Icon name="ion:menu-outline" size="26" class="cursor-pointer -my-1 mr-4" @click="toggleMobileMenu" />
</template>
