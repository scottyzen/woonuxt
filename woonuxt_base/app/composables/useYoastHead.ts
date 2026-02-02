import { computed, ref, onMounted } from 'vue';

// Minimal parser for Yoast fullYoastHead HTML string (client-only)
function parseYoastHead(html: string) {
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
  return { title, meta, link, script };
}

export function useYoastHead(fullYoastHead: string) {
  const parsed = ref({ title: '', meta: [], link: [], script: [] });
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
