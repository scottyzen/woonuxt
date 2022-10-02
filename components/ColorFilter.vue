<template>
  <div v-if="allPaColor">
    <div class="mt-8 mb-3">Colours</div>
    <div class="grid">
      <div v-for="color in allPaColor" :key="color.slug" class="gap-2 inline-flex items-center">
        <input :id="color.slug" type="checkbox" :value="color.slug" v-model="selectedColors" @change="checkboxChanged" />
        <label :for="color.slug" class="m-0 text-sm">{{ color.name }}</label>
      </div>
    </div>
  </div>
</template>

<script>
import GET_ALL_COLORS from "~/gql/queries/getAllColors";
export default {
  name: "ColorFilter",
  data() {
    return {
      selectedColors: [],
      allPaColor: null,
    };
  },
  props: {
    activeColors: { type: Array, default: [] },
  },
  mounted() {
    this.selectedColors = this.activeColors.length ? this.activeColors : [];
  },
  methods: {
    checkboxChanged() {
      this.$emit("color-changed", this.selectedColors.filter(Boolean));
    },
  },
  async fetch() {
    const { allPaColor } = await this.$graphql.default.request(GET_ALL_COLORS);
    this.allPaColor = allPaColor.nodes.length ? allPaColor.nodes : null;
  },
  fetchKey: "ColorFilter",
  watch: {
    activeColors(newColors) {
      this.selectedColors = newColors;
    },
  },
};
</script>

<style scoped lang="postcss">

</style>
