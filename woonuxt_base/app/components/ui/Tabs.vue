<script setup lang="ts">
interface Tab {
  label: string;
  badge?: string | number;
  disabled?: boolean;
}

const { tabs, modelValue } = defineProps<{
  tabs: Tab[];
  modelValue: number;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: number];
}>();

const selectTab = (index: number) => {
  if (!tabs[index]?.disabled) {
    emit('update:modelValue', index);
  }
};
</script>

<template>
  <div>
    <nav class="flex gap-8 border-b border-gray-200 dark:border-gray-700 tabs">
      <button
        v-for="(tab, index) in tabs"
        :key="index"
        type="button"
        :disabled="tab.disabled"
        :class="[
          'border-transparent border-b-2 text-lg pb-8 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200',
          modelValue === index ? 'active border-primary text-primary' : '',
          tab.disabled ? 'opacity-50 cursor-not-allowed' : '',
        ]"
        style="margin-bottom: -1px"
        @click.prevent="selectTab(index)">
        <span class="flex items-center gap-2">
          {{ tab.label }}
          <span
            v-if="tab.badge !== undefined"
            class="bg-primary rounded-full text-white leading-none min-w-4.5 p-0.75 text-[12px] inline-flex justify-center items-center">
            {{ tab.badge }}
          </span>
        </span>
      </button>
    </nav>
    <div class="tab-contents dark:text-gray-300 mt-8">
      <slot :active-tab="modelValue" />
    </div>
  </div>
</template>

<style scoped>
@reference "#tailwind";

.tabs {
  @apply border-gray-200 dark:border-gray-700;
}

.tabs button {
  @apply border-transparent border-b-2 text-lg pb-8 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200;
  margin-bottom: -1px;
}

.tabs button.active {
  @apply border-primary text-primary;
}

.tab-contents {
  @apply dark:text-gray-300;
}
</style>
