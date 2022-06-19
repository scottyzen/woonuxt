<template>
  <div class="grid shipping-options gap-4">
    <div
      v-for="option in options"
      :key="option.id"
      class="option flex items-center justify-between"
      :class="{
        'active-option': option.id === activeOption,
        hidden: hasFreeShipping && option.id === 'flat_rate:2',
      }"
      @click="setActiveOption(option.id)"
    >
      <div>
        <div class="text-sm text-gray-500">{{ option.label }}</div>
        <div class="font-semibold text-gray-600">€{{ option.cost }}</div>
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        width="20"
        height="20"
        class="text-white p-1 bg-primary rounded-full"
        fill="currentColor"
        v-if="option.id === activeOption"
      >
        <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      required: true,
    },
    activeOption: {
      type: String,
      required: true,
    },
  },
  methods: {
    setActiveOption(id) {
      this.$emit("setActiveOption", id);
    },
  },
  computed: {
    hasFreeShipping() {
      return this.options ? this.options.some((option) => parseFloat(option.cost) === 0) : false;
    },
  },
};
</script>

<style lang="postcss">
.shipping-options {
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
}
.shipping-options .option {
  @apply w-full px-4 py-2 rounded-2xl border bg-gray-50 cursor-pointer hover:border-purple-300;
}
.shipping-options .active-option {
  @apply border-purple-300 cursor-default;
  pointer-events: none;
}
</style>
