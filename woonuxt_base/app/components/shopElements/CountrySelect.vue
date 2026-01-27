<script setup>
defineOptions({ inheritAttrs: false });

const props = defineProps({
  modelValue: { type: String, default: '' },
});

const { getAllowedCountries, countriesToShow } = useCountry();
const emit = defineEmits(['update:modelValue', 'change']);

onMounted(() => {
  getAllowedCountries();
});

function select(evt) {
  const value = evt.target.value;
  emit('update:modelValue', value);
  emit('change', value);
}
</script>

<template>
  <select v-bind="$attrs" :value="modelValue" @change="select" required>
    <option value="" disabled>Select a country</option>
    <option v-for="country in countriesToShow" :key="country.code" :value="country.code">
      {{ country.name }}
    </option>
  </select>
</template>
