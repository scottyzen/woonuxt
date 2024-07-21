<script setup lang="ts">
const showPassword = ref(false);

const { modelValue, className, placeholder, required } = defineProps({
  modelValue: { type: String, required: true },
  className: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  autocomplete: { type: String, default: 'new-password' },
  required: { type: Boolean, default: false },
});

const emit = defineEmits(['update:modelValue']);

const handleInputChanged = (e: Event) => {
  const target = e.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};
</script>

<template>
  <div class="relative flex items-center w-full">
    <input
      :type="showPassword ? 'text' : 'password'"
      class="flex items-center flex-1"
      :value="modelValue"
      @input="handleInputChanged"
      :class="className"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :required="required" />
    <Icon name="ion:eye-outline" size="20" class="absolute cursor-pointer right-4" @click="showPassword = !showPassword" v-if="showPassword" />
    <Icon name="ion:eye-off-outline" size="20" class="absolute cursor-pointer right-4" @click="showPassword = !showPassword" v-else />
  </div>
</template>
