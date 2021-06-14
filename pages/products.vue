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
  </main>
</template>

<style>
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
