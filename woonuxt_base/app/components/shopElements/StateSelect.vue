<script setup>
defineOptions({ inheritAttrs: false });

const props = defineProps({
  modelValue: { type: String, default: '' },
  countryCode: { type: String, default: '' },
});

const { getStatesForCountry, countryStatesDict } = useCountry();
const emit = defineEmits(['update:modelValue', 'change']);

function select(evt) {
  const value = evt.target.value;
  emit('update:modelValue', value);
  emit('change', value);
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
  <select v-bind="$attrs" @change="select" v-if="countryStatesDict[props.countryCode]?.length">
    <option value="" :selected="!props.modelValue">Select a state</option>
    <option v-for="state in countryStatesDict[props.countryCode]" :key="state.code" :value="state.code" :selected="state.code === props.modelValue">
      {{ state.name }}
    </option>
  </select>
  <input v-else v-bind="$attrs" type="text" @change="select" placeholder="State" />
</template>
