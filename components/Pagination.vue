<template>
  <nav
    v-if="numberOfPagesForPagination > 1"
    class="flex justify-center my-8 pagination"
  >
    <nuxt-link
      v-for="index in numberOfPagesForPagination"
      :key="index"
      class="p-2 mx-0.5 leading-none rounded"
      :to="index == 1 ? prefex : `${prefex}/page/${index}`"
    >
      {{ index }}
    </nuxt-link>
  </nav>
</template>

<script>
export default {
  props: {
    total: { type: Number, default: null },
    perPage: { type: Number, default: null },
    category: { type: String, default: null },
  },
  computed: {
    numberOfPagesForPagination() {
      const perPage = this.perPage || this.$config.perPage
      return Math.ceil(this.total / perPage)
    },
    prefex() {
      return this.category ? `/product-category/${this.category}` : `/products`
    },
  },
}
</script>

<style lang="postcss">
.pagination .nuxt-link-exact-active,
.pagination a:hover {
  @apply bg-purple-600 text-white;
}
</style>
