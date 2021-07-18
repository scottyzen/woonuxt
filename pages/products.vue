<template>
  <main v-if="!$apollo.loading" class="container">
    <h1>{{ $route.params.categorySlug }}</h1>
    <Products
      :category="$route.params.categorySlug"
      :page="parseInt($route.params.pageNumber) || 1"
      :products="products.nodes"
    />
  </main>
</template>

<script>
import getProducts from '~/gql/queries/getProducts'
export default {
  apollo: {
    products: {
      query: getProducts,
      variables() {
        return {
          slug: this.$route.params.categorySlug,
        }
      },
    },
  },
}
</script>
