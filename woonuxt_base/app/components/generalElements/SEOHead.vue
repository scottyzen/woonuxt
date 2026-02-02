<script setup lang="ts">
import { type PropType } from 'vue';
import type { SeoHeadData } from '~/woonuxt_base/app/types/seo-provider';
import { useYoastHead } from '~/woonuxt_base/app/composables/useYoastHead';
import { useSEOFallbacks, mergeSEOFallbacks } from '~/woonuxt_base/app/composables/useSEOFallbacks';

const { path } = useRoute();
const { info } = defineProps({ info: { type: Object as PropType<Product>, required: true } });

// Get fallback values (used by all providers)
const fallbacks = useSEOFallbacks(info, path);

// Determine which SEO provider to use (in order of priority)
let seoData: SeoHeadData | null = null;

// 1. Check Yoast SEO (currently available)
if (info.fullYoastHead && info.fullYoastHead.trim()) {
  seoData = useYoastHead(info.fullYoastHead) as SeoHeadData;
  // Merge in fallback values for any missing fields
  seoData = mergeSEOFallbacks(seoData, fallbacks);
}

// 2. TODO: Check All in One SEO (when available)
// else if (hasAllInOneSEOData(info)) {
//   seoData = useAllInOneSeoHead(info) as SeoHeadData;
//   seoData = mergeSEOFallbacks(seoData, fallbacks);
// }

// 3. TODO: Check Rank Math (when available)
// else if (hasRankMathData(info)) {
//   seoData = useRankMathHead(info) as SeoHeadData;
//   seoData = mergeSEOFallbacks(seoData, fallbacks);
// }

// 4. Use fallback SEO tags as default
else {
  seoData = fallbacks;
}

// Inject head tags via Nuxt useHead
useHead({
  title: seoData.title,
  meta: seoData.meta as any,
  link: seoData.link as any,
  script: (seoData.script || []).map((s) => ({ type: s.type, innerHTML: s.innerHTML })) as any,
} as any);
</script>

<template>
  <!-- SEO head tags are injected via useHead composable. -->
  <div style="display: none"></div>
</template>
