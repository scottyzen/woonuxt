import { computed, onMounted, ref } from 'vue';

type YoastMeta = { name?: string; property?: string; content: string };
type YoastLink = { rel: string; href: string };
type YoastScript = { type: string; innerHTML: string };
export interface YoastHeadParsed {
  title: string;
  meta: YoastMeta[];
  link: YoastLink[];
  script: YoastScript[];
}

// Minimal parser for Yoast fullYoastHead HTML string (client-only)
function parseYoastHead(html: string): YoastHeadParsed {
  if (!html || typeof window === 'undefined' || typeof document === 'undefined') {
    return { title: '', meta: [], link: [], script: [] };
  }
  const div = document.createElement('div');
  div.innerHTML = html;
  const meta = Array.from(div.querySelectorAll('meta')).map((el) => ({
    name: el.getAttribute('name') || undefined,
    property: el.getAttribute('property') || undefined,
    content: el.getAttribute('content') || '',
  }));
  const link = Array.from(div.querySelectorAll('link')).map((el) => ({
    rel: el.getAttribute('rel') || '',
    href: el.getAttribute('href') || '',
  }));
  const script = Array.from(div.querySelectorAll('script')).map((el) => ({
    type: el.getAttribute('type') || 'application/ld+json',
    innerHTML: el.innerHTML,
  }));
  const title = div.querySelector('title')?.textContent || '';

  // Log for debugging
  console.log('Parsed Yoast Head:', { title, meta, link, script });
  return { title, meta, link, script };
}

export function useYoastHead(fullYoastHead: string) {
  const parsed = ref<YoastHeadParsed>({ title: '', meta: [], link: [], script: [] });
  if (process.client) {
    parsed.value = parseYoastHead(fullYoastHead);
  } else {
    // Hydrate on client after mount
    onMounted(() => {
      parsed.value = parseYoastHead(fullYoastHead);
    });
  }
  const head = computed(() => parsed.value);
  return head.value;
}
