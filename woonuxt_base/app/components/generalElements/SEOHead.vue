<script setup lang="ts">
import type { ProductDetail } from '#types/gql';
import type { SeoHeadData } from '#types/seo-provider';

const { path } = useRoute();
const { info } = defineProps({ info: { type: Object as PropType<ProductDetail>, required: true } });

const fallbacks = useSEOFallbacks(info, path);
const yoastHead = info.fullYoastHead;

const seoData: SeoHeadData = typeof yoastHead === 'string' && yoastHead.trim() ? mergeSEOFallbacks(useYoastHead(yoastHead), fallbacks) : fallbacks;

useHead({
  title: seoData.title,
  meta: seoData.meta,
  link: seoData.link,
  script: seoData.script.map((item) => ({ type: item.type, innerHTML: item.innerHTML })),
});
</script>

<template>
  <div style="display: none"></div>
</template>
