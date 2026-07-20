<script setup lang="ts">
import type { ResolvableLink, ResolvableMeta, ResolvableScript } from '@unhead/vue';
import type { ProductDetail } from '#types/gql';
import type { SeoHeadData } from '#types/seo-provider';

const { path } = useRoute();
const { info } = defineProps({ info: { type: Object as PropType<ProductDetail>, required: true } });

const fallbacks = useSEOFallbacks(info, path);
const yoastHead = info.fullYoastHead;

const seoData: SeoHeadData = typeof yoastHead === 'string' && yoastHead.trim() ? mergeSEOFallbacks(useYoastHead(yoastHead), fallbacks) : fallbacks;

useHead({
  title: seoData.title,
  meta: seoData.meta as ResolvableMeta[],
  link: seoData.link as ResolvableLink[],
  script: seoData.script.map((item) => ({ type: item.type, innerHTML: item.innerHTML })) as ResolvableScript[],
});
</script>

<template>
  <div style="display: none"></div>
</template>
