<template>
  <div>
    <div class="container flex relative items-center justify-center">
      <NuxtImg width="1400" height="800" class="object-cover rounded-3xl h-[65vh] w-full lg:h-[640px]" src="/images/hero-4.jpg" alt="Hero image" loading="eager" format="webp" fit="outside" />
      <div class="container p-12 text-gray-800 absolute lg:p-24 ">
        <h1 class="font-bold  text-2xl md:mb-4 lg:text-6xl">Just landed.</h1>
        <h2 class="font-bold text-xl md:mb-4 lg:text-3xl">The Autumn Collection</h2>
        <div class="font-light max-w-sm mb-8 lg:max-w-md">
          View the Autumn Collection and discover the latest trends in fashion and accessories. We have everything you need to look your best this season.
        </div>
        <NuxtLink class="rounded-xl font-bold bg-gray-800 text-white py-4 px-8 hover:bg-gray-800" to="/products">Shop now</NuxtLink>
      </div>
    </div>

    <div class="container-sm flex flex-wrap my-16 text-center gap-8 justify-center brand items-center lg:justify-between">
      <NuxtImg src="/images/logoipsum-211.svg" alt="Brand 1" />
      <NuxtImg src="/images/logoipsum-221.svg" alt="Brand 2" />
      <NuxtImg src="/images/logoipsum-225.svg" alt="Brand 3" />
      <NuxtImg src="/images/logoipsum-280.svg" alt="Brand 4" />
      <NuxtImg src="/images/logoipsum-284.svg" alt="Brand 5" />
      <NuxtImg src="/images/logoipsum-215.svg" alt="Brand 6" />
    </div>

    <section class="container-sm my-16">
      <div class=" flex items-end justify-between">
        <h2 class="font-semibold text-lg md:text-2xl">Shop by category</h2>
        <NuxtLink class="text-primary" to="/categories">View All</NuxtLink>
      </div>
      <div class="flex flex-wrap mt-8 gap-4 justify-center lg:flex-nowrap">
        <CategoryCard class="max-w-[220px] w-1/2 md:w-full" v-for="(category, i) in productCategories.nodes" :key="i" :node="category" />
      </div>

    </section>

    <section class="my-16 md:my-24">
      <div class="container-sm flex items-end justify-between">
        <h2 class="font-semibold text-lg md:text-2xl">Best Sellers</h2>
        <NuxtLink class="text-primary" to="/products">View All</NuxtLink>
      </div>
      <SCSlider class="lg:gap-6">
        <ProductCard class="min-w-[160px] lg:min-w-[280px]" v-for="node in bestSellers.nodes" :key="node.databaseId" :node="node" />
      </SCSlider>
    </section>

    <section class="my-16 md:my-24">
      <div class="container-sm flex items-end justify-between">
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
