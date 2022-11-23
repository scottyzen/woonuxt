<template>
  <!-- Count Description -->
  <div v-if="this.products.length" class="font-light text-sm hidden lg:block">
    Showing
    <strong>{{ small + 1 }}</strong> to <strong>{{ large }}</strong> of <strong>{{ this.products.length }}</strong> products
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
};
</script>
