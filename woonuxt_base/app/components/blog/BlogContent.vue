<template>
  <article class="max-w-3xl mx-auto px-4 py-10 prose prose-lg prose-img:rounded-2xl prose-headings:font-semibold">
    <!-- 🖼️ Featured image met NuxtImg -->
    <NuxtImg
      v-if="post.featuredImage?.node?.sourceUrl"
      :src="post.featuredImage.node.sourceUrl"
      :alt="post.title?.replace(/<[^>]+>/g, '')"
      format="webp"
      class="w-full rounded-2xl mb-8"
      sizes="(max-width: 768px) 100vw, 768px"
      loading="eager"
    />

    <!-- 📰 Titel -->
    <h1 class="text-3xl font-bold mb-4 leading-tight" v-html="post.title" />

    <!-- 📅 Datum -->
    <div class="text-sm text-gray-500 mb-10">
      Gepubliceerd op {{ formatDate(post.date) }}
    </div>

    <!-- 🧾 Inhoud -->
    <div v-html="post.content" class="prose max-w-none" />
  </article>
</template>

<script setup lang="ts">
defineProps({
  post: { type: Object, required: true },
})

// 🔹 Datum formatter consistent met andere pagina’s
function formatDate(date: string) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('nl-NL', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}
</script>
