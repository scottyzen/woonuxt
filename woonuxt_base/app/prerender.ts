// /woonuxt_base/app/prerender.ts
import { fetch } from 'undici';

export default defineNitroPlugin(async () => {
  try {
    const res = await fetch('https://wp.kledingzoeken.nl/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          {
            productCategories(first: 100) {
              nodes {
                slug
              }
            }
          }
        `,
      }),
    });

    const json = await res.json();
    const slugs = json.data?.productCategories?.nodes?.map((c: any) => `/${c.slug}`) || [];

    console.log(`✅ [Prerender Hook] Categorieën gevonden: ${slugs.length}`);

    useNitroApp().hooks.hook('nitro:config', (config) => {
      config.prerender = config.prerender || { routes: [] };
      config.prerender.routes.push(...slugs);
    });
  } catch (err) {
    console.error('❌ Fout bij ophalen categorieën voor prerender:', err);
  }
});
