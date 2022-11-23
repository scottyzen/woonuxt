<template>
  <div class="pagination">
    <button v-if="page > 1" @click="page--">Previous</button>
    <button v-if="large != products.length" @click="page++">Next</button>
  </div>
</template>

<script>
export default {
  props: {
    page: { type: Number, default: 1 },
    products: { type: Array, default: null },
  },
  computed: {
    perPage() {
      return this.$config.perPage;
    },
    small() {
      return this.perPage * this.page - this.perPage;
    },
    large() {
      return Math.min(this.products.length, this.perPage * this.page);
    },
  },
  watch: {
    page() {
      window.scrollTo(0, 0);
      this.$emit("pageChanged", this.page);
    },
  },
};
</script>
