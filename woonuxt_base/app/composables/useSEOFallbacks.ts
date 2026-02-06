// composables/useSEOFallbacks.ts - Renamed from useDefaultSeoHead
import type { SeoHeadData } from '~/woonuxt_base/app/types/seo-provider';

/**
 * Generate SEO fallback values from product data
 * Used by all SEO providers to ensure critical meta tags are always present
 *
 * This is the foundation of WooNuxt's "SEO-Optimized by Default" strategy:
 * If a provider (Yoast, All in One SEO, Rank Math) is missing a field,
 * we intelligently fall back to product data to ensure the best possible SEO
 */
export function useSEOFallbacks(info: any, path: string): SeoHeadData {
  const { frontEndUrl, stripHtml } = useHelpers();
  const img = useImage();

  const title = info.name || 'WooNuxt';
  const canonical = `${frontEndUrl}${path}`;
  const siteName = process.env.SITE_TITLE ?? 'WooNuxt';
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

  // Optional: Social profiles from store settings
  interface SEOProvider {
    provider?: string;
    url?: string;
    handle?: string;
  }
  const { wooNuxtSEO } = useHelpers();
  const facebook = (wooNuxtSEO as SEOProvider[] | undefined)?.find((item) => item?.provider === 'facebook') ?? null;
  const twitter = (wooNuxtSEO as SEOProvider[] | undefined)?.find((item) => item?.provider === 'twitter') ?? null;

  const meta = [
    description ? { name: 'description' as const, content: description } : undefined,
    { name: 'image' as const, content: ogImage },
    { property: 'og:site_name' as const, content: siteName },
    { property: 'og:url' as const, content: canonical },
    info.name ? { property: 'og:title' as const, content: info.name } : undefined,
    description ? { property: 'og:description' as const, content: description } : undefined,
    { property: 'og:image' as const, content: ogImage },
    facebook && facebook.url ? { property: 'article:publisher' as const, content: facebook.url } : undefined,
    { name: 'twitter:card' as const, content: 'summary_large_image' },
    twitter && twitter.handle ? { name: 'twitter:site' as const, content: twitter.handle } : undefined,
    info.name ? { name: 'twitter:title' as const, content: info.name } : undefined,
    description ? { name: 'twitter:description' as const, content: description } : undefined,
    { name: 'twitter:image' as const, content: twitterImage },
    { name: 'twitter:url' as const, content: canonical },
  ].filter(Boolean) as SeoHeadData['meta'];

  const link = [{ rel: 'canonical', href: canonical }];

  return {
    title,
    meta,
    link,
    script: [],
  };
}

/**
 * Merge fallback values into existing SEO data
 * Fills in missing fields from a provider (Yoast, All in One SEO, Rank Math)
 * with intelligent defaults from product data
 */
export function mergeSEOFallbacks(providerData: SeoHeadData, fallbacks: SeoHeadData): SeoHeadData {
  // Use provider title, fallback to product name
  if (!providerData.title) {
    providerData.title = fallbacks.title;
  }

  // Add missing meta tags from fallbacks
  const existingMetaKeys = new Set(providerData.meta.map((m) => m.property || m.name).filter(Boolean));

  fallbacks.meta.forEach((fallbackMeta) => {
    const key = fallbackMeta.property || fallbackMeta.name;
    if (key && !existingMetaKeys.has(key)) {
      providerData.meta.push(fallbackMeta);
    }
  });

  // Add missing link tags from fallbacks (usually canonical)
  const existingLinkRels = new Set(providerData.link.map((l) => l.rel));
  fallbacks.link.forEach((fallbackLink) => {
    if (!existingLinkRels.has(fallbackLink.rel)) {
      providerData.link.push(fallbackLink);
    }
  });

  // Scripts are provider-specific, don't merge (Yoast may have ld+json, fallbacks don't)

  return providerData;
}
