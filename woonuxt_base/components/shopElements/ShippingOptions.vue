<script setup>
const { updateShippingMethod } = useCart();
const props = defineProps({
  options: { type: Array, required: true },
  activeOption: { type: String, required: true },
});

const setActiveOption = async (id) => {
  await updateShippingMethod(id);
};
</script>

<template>
  <div class="grid gap-4 shipping-options">
    <div
      v-for="option in options"
      :key="option.id"
      class="flex items-center justify-between option"
      :class="{ 'active-option': option.id === activeOption }"
      @click="setActiveOption(option.id)">
      <div>
        <div class="text-sm leading-tight text-gray-500" v-html="option.label"></div>
        <div class="font-semibold text-gray-600">€{{ option.cost }}</div>
      </div>

      <svg v-if="option.id === activeOption" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="20" height="20" class="p-1 text-white rounded-full" fill="currentColor">
        <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
      </svg>
    </div>
  </div>
</template>

<style lang="postcss">
.shipping-options {
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

.shipping-options .option {
  @apply bg-white border rounded-lg cursor-pointer w-full py-2 px-4 hover:border-purple-300;
}

.shipping-options .active-option {
  @apply border-primary cursor-default border-opacity-50 shadow-sm;
  pointer-events: none;
}

.shipping-options .active-option svg {
  @apply bg-primary;
}
</style>
