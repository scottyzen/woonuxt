<template>
  <main class="container">
    <transition-group
      class="grid grid-cols-2 gap-4 my-12 lg:grid-cols-4"
      name="layout"
      tag="ul"
      mode="out-in"
    >
      <ProductCard
        v-for="node in $store.state.products"
        :key="node.databaseId"
        :node="node"
      />
    </transition-group>
    <div>
      Test Image
      <nuxt-img
        class="w-full mb-2"
        src="https://testing.2cubedtest.com/wp-content/uploads/2019/01/logo-1.jpg"
        format="webp"
        fit="cover"
        width="200"
        provider="static"
        height="200"
        sizes="xs:296px sm:296px md:376px lg:400px"
        loading="lazy"
        quality="95"
      />
    </div>
  </main>
</template>

<style>
.layout-enter-active,
.layout-leave-active {
  transition: all 300ms ease;
  will-change: opacity, transform;
}
.layout-enter,
.layout-leave-active {
  opacity: 0;
  transform: scale(0);
}
</style>
