<template>
  <div v-if="images.length" class="flex gap-3 items-start">
    <!-- Hoofdafbeelding -->
    <div class="flex-1">
      <img
        :src="activeImage.src"
        :alt="activeImage.alt || 'Product afbeelding'"
        class="w-full max-h-80 object-cover rounded-lg border"
      />
    </div>

    <!-- Thumbnails rechts -->
    <div
      v-if="images.length > 1"
      class="flex flex-col gap-2 overflow-y-auto max-h-80 w-20 shrink-0"
    >
      <img
        v-for="(img, index) in images"
        :key="index"
        :src="img.thumbnail || img.src"
        :alt="img.alt || 'Product afbeelding'"
        class="w-full aspect-square object-cover rounded-md border cursor-pointer hover:opacity-80 transition"
        :class="{
          'border-blue-500 ring-1 ring-blue-300': activeIndex === index,
        }"
        @click="activeIndex = index"
      />
    </div>
  </div>

  <div v-else>
    <p class="text-sm text-gray-400 text-center py-8">
      Geen afbeeldingen beschikbaar
    </p>
  </div>
</template>

<script setup lang="ts">
/**
 * Compacte ImageGallery.vue
 * ✅ Ondersteunt externe producten
 * ✅ Toont thumbnails rechts
 * ✅ Compatibel met WooNuxt GraphQL structuur
 */
const props = defineProps<{
  gallery?: Array<{
    src?: string
    sourceUrl?: string
    thumbnail?: string
    alt?: string
    altText?: string
  }> | null
  featuredImage?: {
    sourceUrl?: string
    altText?: string
  }
  image?: {
    sourceUrl?: string
    altText?: string
  }
}>()

// Combineer gallery, featuredImage en image in 1 lijst
const images = computed(() => {
  const gallery = (props.gallery || [])
    .filter(Boolean)
    .map((img) => ({
      src:
        img.src ||
        img.sourceUrl ||
        img.thumbnail ||
        '/images/placeholder.jpg',
      thumbnail: img.thumbnail || img.sourceUrl || img.src,
      alt: img.alt || img.altText || 'Product afbeelding',
    }))

  // ✅ Fallbacks voor externe producten
  if (!gallery.length) {
    if (props.image?.sourceUrl) {
      gallery.push({
        src: props.image.sourceUrl,
        thumbnail: props.image.sourceUrl,
        alt: props.image.altText || 'Product afbeelding',
      })
    } else if (props.featuredImage?.sourceUrl) {
      gallery.push({
        src: props.featuredImage.sourceUrl,
        thumbnail: props.featuredImage.sourceUrl,
        alt: props.featuredImage.altText || 'Product afbeelding',
      })
    }
  }

  return gallery
})

const activeIndex = ref(0)
const activeImage = computed(() => images.value[activeIndex.value] || {})
</script>

<style scoped>
img {
  transition: opacity 0.2s ease;
}
</style>
