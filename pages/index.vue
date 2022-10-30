<template>
  <div>
    <HeroBanner />

    <div class="container flex flex-wrap my-16 text-center gap-8 justify-center brand items-center lg:justify-between">
      <NuxtImg src="/images/logoipsum-211.svg" alt="Brand 1" width="132" height="35" />
      <NuxtImg src="/images/logoipsum-221.svg" alt="Brand 2" width="119" height="30" />
      <NuxtImg src="/images/logoipsum-225.svg" alt="Brand 3" width="49" height="48" />
      <NuxtImg src="/images/logoipsum-280.svg" alt="Brand 4" width="78" height="30" />
      <NuxtImg src="/images/logoipsum-284.svg" alt="Brand 5" width="70" height="44" />
      <NuxtImg src="/images/logoipsum-215.svg" alt="Brand 6" width="132" height="40" />
    </div>

    <section class="container my-16">
      <div class=" flex items-end justify-between">
        <h2 class="font-semibold text-lg md:text-2xl">Shop by category</h2>
        <NuxtLink class="text-primary" to="/categories">View All</NuxtLink>
      </div>
      <div class=" mt-8 grid gap-4 grid-cols-2 justify-center md:grid-cols-3 lg:grid-cols-6">
        <CategoryCard class="w-full" v-for="(category, i) in productCategories.nodes" :key="i" :node="category" />
      </div>

    </section>

    <section class="my-16 md:my-24">
      <div class="container flex items-end justify-between">
        <h2 class="font-semibold text-lg md:text-2xl">Best Sellers</h2>
        <NuxtLink class="text-primary" to="/products">View All</NuxtLink>
      </div>
      <SCSlider class="lg:gap-6">
        <ProductCard class="min-w-[160px] lg:min-w-[280px]" v-for="node in bestSellers.nodes" :key="node.databaseId" :node="node" />
      </SCSlider>
    </section>

    <section class="my-16 md:my-24">
      <div class="container flex items-end justify-between">
        <h2 class="font-semibold text-lg md:text-2xl">Latest Products</h2>
        <NuxtLink class="text-primary" to="/products">View All</NuxtLink>
      </div>
      <SCSlider class="lg:gap-6">
        <ProductCard class="min-w-[160px] lg:min-w-[280px]" v-for="node in latesProducts.nodes" :key="node.databaseId" :node="node" />
      </SCSlider>
    </section>
  </div>
</template>

<script>
import GET_PRODUCTS from "~/gql/queries/getProducts";
import GET_PRODUCT_CATEGORIES from "~/gql/queries/getProductCategories";

export default {
  head() {
    return {
      title: "Home",
      meta: [{ name: "description", content: "Home page" }],
    };
  },
  async asyncData({ $graphql, params }) {
    const { productCategories } = await $graphql.default.request(GET_PRODUCT_CATEGORIES, {
      first: 6,
    });
    const { products: bestSellers } = await $graphql.default.request(GET_PRODUCTS, { first: 8, orderby: [{ field: "TOTAL_SALES", order: "DESC" }] });
    const { products: latesProducts } = await $graphql.default.request(GET_PRODUCTS, { first: 8, orderby: [{ field: "DATE", order: "DESC" }] });
    return { productCategories, bestSellers, latesProducts };
  },
};
</script>
