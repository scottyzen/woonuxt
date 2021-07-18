<template>
  <section>
    <div class="grid grid-cols-2 gap-8 my-12 lg:grid-cols-4">
      <ProductCard
        v-for="node in postWithPagination"
        :key="node.databaseId"
        :node="node"
      />
    </div>
    <Pagination :category="category" :total="products.length" />
  </section>
</template>

<script>
export default {
  props: {
    perPage: { type: Number, default: null },
    page: { type: Number, default: 1 },
    category: { type: String, default: null },
    products: { type: Array, default: null },
  },
  computed: {
    postWithPagination() {
      return this.pager(this.products)
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
