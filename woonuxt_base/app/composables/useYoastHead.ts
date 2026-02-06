import type { SeoHeadData, SeoLink, SeoMeta, SeoScript } from '~/woonuxt_base/app/types/seo-provider';
import { computed, ref } from 'vue';

// Server-safe HTML parser using regex (works on both server and client)
function parseYoastHeadSSR(html: string | undefined): SeoHeadData {
  if (!html) return { title: '', meta: [], link: [], script: [] };

  const meta: SeoMeta[] = [];
  const link: SeoLink[] = [];
  const script: SeoScript[] = [];
  let title = '';

  // Parse meta tags
  const metaRegex = /<meta\s+([^>]*?)>/gi;
  let metaMatch;
  while ((metaMatch = metaRegex.exec(html)) !== null) {
    const attrs = metaMatch[1] || '';
    const nameMatch = /name=["']([^"']+)["']/i.exec(attrs);
    const propertyMatch = /property=["']([^"']+)["']/i.exec(attrs);
    const contentMatch = /content=["']([^"']+)["']/i.exec(attrs);

    if (contentMatch?.[1]) {
      meta.push({
        name: nameMatch?.[1],
        property: propertyMatch?.[1],
        content: contentMatch[1],
      });
    }
  }

  // Parse link tags
  const linkRegex = /<link\s+([^>]*?)>/gi;
  let linkMatch;
  while ((linkMatch = linkRegex.exec(html)) !== null) {
    const attrs = linkMatch[1] || '';
    const relMatch = /rel=["']([^"']+)["']/i.exec(attrs);
    const hrefMatch = /href=["']([^"']+)["']/i.exec(attrs);

    if (relMatch?.[1] && hrefMatch?.[1]) {
      link.push({
        rel: relMatch[1],
        href: hrefMatch[1],
      });
    }
  }

  // Parse script tags
  const scriptRegex = /<script\s+([^>]*?)>([\s\S]*?)<\/script>/gi;
  let scriptMatch;
  while ((scriptMatch = scriptRegex.exec(html)) !== null) {
    const attrs = scriptMatch[1] || '';
    const typeMatch = /type=["']([^"']+)["']/i.exec(attrs);
    const innerHTML = scriptMatch[2] || '';
    script.push({
      type: typeMatch?.[1] || 'application/ld+json',
      innerHTML,
    });
  }

  // Parse title tag
  const titleRegex = /<title>([\s\S]*?)<\/title>/i;
  const titleMatch = titleRegex.exec(html);
  if (titleMatch?.[1]) {
    title = titleMatch[1];
  }

  return { title, meta, link, script };
}

export function useYoastHead(fullYoastHead: string | undefined) {
  // Parse Yoast head immediately (works on both server and client)
  const parsed = ref<SeoHeadData>(parseYoastHeadSSR(fullYoastHead));
  const head = computed(() => parsed.value);
  return head.value;
}
