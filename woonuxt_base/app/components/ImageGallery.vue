<template>
  <div v-if="images.length" class="flex flex-col sm:flex-row gap-3 items-start">
    <!-- Hoofdafbeelding -->
    <div class="flex-1 flex justify-center">
      <img
        :src="activeImage.src"
        :alt="activeImage.alt || 'Product afbeelding'"
        class="w-full max-w-md max-h-80 rounded-lg border bg-white object-contain"
      />
    </div>

    <!-- Thumbnails rechts -->
    <div
      v-if="images.length > 1"
      class="flex sm:flex-col gap-2 sm:overflow-y-auto overflow-x-auto max-h-80 w-full sm:w-20 shrink-0"
    >
      <img
        v-for="(img, index) in images"
        :key="index"
        :src="img.thumbnail || img.src"
        :alt="img.alt || 'Product afbeelding'"
        class="w-20 h-20 object-contain rounded-md border cursor-pointer hover:opacity-80 transition"
        :class="{ 'border-blue-500 ring-1 ring-blue-300': activeIndex === index }"
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
 * ✅ WooNuxt-compatibele ImageGallery
 * Werkt met: galleryImages, image, featuredImage
 * Fix voor ExternalProduct (die vaak alleen product.image heeft)
 */
const props = defineProps<{
  gallery?: Array<{
    src?: string
    sourceUrl?: string
    thumbnail?: string
    alt?: string
    altText?: string
  }> | null
  image?: {
    sourceUrl?: string
    altText?: string
  } | null
  featuredImage?: {
    sourceUrl?: string
    altText?: string
  } | null
}>()

// 🔹 Verzamel afbeeldingen uit alle mogelijke bronnen
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

  // 🔸 Fallback: ExternalProduct of producten zonder gallery
  if (!gallery.length) {
    const fallbackSrc =
      props.image?.sourceUrl ||
      props.featuredImage?.sourceUrl ||
      '/images/placeholder.jpg'

    const fallbackAlt =
      props.image?.altText ||
      props.featuredImage?.altText ||
      'Product afbeelding'

    gallery.push({
      src: fallbackSrc,
      thumbnail: fallbackSrc,
      alt: fallbackAlt,
    })
  }

  return gallery
})

const activeIndex = ref(0)
const activeImage = computed(() => images.value[activeIndex.value] || {})
</script>

<style scoped>
img {
  transition: opacity 0.2s ease, border-color 0.2s ease;
}
</style>
