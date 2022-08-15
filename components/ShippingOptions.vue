<template>
  <div class="grid gap-4 shipping-options">
    <div v-for="option in options" :key="option.id" class="flex option items-center justify-between" :class="{
      'active-option': option.id === activeOption,
      hidden: hasFreeShipping && option.id === 'flat_rate:2',
    }" @click="setActiveOption(option.id)">
      <div>
        <div class="text-sm text-gray-500" v-html="option.label"></div>
        <div class="font-semibold text-gray-600">€{{ option.cost }}</div>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="20" height="20" class="bg-primary rounded-full text-white p-1" fill="currentColor" v-if="option.id === activeOption">
        <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    options: { type: Array, required: true },
    activeOption: { type: String, required: true }
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
  @apply border cursor-pointer bg-gray-50 rounded-2xl w-full py-2 px-4 hover: border-purple-300 ;
}

.shipping-options .active-option {
  @apply cursor-default border-purple-300;
  pointer-events: none;
}
</style>
