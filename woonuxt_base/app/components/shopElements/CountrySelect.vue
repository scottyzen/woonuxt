<script setup>
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
  <select
    :value="modelValue"
    @change="select"
    required
    class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50 focus:bg-white">
    <option value="" disabled>Select a country</option>
    <option v-for="country in countriesToShow" :key="country.code" :value="country.code">
      {{ country.name }}
    </option>
  </select>
</template>
