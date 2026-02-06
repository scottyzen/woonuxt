<script setup lang="ts">
const { wooNuxtSEO, stripHtml } = useHelpers();
const { info } = defineProps({ info: { type: Object as PropType<Product>, required: true } });

// Yoast-specific head HTML
const yoastHeadHtml = info.fullYoastHead || '';

const defaults = {
  title: info.name,
  description: info.shortDescription || info.description ? stripHtml(info.shortDescription || '') : stripHtml(info.description || ''),
  siteName: process.env.SITE_TITLE ?? 'WooNuxt',
  ogSiteName: process.env.SITE_TITLE ?? 'WooNuxt',
};

const seoHead = useYoastHead(yoastHeadHtml);

useHead({
  title: seoHead.title,
  meta: seoHead.meta,
  link: seoHead.link,
  script: (seoHead.script as Array<{ type: string; json: any }>).map((s) => ({ type: s.type, innerHTML: JSON.stringify(s.json) })),
});
</script>

<template>
  <!-- Yoast SEO head tags are injected via useHead composable. -->
  <div style="display: none"></div>
</template>
