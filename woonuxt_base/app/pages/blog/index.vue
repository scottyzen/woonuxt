<script setup lang="ts">
import GetPosts from '~/graphql/queries/getPosts.gql';
import BlogCard from '~/components/blog/BlogCard.vue';

const { data } = await useAsyncQuery(GetPosts, { first: 12 });

useHead({
  title: 'Blog - Kledingzoeken.nl',
  meta: [
    { name: 'description', content: 'Lees het laatste nieuws, trends en tips van Kledingzoeken.nl' },
  ],
});
</script>

<template>
  <section class="container mx-auto py-10 px-4">
    <h1 class="text-3xl font-bold mb-8">Laatste artikelen</h1>
    <div class="grid gap-6 md:grid-cols-3">
      <BlogCard
        v-for="post in data?.posts?.nodes"
        :key="post.id"
        :post="post"
      />
    </div>
  </section>
</template>
