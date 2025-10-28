<template>
  <NuxtLink
    :to="`/blog/${post.slug}`"
    class="block bg-white rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden"
    :title="post.title?.replace(/<[^>]+>/g, '')"
  >
    <div class="aspect-[4/3] overflow-hidden">
      <NuxtImg
        v-if="post.featuredImage?.node?.sourceUrl"
        :src="post.featuredImage.node.sourceUrl"
        :alt="post.title?.replace(/<[^>]+>/g, '')"
        format="webp"
        class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
      />
      <div
        v-else
        class="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm"
      >
        Geen afbeelding
      </div>
    </div>

    <div class="p-4">
      <h3
        class="text-lg font-semibold mb-2 line-clamp-2 text-gray-900"
        v-html="post.title"
      />
      <p
        class="text-sm text-gray-600 line-clamp-3"
        v-html="post.excerpt"
      />
      <span class="text-xs text-gray-400 mt-3 block">
        {{ new Date(post.date).toLocaleDateString('nl-NL', { day: '2-digit', month: 'long', year: 'numeric' }) }}
      </span>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps({
  post: {
    type: Object,
    required: true,
  },
})
</script>
