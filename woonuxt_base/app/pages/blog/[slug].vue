<script setup lang="ts">
import GetPostBySlug from '~/graphql/queries/getPostBySlug.gql';
import BlogContent from '~/components/blog/BlogContent.vue';

const route = useRoute();
const { data } = await useAsyncQuery(GetPostBySlug, { slug: route.params.slug });

const post = computed(() => data.value?.post);

useHead(() => ({
  title: post.value?.title || 'Artikel - Kledingzoeken.nl',
  meta: [
    { name: 'description', content: post.value?.excerpt || '' },
    { property: 'og:title', content: post.value?.title },
    { property: 'og:image', content: post.value?.featuredImage?.node?.sourceUrl },
  ],
}));
</script>

<template>
  <section class="container mx-auto px-4 py-10">
    <BlogContent v-if="post" :post="post" />
  </section>
</template>
