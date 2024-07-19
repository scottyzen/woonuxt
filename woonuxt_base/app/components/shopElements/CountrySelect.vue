<script setup>
import { countries } from '#constants';

const props = defineProps(['modelValue', 'props.allowedCountries']);
const emit = defineEmits(['update:modelValue']);
const countriesToShow = computed(() =>
  props.allowedCountries?.length ? countries.filter((country) => props.allowedCountries.includes(country.countryCode)) : countries,
);

function select(evt) {
  emit('update:modelValue', evt.target.value);
}
</script>

<template>
  <select :value="modelValue" @change="select">
    <option value="" disabled>Select a country</option>
    <option v-for="country in countriesToShow" :key="country.countryName" :value="country.countryCode">
      {{ country.countryName }}
    </option>
  </select>
</template>

<style scoped lang="postcss">
select {
  height: 42px;
}
</style>
