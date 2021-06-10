<template>
  <div class="px-4">
    <Header />
    <transition class="bg-gray-200" name="page" mode="out-in">
      <Nuxt />
    </transition>
  </div>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.5s;
}
.page-enter,
.page-leave-active {
  opacity: 0;
}
</style>
