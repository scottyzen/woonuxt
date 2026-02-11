<script setup lang="ts">
import type { Product, WooNuxtSEOItem } from '#types/gql';

const { frontEndUrl, wooNuxtSEO, stripHtml } = useHelpers();
const { path } = useRoute();
const { info } = defineProps({ info: { type: Object as PropType<Product>, required: true } });

type ProductWithYoastHead = Product & { fullYoastHead?: string | null };

const getYoastHead = (product: Product): string | null => {
  const fullYoastHead = (product as ProductWithYoastHead).fullYoastHead;
  return typeof fullYoastHead === 'string' ? fullYoastHead : null;
};

// Get fallback values (used by all providers)
const fallbacks = useSEOFallbacks(info, path);

// Determine which SEO provider to use (in order of priority)
let seoData: SeoHeadData | null = null;

const yoastHead = getYoastHead(info);

// 1. Check Yoast SEO (currently available)
if (yoastHead && yoastHead.trim()) {
  seoData = useYoastHead(yoastHead) as SeoHeadData;
  // Merge in fallback values for any missing fields
  seoData = mergeSEOFallbacks(seoData, fallbacks);
}

const img = useImage();
const imageURL = info.image?.sourceUrl ?? '/images/placeholder.jpg';
const defaultImageSrc = img.getSizes(imageURL, { sizes: '1200px', modifiers: { width: 1200, height: 630 } }).src;
const twitterImageSrc = img.getSizes(imageURL, { sizes: '1600px', modifiers: { width: 1600, height: 900 } }).src;

const getFullImageURL = (url?: string): string => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  if (!frontEndUrl) return url;
  return `${frontEndUrl}${url.startsWith('/') ? url : `/${url}`}`;
};

// 3. TODO: Check Rank Math (when available)
// else if (hasRankMathData(info)) {
//   seoData = useRankMathHead(info) as SeoHeadData;
//   seoData = mergeSEOFallbacks(seoData, fallbacks);
// }

const defaultImage = getFullImageURL(defaultImageSrc);
const twitterImage = getFullImageURL(twitterImageSrc);
const description = stripHtml(info.shortDescription || info.description || '');

const seoItems = computed(() => (wooNuxtSEO as WooNuxtSEOItem[] | undefined) ?? []);

const facebook = seoItems.value.find((item) => item?.provider === 'facebook') ?? null;
const twitter = seoItems.value.find((item) => item?.provider === 'twitter') ?? null;
</script>

<template>
  <!-- SEO head tags are injected via useHead composable. -->
  <div style="display: none"></div>
</template>
