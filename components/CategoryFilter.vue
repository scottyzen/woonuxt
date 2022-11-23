<template>
  <div class="grid">
    <div v-for="cat in productCategories" :key="cat.databaseId" class="flex gap-2 items-center">
      <input :id="cat.slug" type="checkbox" :value="cat.slug" v-model="selectedCategories" @change="checkboxChanged" />
      <label :for="cat.slug" class="m-0 text-sm">{{ cat.name }} <span class="text-gray-500">({{ cat.count }})</span></label>
    </div>
  </div>
</template>

<script>
import GET_PRODUCT_CATEGORIES from "~/gql/queries/getProductCategories";
export default {
  name: "CategoryFilter",
  data() {
    return {
      selectedCategories: [],
      productCategories: null,
    };
  },
  props: {
    activeCategories: { type: Array, default: [] },
  },
  mounted() {
    this.selectedCategories = this.activeCategories.length ? this.activeCategories : [];
  },
  methods: {
    checkboxChanged() {
      this.$emit("checkbox-changed", this.selectedCategories.filter(Boolean));
    },
  },
  async fetch() {
    const { productCategories } = await this.$graphql.default.request(GET_PRODUCT_CATEGORIES);
    this.productCategories = productCategories.nodes;
  },
  fetchKey: "CategoryFilter",
  watch: {
    activeCategories(newCategories) {
      this.selectedCategories = newCategories;
    },
  },
};
</script>
