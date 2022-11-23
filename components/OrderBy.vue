<template>
  <select @change="orderChanged" class="text-[0px] sm:text-base h-10">
    <option value="Latest">Latest</option>
    <option value="Name">Name</option>
    <option value="Price (low to high)">Price (low to high)</option>
    <option value="Price (high to low)">Price (high to low)</option>
    <option value="Rating">Rating</option>
    <option value="Discount">Discount</option>
  </select>
</template>

<script>
export default {
  props: {
    activeOrder: { type: String, default: "Latest" },
  },
  methods: {
    orderChanged(e) {
      this.$store.commit("updateOrderBy", e.target.value);
      this.$emit("order-updated", e.target.value);
    },
  },
};
</script>

<style lang="postcss" scoped>
select {
  @apply bg-white outline-none border leading-tight;
}
</style>
