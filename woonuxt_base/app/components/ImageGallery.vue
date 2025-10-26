<template>
  <div v-if="gallery && gallery.length">
    <!-- Grote afbeelding -->
    <img
      :src="activeImage.src"
      :alt="activeImage.alt || 'Product afbeelding'"
      class="w-full rounded mb-4 object-cover"
    />

    <!-- Thumbnail galerij -->
    <div class="flex gap-2 overflow-x-auto">
      <img
        v-for="(img, index) in gallery"
        :key="index"
        :src="img.thumbnail || img.src"
        :alt="img.alt || 'Product afbeelding'"
        class="w-20 h-20 object-cover rounded border cursor-pointer hover:opacity-80"
        :class="{ 'border-blue-500': activeIndex === index }"
        @click="activeIndex = index"
      />
    </div>
  </div>
  <div v-else>
    <p class="text-sm text-gray-400">Geen afbeeldingen beschikbaar</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  gallery: Array<{
    src: string
    thumbnail?: string
    alt?: string
  }>
}>()

const activeIndex = ref(0)

const activeImage = computed(() => props.gallery[activeIndex.value])
</script>
