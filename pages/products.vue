<template>
  <main class="container flex">
    <!-- Filters -->
    <Filters @filter-updated="filterProducts" :activeFilters="this.$store.state.filter" :showFilters="showFilters" :params="$route.params" />

    <!-- Overlay -->
    <div class="overlay" :class="{ 'show-overlay': showFilters }" @click="showFilters = false"></div>

    <div class="flex flex-col max-w-full flex-1 w-full md:pl-8">
      <div class="flex mt-4 gap-4 items-center lg:mt-8">
        <!-- Search -->
        <MultiSearch class="flex-1" @has-changed="filterProducts" :activeTags="this.$store.state.searchTags" />

        <!-- Filter Toggle -->
        <span @click="showFilters = !showFilters" class="rounded-xl cursor-pointer bg-gray-400 text-white p-1.5 md:hidden" :class="{ 'bg-primary': this.$store.state.filter }">
          <Icon name="filter" width="22" height="22" />
        </span>

        <!-- Result count -->
        <ResultCount :page="parseInt($route.params.pageNumber) || page" :products="products" />

        <!-- Order by -->
        <OrderBy @order-updated="filterProducts" />
      </div>

      <!-- Products -->
      <ProductGrid :page="parseInt($route.params.pageNumber) || page" :products="products" @setPage="setPage" />

      <!-- Pagination -->
      <Pagination :page="parseInt($route.params.pageNumber) || page" :products="products" @pageChanged="pageChanged" />
    </div>
  </main>
</template>

<script>
import GET_PRODUCTS from "~/gql/queries/getProducts";
import Fuse from "fuse.js";

export default {
  head() {
    return { title: "Shop" };
  },
  data() {
    return {
      products: [],
      categorySlug: this.$route.params.categorySlug || null,
      page: this.$route.params.page || 1,
      showFilters: false,
      fuseOptions: {
        shouldSort: true,
        threshold: 0.3,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        findAllMatches: true,
        // ignoreLocation: true,
        useExtendedSearch: true,
        keys: ["name", "databaseId", "productCategories.nodes.name"],
      },
    };
  },
  async asyncData({ $graphql, params, $config }) {
    const variables = { slug: params.categorySlug, first: $config.perPage };
    const { products } = await $graphql.default.request(GET_PRODUCTS, variables);
    return { products: products.nodes };
  },
  mounted() {
    if (this.$store.state?.filter || this.$store.state?.searchTags.length) {
      this.filterProducts();
    }
  },
  watch: {
    $route() {
      this.showFilters = false;
    },
  },
  methods: {
    setPage(number) {
      this.page = number;
    },
    pageChanged(page) {
      this.page = page;
    },
    filterProducts() {
      const FILTERED_PRODUCTS = this.$store.state.filter
        ? this.$store.state.products.filter((product) => {
          let { minPrice, maxPrice, starRating, saleItemsOnly, categories, colors } = this.$store.state.filter;

          // Categories
          const catsSlugs = [...categories, this.categorySlug].filter(Boolean); // Remove nulls
          const categoryCondition = catsSlugs.length ? catsSlugs.some((category) => product.productCategories.nodes.some((cat) => cat.slug === category)) : true;

          // Colors
          const colorCondition = colors.length ? colors.some((color) => (product.allPaColor ? product.allPaColor.nodes.some((pc) => pc.slug === color) : false)) : true;

          // Price
          maxPrice = maxPrice > 0 ? maxPrice : 9999999999;
          const price = product.price ? product.price.replace(/\€/gu, "").split(" - ") : [];
          const priceCondition = price.some((el) => el >= minPrice || 0) && price.some((el) => el <= maxPrice);

          // Rating
          const ratingCondition = product.averageRating >= starRating;

          // Sale items only
          const saleItemsOnlyCondition = saleItemsOnly ? product.onSale : true;

          return priceCondition && categoryCondition && ratingCondition && saleItemsOnlyCondition && colorCondition;
        })
        : this.$store.state.products;

      // https://fusejs.io/examples.html#extended-search
      const fuse = new Fuse(this.$store.state.products, this.fuseOptions);
      const searchTags = this.$store.state.searchTags.map((item) => `${item}' `).join(" ");
      const SEARCHED_PRODUCTS = searchTags.length ? fuse.search(searchTags).map((result) => result.item) : this.$store.state.products;

      const PRODUCTS_IN_BOTH = SEARCHED_PRODUCTS.filter((product) => FILTERED_PRODUCTS.some((filteredProduct) => filteredProduct.databaseId == product.databaseId));

      // Order by: Latest, Name, Price, Popularity
      const ORDERED_PRODUCTS = PRODUCTS_IN_BOTH.sort((a, b) => {
        const orderBy = this.$store.state.orderBy;
        switch (orderBy) {
          case "Latest":
            return b.date - a.date;
          case "Name":
            return a.name.localeCompare(b.name);
          case "Price (low to high)":
            const aPrice = a.price.replace(/\€/gu, "").replace(/\,/g, "").split(" - ");
            const bPrice = b.price.replace(/\€/gu, "").replace(/\,/g, "").split(" - ");
            return parseFloat(aPrice[0]) - parseFloat(bPrice[0]);
          case "Price (high to low)":
            const aPrice2 = a.price.replace(/\€/gu, "").replace(/\,/g, "").split(" - ");
            const bPrice2 = b.price.replace(/\€/gu, "").replace(/\,/g, "").split(" - ");
            return parseFloat(bPrice2[bPrice2.length - 1]) - parseFloat(aPrice2[aPrice2.length - 1]);
          case "Rating":
            return b.averageRating - a.averageRating;
          case "Discount":
            let aDiscount = a.onSale;
            let bDiscount = b.onSale;
            if (aDiscount) {
              const aSalePrice = parseFloat(a.salePrice.replace(/[^0-9]/g, ""));
              const aRegularPrice = parseFloat(a.regularPrice.replace(/[^0-9]/g, ""));
              aDiscount = Math.round(((aSalePrice - aRegularPrice) / aRegularPrice) * 100);
            }
            if (bDiscount) {
              const bSalePrice = parseFloat(b.salePrice.replace(/[^0-9]/g, ""));
              const bRegularPrice = parseFloat(b.regularPrice.replace(/[^0-9]/g, ""));
              bDiscount = Math.round(((bSalePrice - bRegularPrice) / bRegularPrice) * 100);
            }
            return aDiscount - bDiscount;

          default:
            return b.date - a.date;
        }
      });

      this.refreshProducts(ORDERED_PRODUCTS);
    },
    refreshProducts(products) {
      if (this.$store.state.filter && this.$store.state.filter.categories.length) {
        this.products = products;
      } else {
        this.products = this.categorySlug
          ? products.filter((product) => product.productCategories.nodes.map((cat) => cat.slug).some((slug) => this.categorySlug.includes(slug)))
          : products;
      }

      if (this.products.length < this.$config.perPage) {
        this.page = 1;
      }
    },
  },
};
</script>

<style lang="postcss">
input[type="search"] {
  @apply border rounded-xl max-w-md outline-none leading-tight w-full p-2 px-4 pl-10 transition-all;
  background: url("/images/search.svg") no-repeat center left 0.75em;
}

.overlay {
  @apply bg-gray-900 opacity-0 inset-0 transition-opacity z-10 duration-300 hidden fixed;
}

.show-overlay {
  @apply opacity-10 block md: hidden ;
}
</style>
