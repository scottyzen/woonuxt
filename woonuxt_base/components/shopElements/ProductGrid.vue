<script setup lang="ts">
const route = useRoute();
const { products } = await useProducts();
const runtimeConfig = useRuntimeConfig();
const productsPerPage = runtimeConfig.public.PRODUCTS_PER_PAGE || 24;
const page = ref(parseInt(route.params.pageNumber as string) || 1);
</script>

<template>
  <section class="relative w-full">
    <TransitionGroup name="shrink" tag="div" mode="in-out" class="my-4 min-h-[600px] grid transition-all gap-8 product-grid lg:my-8">
      <ProductCard v-for="(node, i) in products.slice((page - 1) * productsPerPage, page * productsPerPage)" :key="node.databaseId || i" :node="node" :index="i" />
    </TransitionGroup>

    <Pagination />
  </section>
</template>

<style lang="postcss">
.product-grid {
  grid-template-columns: repeat(2, 1fr);
}

@media (min-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  }
}

.shrink-move {
  transition: all 500ms;
}

.shrink-leave-active {
  transition: transform 300ms;
  position: absolute;
  opacity: 0;
}

.shrink-enter-active {
  transition: opacity 500ms ease-out 250ms, transform 500ms ease-out;
  will-change: opacity, transform;
}

.shrink-enter,
.shrink-leave-to,
.shrink-enter-from {
  opacity: 0;
  transform: scale(0.75) translateY(25%);
}

.pagination {
  @apply flex mb-8 p-8 gap-2 items-center justify-center;
}
</style>
