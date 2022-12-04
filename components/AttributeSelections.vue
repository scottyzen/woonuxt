<template>
  <div class="flex flex-col gap-1 justify-between">
    <div class="flex flex-wrap py-2 relative justify-between" v-for="(attr, i) in attrs" :key="i">

      <!-- COLOR SWATCHES -->
      <div v-if="attr.name == 'pa_color' || attr.name == 'color'" class="grid gap-2">
        <div class="text-sm">Color<span class="text-gray-400 capitalize">: {{ activeValue(attr.name) }}</span></div>
        <div class="flex gap-2">
          <span v-for="(option, i) in attr.options" :key="option.id">
            <label>
              <input class="hidden" :checked="i == 0" @change="updateAttrs($event)" type="radio" :class="`name-${attr.name}`" :name="attr.name" :value="option" :ref="attr.name" />
              <span class="color-button" :class="`color-${option}`" :title="`${attr.name}: ${option}`"></span>
            </label>
          </span>
        </div>
      </div>

      <!-- DROPDOWN -->
      <div v-else-if="attr.options.length > 8" class="grid gap-2">
        <div class="text-sm">{{ attr.label }}<span class="text-gray-400 capitalize">: {{ activeValue(attr.name) }}</span></div>
        <select :name="attr.name" :id="attr.name" @change="updateAttrs" :ref="attr.name" required class="border-white shadow">
          <option selected disabled hidden :value="null">Choose {{ attr.label }}</option>
          <option v-for="option in attr.options" :key="option" :value="option">{{ option }}</option>
        </select>
      </div>

      <!-- CHECKBOXES -->
      <div v-else class="grid gap-2">
        <div class="text-sm">{{ attr.label }}<span class="text-gray-400 capitalize">: {{ activeValue(attr.name) }}</span></div>
        <div class="flex gap-2">
          <span v-for="(vars, i) in variants">
            <label v-for="v in vars.attributes.nodes">
              <input class="hidden" :checked="(i == variants.findIndex(obj => obj.stockStatus === `IN_STOCK`))" @change="updateAttrs($event)" type="radio" :class="`name-${attr.name}`" :name="attr.name" :value="v.value" :ref="attr.name" :id="i" :disabled="vars.stockStatus == `OUT_OF_STOCK`" />
              <span :class="[{disabled: vars.stockStatus == `OUT_OF_STOCK`}, `picker-${v.value} radio-button`]" :title="`${attr.name}: ${v.value}`">{{ v.value }}</span>
            </label>
          </span>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  props: ["attrs", "variants"],
  methods: {
    updateAttrs() {
      const selectedVariations = this.attrs.map((row) => {
        const radioValue = document.querySelector(`.name-${row.name}:checked`);
        const value = radioValue ? radioValue.value : this.$refs[row.name][0].value;
        const name = row.name.toLowerCase();
        return { name, value };
      });

      this.$emit("attrs-changed", selectedVariations);
    },
    activeValue(refName) {
      if (typeof document === "undefined") return null;
      let radioValue = document.querySelector(`.name-${refName}:checked`);
      return radioValue ? radioValue.value : this.$refs[refName]?.[0]?.value;
    }
  },
  mounted() {
    this.updateAttrs();
  }
};
</script>

<style lang="postcss">
select {
  @apply border-2 rounded-2xl py-2 px-4 appearance-none;
  background: url("/images/chevron-down.svg") center right 10px no-repeat;
  background-size: 1rem;
  padding-right: 2.5rem;
}

.radio-button {
  @apply border-transparent border-white rounded-lg cursor-pointer outline bg-gray-50 border-2 text-sm text-center outline-2 outline-gray-100 py-1.5 px-3 transition-all text-gray-800 inline-block hover: outline-gray-500 ;
}

.color-button {
  @apply border-transparent border-white cursor-pointer outline bg-gray-50 border-2 rounded-2xl text-sm text-center outline-2 outline-gray-100 transition-all text-gray-800 inline-block hover: outline-gray-500 ;
  width: 2rem;
  height: 2rem;
}

.color-green {
  @apply bg-green-500;
}

.color-blue {
  @apply bg-blue-500;
}

.color-red {
  @apply bg-red-500;
}

.color-yellow {
  @apply bg-yellow-500;
}

.color-orange {
  @apply bg-orange-500;
}

.color-purple {
  @apply bg-purple-500;
}

.color-black {
  @apply bg-black;
}

input[type="radio"]:checked~span {
  @apply outline outline-2 outline-gray-500;
}
</style>
