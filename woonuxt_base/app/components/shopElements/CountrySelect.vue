<script setup>
const props = defineProps({
  modelValue: { type: String, default: '' },
});

const { getAllowedCountries, countriesToShow } = useCountry();
const emit = defineEmits(['update:modelValue']);

onMounted(() => {
  getAllowedCountries();
});

function select(evt) {
  emit('update:modelValue', evt.target.value);
}
</script>

<template>
  <select :value="modelValue" @change="select" required class="h-[42px]">
    <option value="" disabled>Select a country</option>
    <option v-for="country in countriesToShow" :key="country.code" :value="country.code">
      {{ country.name }}
    </option>
  </select>
</template>
