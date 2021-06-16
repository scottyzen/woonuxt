<template>
  <section>
    <div class="grid grid-cols-2 gap-8 my-12 lg:grid-cols-4">
      <ProductCard
        v-for="node in products"
        :key="node.databaseId"
        :node="node"
      />
    </div>
    <Pagination :category="category" :total="total" />
  </section>
</template>

<script>
export default {
  props: {
    perPage: { type: Number, default: null },
    page: { type: Number, default: 1 },
    category: { type: String, default: null },
  },
  computed: {
    productsInCategory() {
      return this.$store.state.products.filter((product) =>
        product.productCategories.nodes.some(
          (cat) => cat.slug === this.category
        )
      )
    },
    products() {
      const products = this.category
        ? this.productsInCategory
        : this.$store.state.products
      return this.pager(products)
    },
    total() {
      return this.category
        ? this.productsInCategory.length
        : this.$store.state.products.length
    },
  },
  methods: {
    pager(products) {
      const perPage = this.perPage || this.$config.perPage
      const pageNum = this.page || this.$route.params.pageNumber
      return products.slice(perPage * (pageNum - 1), perPage * pageNum)
    },
  },
}
</script>
