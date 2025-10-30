<template>
  <NuxtImgOriginal
    v-bind="{ ...$attrs, src: getDirectSrc($attrs.src) }"
  />
</template>

<script setup lang="ts">
import NuxtImgOriginal from '#image/components/nuxt-img'

/**
 * Vervangt CDN behavior door directe URL
 */
function getDirectSrc(original: string): string {
  if (!original) return ''
  
  try {
    const decoded = decodeURIComponent(original)

    // Als het een /.netlify/images?url=... is
    const match = decoded.match(/url=(https?:\/\/[^&]+)/)
    if (match) return match[1]

    // Als het gewoon al een echte URL is, geef terug
    if (decoded.startsWith('http')) return decoded

    // Fallback
    return decoded
  } catch {
    return original
  }
}
</script>
