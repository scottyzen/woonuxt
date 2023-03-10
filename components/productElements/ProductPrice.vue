<template>
  <div v-if="regularPrice" class="flex">
    <span class="font-semibold" :class="{ 'text-gray-400 line-through font-normal': salePrice }" v-html="regularPrice" />
    <span v-if="salePrice" class="font-semibold ml-2">{{ salePrice }}</span>
  </div>
</template>

<script>
export default {
  props: {
    regularPrice: { default: null },
    salePrice: { default: null },
  },
};
</script>
