<template>
  <section class="h-full min-h-screen w-full relative">
    <!-- No Products Found  -->
    <div v-if="products.length == 0" class="flex flex-col p-8 items-center justify-center">
      <NuxtImg width="400" height="400" src="/images/empty.svg" />
      <span>No Products Found</span>
    </div>

    <!-- Products -->
    <transition-group v-else name="shrink" mode="in-out" class="my-4 min-h-[600px] grid transition-all gap-4 product-grid lg:my-8 lg:gap-8">
      <ProductCard class="w-full" v-for="(node, i) in newProducts" :key="node.databaseId" :node="node" :index="i" :page="page" />
    </transition-group>
  </section>
</template>

<script>
export default {
  props: {
    page: { type: Number, default: 1 },
    category: { type: String, default: null },
    products: { type: Array, default: null },
  },
  computed: {
    perPage() {
      return this.$config.perPage;
    },
    newProducts() {
      return this.products.slice(this.perPage * this.page - this.perPage, this.perPage * this.page);
    },
  },
};
</script>

<style lang="postcss">
.product-grid {
  grid-template-columns: repeat(2, 1fr);
}

@media (min-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
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
.shrink-leave-to {
  opacity: 0;
  transform: scale(0.75) translateY(25%);
}

.pagination {
  @apply flex mb-8 p-8 gap-2 items-center justify-center;
}

.pagination button {
  @apply rounded-xl bg-purple-100 leading-none py-2 px-4 text-purple-900 hover: bg-purple-200 ;
}
</style>
