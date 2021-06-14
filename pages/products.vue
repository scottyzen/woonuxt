<template>
  <main class="container">
    <transition-group
      class="grid grid-cols-2 gap-4 my-12 lg:grid-cols-4"
      name="layout"
      tag="section"
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
