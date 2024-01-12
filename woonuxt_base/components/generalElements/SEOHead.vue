<script setup lang="ts">
const { frontEndUrl, wooNuxtSEO, isDev } = useHelpers();
const { path } = useRoute();
const { info } = defineProps({ info: { type: Object as PropType<Product>, required: true } });

const title = info.name;
const canonical = `${frontEndUrl}${path}`;
const siteName = process.env.SITE_TITLE || 'WooNuxt';

const img = useImage();
const imagePrefix = isDev ? '' : frontEndUrl;
const imageURL = info.image?.sourceUrl || '/images/placeholder.jpg';
const defaultImage = imagePrefix + img.getSizes(imageURL, { width: 1200, height: 630 }).src;
const twitterImageSrc = imagePrefix + img.getSizes(imageURL, { width: 1600, height: 900 }).src;
</script>

<template>
  <Head>
    <Title>{{ title }}</Title>
    <Meta v-if="info.description" name="description" hid="description" :content="info.description" />
    <Meta name="image" hid="image" :content="defaultImage" />
    <Meta property="og:site_name" hid="og:site_name" :content="siteName" />
    <Meta property="og:url" hid="og:url" :content="canonical" />
    <Meta v-if="info.name" property="og:title" hid="og:title" :content="info.name" />
    <Meta v-if="info.description" property="og:description" hid="og:description" :content="info.description" />
    <Meta property="og:image" hid="og:image" :content="defaultImage" />
    <Meta v-if="wooNuxtSEO.facebook" property="article:publisher" hid="article:publisher" :content="wooNuxtSEO.facebook" />
    <Meta name="twitter:card" hid="twitter:card" content="summary_large_image" />
    <Meta v-if="info.name" name="twitter:title" hid="twitter:title" :content="info.name" />
    <Meta v-if="info.description" name="twitter:description" hid="twitter:description" :content="info.description" />
    <Meta name="twitter:image" hid="twitter:image" :content="twitterImageSrc" />
    <Meta name="twitter:url" hid="twitter:url" :content="canonical" />
    <Link rel="canonical" hid="canonical" :href="canonical" />
  </Head>
</template>
