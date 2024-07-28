<script setup>
const props = defineProps(['modelValue', 'countryCode', 'countryStates']);
const emit = defineEmits(['update:modelValue']);
const states = ref(props.countryStates || []);

function select(evt) {
  emit('update:modelValue', evt.target.value);
}

async function updateState() {
  try {
    const { countryStates } = await GqlGetStates({ country: props?.countryCode || 'IE' });
    states.value = countryStates;
  } catch (error) {
    console.error(error);
  }
}

watch(
  () => props.countryCode,
  () => {
    updateState();
  },
);
</script>

<template>
  <select @change="select" v-if="states.length" class="h-[42px]">
    <option v-for="state in states" :key="state.code" :value="state.code" :selected="state.code === props.modelValue">
      {{ state.name }}
    </option>
  </select>
  <input v-else type="text" @change="select" placeholder="State" />
</template>
