<template>
  <div>
    <Header />
    <transition name="page" mode="out-in">
      <Nuxt />
    </transition>
  </div>
</template>

<style lang="postcss">
.page-enter-active,
.page-leave-active {
  transition: opacity 0.5s;
}
.page-enter,
.page-leave-active {
  opacity: 0;
}
body {
  @apply bg-gray-50;
}
</style>
