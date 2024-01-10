<script setup lang="ts">
const { frontEndUrl, wooNuxtSEO } = useHelpers();
const { path } = useRoute();

const img = useImage();
const { info } = defineProps({ info: { type: Object, required: true } });

const title = info.name;
const canonical = `${frontEndUrl}${path}`;
const siteName = process.env.SITE_TITLE || 'WooNuxt';

const imageURL = info.image.sourceUrl || '/images/placeholder.jpg';
const defaultImage = img.getSizes(imageURL, { width: 1200, height: 630 }).src;
const twitterImageSrc = img.getSizes(imageURL, { width: 1600, height: 900 }).src;
</script>

<template>
  <div>
    <Head>
      <Title>{{ title }}</Title>
      <Meta name="description" hid="description" :content="info.description" />
      <Meta name="image" hid="image" :content="defaultImage" />
      <Meta property="og:site_name" hid="og:site_name" :content="siteName" />
      <Meta property="og:url" hid="og:url" :content="canonical" />
      <Meta property="og:title" hid="og:title" :content="info.name" />
      <Meta property="og:description" hid="og:description" :content="info.description" />
      <Meta property="og:image" hid="og:image" :content="defaultImage" />
      <Meta v-if="wooNuxtSEO.facebook" property="article:publisher" hid="article:publisher" :content="wooNuxtSEO.facebook" />
      <Meta name="twitter:card" hid="twitter:card" content="summary_large_image" />
      <Meta name="twitter:title" hid="twitter:title" :content="info.name" />
      <Meta name="twitter:description" hid="twitter:description" :content="info.description" />
      <Meta name="twitter:image" hid="twitter:image" :content="twitterImageSrc" />
      <Meta name="twitter:url" hid="twitter:url" :content="canonical" />
      <Link rel="canonical" hid="canonical" :href="canonical" />
    </Head>
  </div>
</template>
