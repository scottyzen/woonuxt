<script setup lang="ts">
const { frontEndUrl, wooNuxtSEO, stripHtml } = useHelpers();
const { path } = useRoute();
const { info } = defineProps({ info: { type: Object as PropType<Product>, required: true } });

const title = info.name;
const canonical = `${frontEndUrl}${path}`;
const siteName = process.env.SITE_TITLE ?? 'WooNuxt';

const img = useImage();
const imageURL = info.image?.sourceUrl ?? '/images/placeholder.jpg';
const defaultImageSrc = img.getSizes(imageURL, { width: 1200, height: 630 }).src;
const twitterImageSrc = img.getSizes(imageURL, { width: 1600, height: 900 }).src;

const getFullImageURL = (url?: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${frontEndUrl}${url}`;
};

const defaultImage = getFullImageURL(defaultImageSrc);
const twitterImage = getFullImageURL(twitterImageSrc);
const description = info.shortDescription || info.description ? stripHtml(info.shortDescription || '') : stripHtml(info.description || '');

const facebook = wooNuxtSEO?.find((item) => item?.provider === 'facebook') ?? null;
const twitter = wooNuxtSEO?.find((item) => item?.provider === 'twitter') ?? null;
</script>

<template>
  <Head>
    <Title>{{ title }}</Title>
    <Meta v-if="description" name="description" :content="description" />
    <Meta name="image" :content="defaultImage" />
    <Meta property="og:site_name" :content="siteName" />
    <Meta property="og:url" :content="canonical" />
    <Meta v-if="info.name" property="og:title" :content="info.name" />
    <Meta v-if="description" property="og:description" :content="description" />
    <Meta property="og:image" :content="defaultImage" />
    <Meta v-if="facebook?.url" property="article:publisher" :content="facebook.url" />
    <Meta name="twitter:card" content="summary_large_image" />
    <Meta v-if="twitter?.handle" name="twitter:site" :content="twitter.handle" />
    <Meta v-if="info.name" name="twitter:title" :content="info.name" />
    <Meta v-if="description" name="twitter:description" :content="description" />
    <Meta name="twitter:image" :content="twitterImage" />
    <Meta name="twitter:url" :content="canonical" />
    <Link rel="canonical" :href="canonical" />
  </Head>
</template>
