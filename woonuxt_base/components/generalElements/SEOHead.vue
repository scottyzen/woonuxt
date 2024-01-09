<script setup lang="ts">
const img = useImage();
const { info } = defineProps({ info: { type: Object, required: true } });
const imageURL = info.image.sourceUrl || '/images/placeholdcer.jpg';

const twitterImageSrc = img.getSizes(imageURL, { width: 1600, height: 900 });
const facebookImageSrc = img.getSizes(imageURL, { width: 1200, height: 630 });
const pinterestImageSrc = img.getSizes(imageURL, { width: 1000, height: 1500 });
const ogImageSrc = img.getSizes(imageURL, { width: 1200, height: 630 });
</script>

<template>
  <div>
    <Head>
      <Title>{{ info.name }}</Title>
      <Meta name="description" hid="description" :content="info.description" />
      <Meta property="og:url" hid="og:url" content="`https://v3.woonuxt.com/product/${info.slug}`" />
      <Meta property="og:type" hid="og:type" content="website" />
      <Meta property="og:title" hid="og:title" :content="info.name" />
      <Meta property="og:description" hid="og:description" :content="info.description" />
      <Meta property="og:image" hid="og:image" :content="ogImageSrc.src" />
      <Meta property="twitter:card" hid="twitter:card" content="summary_large_image" />
      <Meta property="twitter:domain" hid="twitter:domain" content="v3.woonuxt.com" />
      <Meta property="twitter:url" hid="twitter:url" content="`https://v3.woonuxt.com/product/${info.slug}`" />
      <Meta property="twitter:title" hid="twitter:title" :content="info.name" />
      <Meta property="twitter:description" hid="twitter:description" :content="info.description" />
      <Meta property="twitter:image" hid="twitter:image" :content="twitterImageSrc.src" />
      <Meta property="pinterest:domain" hid="pinterest:domain" content="v3.woonuxt.com" />
      <Meta property="pinterest:url" hid="pinterest:url" content="`https://v3.woonuxt.com/product/${info.slug}`" />
      <Meta property="pinterest:title" hid="pinterest:title" :content="info.name" />
      <Meta property="pinterest:description" hid="pinterest:description" :content="info.description" />
      <Meta property="pinterest:image" hid="pinterest:image" :content="pinterestImageSrc.src || ''" />
      <Meta property="og:image:width" hid="og:image:width" content="1200" />
      <Meta property="og:image:height" hid="og:image:height" content="630" />
      <Meta property="twitter:image:width" hid="twitter:image:width" content="1600" />
      <Meta property="twitter:image:height" hid="twitter:image:height" content="900" />
      <Meta property="pinterest:image:width" hid="pinterest:image:width" content="1000" />
      <Meta property="pinterest:image:height" hid="pinterest:image:height" content="1500" />
    </Head>
  </div>
</template>
