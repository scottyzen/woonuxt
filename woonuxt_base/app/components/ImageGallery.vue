<template>
  <div v-if="images.length">
    <!-- Grote afbeelding -->
    <img
      :src="activeImage.src"
      :alt="activeImage.alt || 'Product afbeelding'"
      class="w-full rounded mb-4 object-cover"
    />

    <!-- Thumbnail galerij -->
    <div class="flex gap-2 overflow-x-auto">
      <img
        v-for="(img, index) in images"
        :key="index"
        :src="img.thumbnail || img.src"
        :alt="img.alt || 'Product afbeelding'"
        class="w-20 h-20 object-cover rounded border cursor-pointer hover:opacity-80 transition"
        :class="{ 'border-blue-500': activeIndex === index }"
        @click="activeIndex = index"
      />
    </div>
  </div>

  <div v-else>
    <p class="text-sm text-gray-400 text-center">
      Geen afbeeldingen beschikbaar
    </p>
  </div>
</template>

<script setup lang="ts">
/**
 * ImageGallery.vue
 * Compatibel met WooNuxt/WooCommerce GraphQL structuur:
 * - galleryImages.nodes[].sourceUrl / altText
 * - image.sourceUrl
 * - featuredImage.node.sourceUrl
 */
const props = defineProps<{
  gallery?:
    | Array<{
        src?: string
        sourceUrl?: string
        thumbnail?: string
        alt?: string
        altText?: string
      }>
    | null
  featuredImage?: {
    sourceUrl?: string
    altText?: string
  }
  image?: {
    sourceUrl?: string
    altText?: string
  }
}>()

/**
 * Combineer alle mogelijke bronnen in één uniforme lijst met:
 * { src, thumbnail, alt }
 */
const images = computed(() => {
  const gallery = (props.gallery || [])
    .filter(Boolean)
    .map((img) => ({
      src: img.src || img.sourceUrl || img.thumbnail || '/images/placeholder.jpg',
      thumbnail: img.thumbnail || img.sourceUrl || img.src,
      alt: img.alt || img.altText || 'Product afbeelding',
    }))

  // ✅ Fallback op featuredImage of image als gallery leeg is
  if (!gallery.length && (props.featuredImage?.sourceUrl || props.image?.sourceUrl)) {
    gallery.push({
      src: props.featuredImage?.sourceUrl || props.image?.sourceUrl,
      thumbnail: props.featuredImage?.sourceUrl || props.image?.sourceUrl,
      alt: props.featuredImage?.altText || props.image?.altText || 'Product afbeelding',
    })
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
