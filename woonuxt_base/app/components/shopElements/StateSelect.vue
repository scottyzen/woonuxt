<script setup lang="ts">
import type { CountriesEnum } from '#types/gql';

defineOptions({ inheritAttrs: false });

const props = defineProps<{ modelValue?: string | null; countryCode?: string | null }>();

const { getStatesForCountry, countryStatesDict } = useCountry();
const emit = defineEmits(['update:modelValue', 'change']);

function select(evt: Event) {
  const value = (evt.target as HTMLSelectElement | HTMLInputElement | null)?.value ?? '';
  emit('update:modelValue', value);
  emit('change', value);
}

async function updateState() {
  const code = props.countryCode ?? '';
  if (code.length > 0) {
    await getStatesForCountry(code as CountriesEnum);
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
  <select v-bind="$attrs" @change="select" v-if="countryStatesDict[props.countryCode ?? '']?.length">
    <option value="" :selected="!(props.modelValue ?? '')">Select a state</option>
    <option
      v-for="state in countryStatesDict[props.countryCode ?? '']"
      :key="state.code"
      :value="state.code"
      :selected="state.code === (props.modelValue ?? '')">
      {{ state.name }}
    </option>
  </select>
  <input v-else v-bind="$attrs" type="text" @change="select" placeholder="State" />
</template>
