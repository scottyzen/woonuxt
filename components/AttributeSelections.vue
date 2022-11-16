<template>
  <div class="relative mb-5">
    <div class="" v-for="(attr, i) in attrs" :key="i">
      <div v-if="attr.name == 'pa_color'" class="grid gap-2">
        <div>Color:</div>
        <div class="flex gap-2">
          <span v-for="(option, i) in attr.options" :key="option.id">
            <label>
              <input
                class="hidden"
                :checked="i == 0"
                @change="updateAttrs($event)"
                type="radio"
                :class="`name-${attr.name}`"
                :name="attr.name"
                :value="option"
                :ref="attr.name"
              />
              <span class="color-button" :class="`color-${option}`"></span>
            </label>
          </span>
        </div>
      </div>

      <div v-else>
        <div class="flex mb-2 text-base">
          <span class="font-semibold text-[#333]"
            >{{ attr.label }}:
            <span class="text-[#999]">{{selectedValue}} </span>
          </span>
        </div>
        <div class="flex items-center flex-wrap">
          <span v-for="(option, i) in attr.options" :key="option.id">
            <label class="leading-34px block">
              <input
                class="hidden"
                :checked="i == 0"
                @change="updateAttrs($event)"
                type="radio"
                :class="`name-${attr.name}`"
                :name="attr.name"
                :value="option"
                :ref="attr.name"
              />
              <span
                class="rounded-lg border border-[#999] text-base text-[#333] cursor-pointer px-3 py-1.5 mr-3 bg-white selected"
                :class="`cursor-pointer picker-${option}`"
                >{{ option.toUpperCase() }}</span
              >
            </label>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["attrs"],
  methods: {
    updateAttrs() {
      const selectedVariations = this.attrs.map((row) => {
        let name = row.name;
        let radioValue = document.querySelector(`.name-${name}:checked`);
        let value = radioValue ? radioValue.value : this.$refs[row.name][0].value;
        this.selectedValue = value.toUpperCase()

        // console.log({ name: name.toLowerCase(), value: value })

        return { name: name.toLowerCase(), value: value };
      });

      this.$emit("attrs-changed", selectedVariations);
    },
  },
  mounted() {
    this.updateAttrs();
  },
};
</script>
<style lang="scss">
.selected:hover,
input[type="radio"]:checked ~ .selected {
  outline-color: #7c54b4;
  outline-style: auto;
  background-color: #7c54b40f;
  color: #000;
}
</style>