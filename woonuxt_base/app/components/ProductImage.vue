<template>
  <div class="product-image">
    <NuxtImg
      v-if="image?.sourceUrl"
      :src="image.sourceUrl"
      :alt="image.altText || ''"
      :width="width"
      :height="height"
      :loading="loading"
      placeholder
      placeholder-class="blur-xl"
      class="rounded-lg object-cover w-full h-full"
    />
    <div v-else class="flex items-center justify-center bg-gray-100 rounded-lg w-full h-full">
      <Icon name="ion:image-outline" size="48" class="text-gray-400" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  image: {
    type: Object,
    default: () => ({})
  },
  width: {
    type: [Number, String],
    default: 400
  },
  height: {
    type: [Number, String],
    default: 400
  },
  loading: {
    type: String,
    default: 'lazy'
  }
});
</script>

<style scoped>
.product-image {
  position: relative;
  overflow: hidden;
}
</style> 
