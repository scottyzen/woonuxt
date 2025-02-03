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

const facebook = wooNuxtSEO?.find((item) => item.provider === 'facebook') ?? null;
const twitter = wooNuxtSEO?.find((item) => item.provider === 'twitter') ?? null;
</script>

<template>
  <Head>
    <Title>{{ title }}</Title>
    <Meta v-if="description" name="description" hid="description" :content="description" />
    <Meta name="image" hid="image" :content="defaultImage" />
    <Meta property="og:site_name" hid="og:site_name" :content="siteName" />
    <Meta property="og:url" hid="og:url" :content="canonical" />
    <Meta v-if="info.name" property="og:title" hid="og:title" :content="info.name" />
    <Meta v-if="description" property="og:description" hid="og:description" :content="description" />
    <Meta property="og:image" hid="og:image" :content="defaultImage" />
    <Meta v-if="facebook?.url" property="article:publisher" hid="article:publisher" :content="facebook.url" />
    <Meta name="twitter:card" hid="twitter:card" content="summary_large_image" />
    <Meta v-if="twitter?.handle" name="twitter:site" hid="twitter:site" :content="twitter.handle" />
    <Meta v-if="info.name" name="twitter:title" hid="twitter:title" :content="info.name" />
    <Meta v-if="description" name="twitter:description" hid="twitter:description" :content="description" />
    <Meta name="twitter:image" hid="twitter:image" :content="twitterImage" />
    <Meta name="twitter:url" hid="twitter:url" :content="canonical" />
    <Link rel="canonical" hid="canonical" :href="canonical" />
  </Head>
</template>
