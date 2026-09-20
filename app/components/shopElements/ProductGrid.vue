<script setup lang="ts">
import ProductCard from '../productElements/ProductCard.vue';

const route = useRoute();
const { productsPerPage } = useHelpers();
const { products } = useProducts();
const page = computed(() => Number.parseInt(route.params.pageNumber as string) || 1);
const productsToShow = computed(() => products.value.slice((page.value - 1) * productsPerPage, page.value * productsPerPage));
</script>

<template>
  <Transition name="fade" mode="out-in">
    <section v-if="products.length" class="relative w-full">
      <TransitionGroup name="shrink" tag="div" mode="in-out" class="product-grid">
        <ProductCard v-for="(node, i) in productsToShow" :key="node.id || i" :node :index="i" />
      </TransitionGroup>
      <Pagination />
    </section>
    <NoProductsFound v-else />
  </Transition>
</template>

<style scoped>
.product-grid { display: grid; min-height: 9.375rem; gap: 1.25rem; margin-block: 1rem; transition: all .2s ease; grid-template-columns: repeat(2, minmax(0, 1fr)); }
@media (min-width: 768px) { .product-grid { margin-block: 2rem; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); } }
.shrink-move { transition: all 400ms; }
.shrink-leave-active { position: absolute; opacity: 0; transition: transform 300ms; }
.shrink-enter-active { transition: opacity 400ms ease-out 200ms, transform 400ms ease-out; }
.shrink-enter-from, .shrink-leave-to { opacity: 0; transform: scale(.75) translateY(25%); }
</style>
