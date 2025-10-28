<script setup lang="ts">
import BlogCard from '~/components/blog/BlogCard.vue'

// 🔹 Data ophalen via Woonuxt helper
const { data, pending, error } = await useAsyncGql('GetPosts', { first: 12 })

if (error.value) {
  console.error('GraphQL fout bij GetPosts:', error.value)
}

useHead({
  title: 'Blog - Kledingzoeken.nl',
  meta: [
    {
      name: 'description',
      content: 'Lees het laatste nieuws, trends en stijltips van Kledingzoeken.nl.',
    },
  ],
})
</script>

<template>
  <section class="container mx-auto py-10 px-4">
    <h1 class="text-3xl font-bold mb-8">Laatste artikelen</h1>

    <div v-if="pending" class="text-center text-gray-400">Artikelen laden...</div>

    <div v-else-if="error" class="text-center text-red-400">
      Er ging iets mis bij het laden van de artikelen.
    </div>

    <div v-else class="grid gap-6 md:grid-cols-3">
      <BlogCard
        v-for="post in data?.posts?.nodes"
        :key="post.id"
        :post="post"
      />
    </div>
  </section>
</template>
