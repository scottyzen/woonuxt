<script setup>
const props = defineProps({
  modelValue: { type: String, default: '' },
  countryCode: { type: String, default: '' },
});

const { getStatesForCountry, countryStatesDict } = useCountry();
const emit = defineEmits(['update:modelValue']);

function select(evt) {
  emit('update:modelValue', evt.target.value);
}

async function updateState() {
  if (props.countryCode && props.countryCode.length > 0) {
    await getStatesForCountry(props.countryCode);
  }
}

onMounted(() => {
  updateState();
});

watch(
  () => props.countryCode,
  () => {
    updateState();
  },
);
</script>

<template>
  <select
    @change="select"
    v-if="countryStatesDict[props.countryCode]?.length"
    class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50 focus:bg-white">
    <option value="" :selected="!props.modelValue">Select a state</option>
    <option v-for="state in countryStatesDict[props.countryCode]" :key="state.code" :value="state.code" :selected="state.code === props.modelValue">
      {{ state.name }}
    </option>
  </select>
  <input
    v-else
    type="text"
    @change="select"
    placeholder="State"
    class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50 focus:bg-white" />
</template>
