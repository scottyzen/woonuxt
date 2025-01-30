<script setup lang="ts">
interface Props {
  attributes: any[];
  defaultAttributes?: { nodes: VariationAttribute[] } | null;
}

const { attributes, defaultAttributes } = defineProps<Props>();
const emit = defineEmits(["attrs-changed"]);

const activeVariations = ref<VariationAttribute[]>([]);

const getSelectedName = (attr: any, activeVariation?: VariationAttribute) => {
  if (attr?.terms?.nodes && activeVariation) {
    return attr.terms.nodes.find(
      (node: { slug: string }) => node.slug === activeVariation.value
    )?.name;
  }

  return activeVariation?.value || "";
};

const updateAttrs = () => {
  const selectedVariations = attributes.map((row): VariationAttribute => {
    const radioValue = document.querySelector(
      `.name-${row.name.toLowerCase()}:checked`
    ) as HTMLInputElement;
    const dropdownValue = document.querySelector(
      `#${row.name}`
    ) as HTMLSelectElement;
    const name = row.name.charAt(0).toLowerCase() + row.name.slice(1);
    const value = radioValue?.value ?? dropdownValue?.value ?? "";
    return { name, value };
  });

  activeVariations.value = selectedVariations;
  emit("attrs-changed", selectedVariations);
};

const setDefaultAttributes = () => {
  if (defaultAttributes?.nodes) {
    defaultAttributes.nodes.forEach((attr: VariationAttribute) => {
      const radio = document.querySelector(
        `.name-${attr.name.toLowerCase()}[value="${attr.value}"]`
      ) as HTMLInputElement;
      if (radio) radio.checked = true;
      const dropdown = document.querySelector(
        `#${attr.name}`
      ) as HTMLSelectElement;
      if (dropdown) dropdown.value = attr.value || "";
    });
  }
};

const className = (name: string) => `name-${name.toLowerCase()}`;

onBeforeMount(() => {
  setDefaultAttributes();
  updateAttrs();
});
</script>

<template>
  <div class="flex flex-col gap-1 justify-between" v-if="attributes">
    <div class="text-sm">
      {{ attributes[0].label }}
      <span v-if="activeVariations.length" class="text-gray-400">{{
        getSelectedName(attributes[0], attributes[0])
      }}</span>
    </div>
    <select
      :id="attributes[0].name"
      :ref="attributes[0].name"
      :name="attributes[0].name"
      required
      class="border-white shadow"
      @change="updateAttrs"
    >
      <option disabled hidden>
        {{ $t("messages.general.choose") }}
        {{ decodeURIComponent(attributes[0].label) }}
      </option>
      <option
        v-for="(term, dropdownIndex) in attributes[0].terms.nodes"
        :key="dropdownIndex"
        :value="term.slug"
        v-html="term.name"
        :selected="dropdownIndex == 0"
      />
    </select>
  </div>
</template>

<style lang="postcss">
.radio-button {
  @apply border-transparent border-white rounded-lg cursor-pointer outline bg-gray-50 border-2 text-sm text-center outline-2 outline-gray-100 py-1.5 px-3 transition-all text-gray-800 inline-block hover:outline-gray-500;
}

.color-button {
  @apply border-transparent border-white cursor-pointer outline bg-gray-50 border-2 rounded-2xl text-sm text-center outline-2 outline-gray-100 transition-all text-gray-800 inline-block hover:outline-gray-500;
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

input[type="radio"]:checked ~ span {
  @apply outline outline-2 outline-gray-500;
}
</style>
