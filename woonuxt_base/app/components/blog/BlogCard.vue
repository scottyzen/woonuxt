<template>
  <NuxtLink :to="`/blog/${post.slug}`" class="block bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden">
    <img
      v-if="post.featuredImage?.node?.sourceUrl"
      :src="post.featuredImage.node.sourceUrl"
      :alt="post.title"
      class="w-full h-48 object-cover"
    />
    <div class="p-4">
      <h3 class="text-lg font-semibold mb-2" v-html="post.title" />
      <p class="text-gray-600 text-sm mb-3" v-html="post.excerpt" />
      <span class="text-xs text-gray-400">{{ new Date(post.date).toLocaleDateString('nl-NL') }}</span>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps({
  post: { type: Object, required: true },
});
</script>
