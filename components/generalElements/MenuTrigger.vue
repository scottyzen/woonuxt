<script setup>
const { toggleMobileMenu } = useHelpers();
</script>

<template>
  <div>
    <Icon name="ion:menu-outline" size="26" class="cursor-pointer -my-1 mr-4" @click="toggleMobileMenu" />
  </div>
</template>
