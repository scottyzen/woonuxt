<template>
  <div class="grid gap-4 shipping-options">
    <div
      v-for="option in options"
      :key="option.id"
      class="flex option items-center justify-between"
      :class="{ 'active-option': option.id === activeOption }"
      @click="setActiveOption(option.id)">
      <div>
        <div class="text-sm leading-tight text-gray-500" v-html="option.label"></div>
        <div class="font-semibold text-gray-600">€{{ option.cost }}</div>
      </div>
      <LoadingIcon v-if="option.id !== activeOption && isUpdatingCart" />
      <template v-else>
        <svg
          v-if="option.id === activeOption"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          width="20"
          height="20"
          class="rounded-full text-white p-1"
          fill="currentColor">
          <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
        </svg>
      </template>
    </div>
  </div>
</template>

<script setup>
const { updateShippingMethod, isUpdatingCart } = useCart();
const props = defineProps({
  options: { type: Array, required: true },
  activeOption: { type: String, required: true },
});

const setActiveOption = async (id) => {
  await updateShippingMethod(id);
};
</script>

<style lang="postcss">
.shipping-options {
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
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
