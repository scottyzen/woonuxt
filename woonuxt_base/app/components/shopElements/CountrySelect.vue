<script setup lang="ts">
defineOptions({ inheritAttrs: false });

const props = defineProps<{ modelValue?: string | null }>();

const { getAllowedCountries, countriesToShow } = useCountry();
const emit = defineEmits(['update:modelValue', 'change']);

onMounted(() => {
  getAllowedCountries();
});

function select(evt: Event) {
  const value = (evt.target as HTMLSelectElement | null)?.value ?? '';
  emit('update:modelValue', value);
  emit('change', value);
}
</script>

<template>
  <select v-bind="$attrs" :value="modelValue ?? ''" @change="select" required>
    <option value="" disabled>Select a country</option>
    <option v-for="country in countriesToShow" :key="country.code" :value="country.code">
      {{ country.name }}
    </option>
  </select>
</template>
