<template>
  <div class="space-y-4">
    <!-- Grote afbeelding -->
    <div class="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg border">
      <img
        :src="activeImage?.src"
        :alt="activeImage?.alt || 'Productafbeelding'"
        class="object-cover w-full h-full"
      />
    </div>

    <!-- Thumbnails -->
    <div class="flex gap-3 overflow-x-auto">
      <button
        v-for="(img, index) in gallery"
        :key="index"
        @click="activeImage = img"
        class="flex-shrink-0 border-2 rounded overflow-hidden"
        :class="{
          'border-primary': img.src === activeImage?.src,
          'border-transparent': img.src !== activeImage?.src
        }"
      >
        <img
          :src="img.thumbnail || img.src"
          :alt="img.alt || `Afbeelding ${index + 1}`"
          class="w-16 h-16 object-cover"
        />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  gallery: Array<{ src: string; alt?: string; thumbnail?: string }>
}>()

const activeImage = ref(gallery[0])
</script>
