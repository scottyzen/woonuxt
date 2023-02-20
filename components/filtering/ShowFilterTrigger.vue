<script setup>
const { toggleBodyClass, removeBodyClass } = useHelpers();
onBeforeUnmount(() => {
  removeBodyClass('show-filters');
});
</script>

<template>
  <div class="-space-x-px rounded-m shadow-sm isolate inline-flex">
    <button
      class="bg-white border rounded-md font-medium border-gray-300 text-sm p-2 text-gray-500 relative inline-flex items-center hover:bg-gray-50 focus:z-20"
      aria-label="Show filters"
      @click="toggleBodyClass('show-filters')">
      <Icon name="ion:funnel-outline" size="18" class="transform transform-origin-center transition-transform" />
    </button>
  </div>
</template>
