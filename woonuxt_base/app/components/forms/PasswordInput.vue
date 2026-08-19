<script setup lang="ts">
const showPassword = ref(false);

const { id, modelValue, className, placeholder, autocomplete, inputmode, name, required, disabled } = defineProps({
  id: { type: String, default: undefined },
  modelValue: { type: String, default: '' },
  className: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  autocomplete: { type: String, default: 'new-password' },
  inputmode: { type: String as PropType<'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search'>, default: 'text' },
  name: { type: String, default: undefined },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
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
      :id="id"
      :name="name"
      :type="showPassword ? 'text' : 'password'"
      class="flex items-center flex-1"
      :value="modelValue"
      :class="className"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :inputmode="inputmode"
      :disabled="disabled"
      :required="required"
      @input="handleInputChanged" />
    <button
      type="button"
      class="absolute right-4 inline-flex cursor-pointer items-center text-gray-600 hover:text-gray-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      :aria-label="showPassword ? 'Hide password' : 'Show password'"
      @click="showPassword = !showPassword">
      <Icon :name="showPassword ? 'ion:eye-outline' : 'ion:eye-off-outline'" size="20" />
    </button>
  </div>
</template>

<style scoped>
@reference "#tailwind";

input {
  @apply w-full rounded-lg border border-gray-300 bg-white p-3 px-4 text-base leading-6 text-gray-900 outline-hidden;
}
</style>
