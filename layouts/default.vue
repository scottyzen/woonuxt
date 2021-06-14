<template>
  <div class="px-4">
    <Header />
    <!-- <transition name="page" mode="out-in"> -->
    <Nuxt />
    <!-- </transition> -->
  </div>
</template>

<style>
/* .page-enter-active,
.page-leave-active {
  transition: opacity 0.5s;
}
.page-enter,
.page-leave-active {
  opacity: 0;
} */
.layout-enter-active,
.layout-leave-active {
  transition: all 300ms ease-out;
  will-change: opacity, transform;
}
.layout-enter,
.layout-leave-active {
  opacity: 0;
  transform: scale(0);
}
</style>
