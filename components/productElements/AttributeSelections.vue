<template>
  <div class="flex flex-col gap-1 justify-between">
    <div v-for="(attr, i) in attrs" :key="i" class="flex flex-wrap py-2 relative justify-between">
      <!-- COLOR SWATCHES -->
      <div v-if="attr.name == 'pa_color' || attr.name == 'color'" class="grid gap-2">
        <div class="text-sm">
          {{ $t('messages.general.color') }}
          <span v-if="activeVariations" class="text-gray-400 capitalize">: {{ activeVariations[i].value }}</span>
        </div>
        <div class="flex gap-2">
          <span v-for="(option, optionIndex) in attr.options" :key="option.id">
            <label>
              <input
                :ref="attr.name"
                class="hidden"
                :checked="optionIndex == 0"
                type="radio"
                :class="`name-${attr.name}`"
                :name="attr.name"
                :value="option"
                @change="updateAttrs($event)" />
              <span class="color-button" :class="`color-${option}`" :title="`${attr.name}: ${option}`"></span>
            </label>
          </span>
        </div>
      </div>

      <!-- DROPDOWN -->
      <div v-else-if="attr.options.length > 8" class="grid gap-2">
        <div class="text-sm">
          {{ attr.label
          }}<span v-if="activeVariations" class="text-gray-400 capitalize">: {{ activeVariations[i].value }}</span>
        </div>
        <select
          :id="attr.name"
          :ref="attr.name"
          :name="attr.name"
          required
          class="border-white shadow"
          @change="updateAttrs">
          <option selected disabled hidden :value="null">{{ $t('messages.general.choose') }} {{ attr.label }}</option>
          <option v-for="option in attr.options" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </div>

      <!-- CHECKBOXES -->
      <div v-else class="grid gap-2">
        <div class="text-sm">
          {{ attr.label
          }}<span v-if="activeVariations" class="text-gray-400 capitalize">: {{ activeVariations[i].value }}</span>
        </div>
        <div class="flex gap-2">
          <span v-for="(option, i) in attr.options" :key="option.id">
            <label>
              <input
                :ref="attr.name"
                class="hidden"
                :checked="i == 0"
                type="radio"
                :class="`name-${attr.name}`"
                :name="attr.name"
                :value="option"
                @change="updateAttrs($event)" />
              <span class="radio-button" :class="`picker-${option}`" :title="`${attr.name}: ${option}`">{{
                option
              }}</span>
            </label>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    attrs: {
      type: Array,
      required: true,
    },
    variations: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      activeVariations: null,
    };
  },
  mounted() {
    this.updateAttrs();
  },
  methods: {
    updateAttrs() {
      const selectedVariations = this.attrs.map((row) => {
        const radioValue = document.querySelector(`.name-${row.name}:checked`);
        const value = radioValue ? radioValue.value : this.$refs[row.name][0].value;
        const name = row.name.toLowerCase();
        return { name, value };
      });

      this.activeVariations = selectedVariations;
      this.$emit('attrs-changed', selectedVariations);
    },
  },
};
</script>

<style lang="postcss">
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

input[type='radio']:checked ~ span {
  @apply outline outline-2 outline-gray-500;
}
</style>
