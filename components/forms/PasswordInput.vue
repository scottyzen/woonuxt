<script setup lang="ts">
const showPassword = ref(false);

const { modelValue, className } = defineProps({
  modelValue: String,
  className: String,
});
</script>

<template>
  <div class="relative flex items-center w-full">
    <input
      :type="showPassword ? 'text' : 'password'"
      class="flex items-center flex-1"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :class="className" />
    <Icon name="ion:eye-outline" size="20" class="absolute cursor-pointer right-4" @click="showPassword = !showPassword" v-if="showPassword" />
    <Icon name="ion:eye-off-outline" size="20" class="absolute cursor-pointer right-4" @click="showPassword = !showPassword" v-else />
  </div>
</template>
