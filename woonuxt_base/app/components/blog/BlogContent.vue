<template>
  <article class="max-w-3xl mx-auto px-4 py-10 prose prose-lg">
    <img
      v-if="post.featuredImage?.node?.sourceUrl"
      :src="post.featuredImage.node.sourceUrl"
      :alt="post.title"
      class="w-full rounded-2xl mb-6"
    />
    <h1 class="text-3xl font-bold mb-4" v-html="post.title" />
    <div class="text-sm text-gray-500 mb-8">
      Gepubliceerd op {{ new Date(post.date).toLocaleDateString('nl-NL') }}
    </div>
    <div v-html="post.content" class="prose" />
  </article>
</template>

<script setup lang="ts">
defineProps({
  post: { type: Object, required: true },
});
</script>
