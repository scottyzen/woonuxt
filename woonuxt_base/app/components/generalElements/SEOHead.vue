<script setup lang="ts">
import { useYoastHead } from '~/woonuxt_base/app/composables/useYoastHead';

// Types for Yoast head parsing
interface YoastScript {
  type: string;
  innerHTML: string;
}
interface YoastHead {
  title: string;
  meta: Array<Record<string, string>>;
  link: Array<Record<string, string>>;
  script: YoastScript[];
}

// Types for SEO providers
interface SEOProvider {
  provider?: string;
  url?: string;
  handle?: string;
}

const { frontEndUrl, wooNuxtSEO, stripHtml } = useHelpers();
const { path } = useRoute();
const { info } = defineProps({ info: { type: Object as PropType<Product>, required: true } });

// If Yoast is present, use its head tags with fallbacks
let yoastHead: YoastHead | null = null;
if (info.fullYoastHead && info.fullYoastHead.trim()) {
  yoastHead = useYoastHead(info.fullYoastHead) as YoastHead;

  // Validate Yoast data and apply fallbacks
  const title = yoastHead.title || info.name || 'WooNuxt';
  const description = info.shortDescription || info.description || '';

  // Fallback for missing OG image (use Nuxt Image if no Yoast image)
  const img = useImage();
  const imageURL = info.image?.sourceUrl ?? '/images/placeholder.jpg';
  const ogImageSrc = img(imageURL, { width: 1200, height: 630, quality: 90 });
  const makeAbsolute = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${frontEndUrl}${url}`;
  };
  const fallbackOgImage = makeAbsolute(ogImageSrc);

  // Check if OG image is missing in Yoast meta, and add fallback
  const hasOgImage = yoastHead.meta?.some((m) => m.property === 'og:image' && m.content);
  if (!hasOgImage && fallbackOgImage) {
    yoastHead.meta.push({ property: 'og:image', content: fallbackOgImage });
  }

  useHead({
    title,
    meta: yoastHead.meta,
    link: yoastHead.link,
    script: (yoastHead.script || []).map((s: YoastScript) => ({ type: s.type, innerHTML: s.innerHTML })),
  });
} else {
  // Default/fallback meta tags
  const title = info.name;
  const canonical = `${frontEndUrl}${path}`;
  const siteName = process.env.SITE_TITLE ?? 'WooNuxt';
  const img = useImage();
  const imageURL = info.image?.sourceUrl ?? '/images/placeholder.jpg';
  // Generate optimized image URLs using Nuxt Image (1200x630 for og:image, 1600x900 for twitter:image)
  const ogImageSrc = img(imageURL, { width: 1200, height: 630, quality: 90 });
  const twitterImageSrc = img(imageURL, { width: 1600, height: 900, quality: 90 });
  // Ensure absolute URLs
  const makeAbsolute = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${frontEndUrl}${url}`;
  };
  const ogImage = makeAbsolute(ogImageSrc);
  const twitterImage = makeAbsolute(twitterImageSrc);
  const description = info.shortDescription || info.description ? stripHtml(info.shortDescription || '') : stripHtml(info.description || '');
  const facebook = (wooNuxtSEO as SEOProvider[] | undefined)?.find((item) => item?.provider === 'facebook') ?? null;
  const twitter = (wooNuxtSEO as SEOProvider[] | undefined)?.find((item) => item?.provider === 'twitter') ?? null;

  useHead({
    title,
    meta: [
      description ? { name: 'description', content: description } : undefined,
      { name: 'image', content: ogImage },
      { property: 'og:site_name', content: siteName },
      { property: 'og:url', content: canonical },
      info.name ? { property: 'og:title', content: info.name } : undefined,
      description ? { property: 'og:description', content: description } : undefined,
      { property: 'og:image', content: ogImage },
      facebook && facebook.url ? { property: 'article:publisher', content: facebook.url } : undefined,
      { name: 'twitter:card', content: 'summary_large_image' },
      twitter && twitter.handle ? { name: 'twitter:site', content: twitter.handle } : undefined,
      info.name ? { name: 'twitter:title', content: info.name } : undefined,
      description ? { name: 'twitter:description', content: description } : undefined,
      { name: 'twitter:image', content: twitterImage },
      { name: 'twitter:url', content: canonical },
    ].filter(Boolean),
    link: [{ rel: 'canonical', href: canonical }],
  });
}
</script>

<template>
  <!-- SEO head tags are injected via useHead composable. -->
  <div style="display: none"></div>
</template>
