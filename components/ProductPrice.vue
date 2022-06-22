<template>
  <div class="flex items-baseline mt-1">
    <span class="font-semibold" :class="{ 'text-gray-400 line-through text-sm': salePrice }">{{ regularPrice }}</span>
    <span v-if="salePrice" class="font-semibold ml-2">{{ salePrice }}</span>
  </div>
</template>

<script>
export default {
  props: {
    regularPrice: {
      type: String,
      required: true,
    },
    salePrice: {
      default: null,
    },
  },
};
</script>
