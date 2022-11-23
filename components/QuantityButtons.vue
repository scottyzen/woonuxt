<template>
  <input type="number" v-model.number="count" min="0" :max="max" aria-label="Quantity" />
</template>

<script>
export default {
  props: {
    quantity: { default: 1, type: Number },
    min: { default: 0, type: Number },
    max: { default: 100, type: Number },
  },
  computed: {
    count: {
      get() {
        return this.quantity;
      },
      set(newValue) {
        this.$emit("quantity-change", newValue);
      },
    },
  },
};
</script>

<style lang="postcss" scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  /* -webkit-appearance: none;
  margin: 0; */
}
input::-webkit-inner-spin-button {
  opacity: 1;
}

button {
  @apply bg-white rounded-full h-7 shadow text-lg w-7 inline-block hover:bg-primary hover:text-white active:bg-primary-light;
}

/* Firefox */
input[type="number"] {
  @apply bg-white flex rounded-xl text-left  p-2.5 gap-4 items-center justify-center focus:outline-none border;
}
</style>
