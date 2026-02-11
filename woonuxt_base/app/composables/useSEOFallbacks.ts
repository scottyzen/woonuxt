import type { ProductDetail, WooNuxtSEOItem } from '#types/gql';

import type { SeoHeadData } from '#types/seo-provider';

export function useSEOFallbacks(info: ProductDetail, path: string): SeoHeadData {
  const { frontEndUrl, stripHtml, wooNuxtSEO } = useHelpers();
  const img = useImage();

  const title = info.name || 'WooNuxt';
  const canonical = frontEndUrl ? `${frontEndUrl}${path}` : path;
  const siteName = process.env.SITE_TITLE ?? 'WooNuxt';
  const imageURL = info.image?.sourceUrl ?? '/images/placeholder.jpg';

  const ogImageSrc = img(imageURL, { width: 1200, height: 630, quality: 90 });
  const twitterImageSrc = img(imageURL, { width: 1600, height: 900, quality: 90 });

  const makeAbsolute = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    if (!frontEndUrl) return url;
    return `${frontEndUrl}${url.startsWith('/') ? url : `/${url}`}`;
  };

  const ogImage = makeAbsolute(ogImageSrc);
  const twitterImage = makeAbsolute(twitterImageSrc);
  const description = stripHtml(info.shortDescription || info.description || '');

  const facebook = (wooNuxtSEO as WooNuxtSEOItem[] | undefined)?.find((item) => item?.provider === 'facebook') ?? null;
  const twitter = (wooNuxtSEO as WooNuxtSEOItem[] | undefined)?.find((item) => item?.provider === 'twitter') ?? null;

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

export function mergeSEOFallbacks(providerData: SeoHeadData, fallbacks: SeoHeadData): SeoHeadData {
  const merged: SeoHeadData = {
    title: providerData.title || fallbacks.title,
    meta: [...providerData.meta],
    link: [...providerData.link],
    script: [...providerData.script],
  };
  const existingMetaKeys = new Set(merged.meta.map((m) => m.property || m.name).filter(Boolean));

  fallbacks.meta.forEach((fallbackMeta) => {
    const key = fallbackMeta.property || fallbackMeta.name;
    if (key && !existingMetaKeys.has(key)) {
      merged.meta.push(fallbackMeta);
    }
  });

  const existingLinkRels = new Set(merged.link.map((l) => l.rel));
  fallbacks.link.forEach((fallbackLink) => {
    if (!existingLinkRels.has(fallbackLink.rel)) {
      merged.link.push(fallbackLink);
    }
  });

  return merged;
}
