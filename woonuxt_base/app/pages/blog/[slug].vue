<script setup lang="ts">
import GetPostBySlug from '~/graphql/queries/getPostBySlug.gql'
import BlogContent from '~/components/blog/BlogContent.vue'

// 🔹 route ophalen
const route = useRoute()

// 🔹 Data ophalen via WooNuxt helper
const { data, pending, error } = await useAsyncGql(GetPostBySlug, {
  slug: route.params.slug,
})

// 🔹 Reactieve post-data
const post = computed(() => data.value?.post || null)

// 🔹 SEO meta opbouwen
useHead(() => ({
  title: post.value?.title || 'Artikel - Kledingzoeken.nl',
  meta: [
    { name: 'description', content: post.value?.excerpt || '' },
    { property: 'og:title', content: post.value?.title },
    { property: 'og:image', content: post.value?.featuredImage?.node?.sourceUrl },
  ],
}))
</script>

<template>
  <main class="container mx-auto px-4 py-10">
    <BlogContent v-if="post?.id" :post="post" />
    <div v-else-if="pending" class="text-center text-gray-400">Artikel wordt geladen...</div>
    <div v-else class="text-center text-red-400">Artikel niet gevonden.</div>
  </main>
</template>
