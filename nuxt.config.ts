import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  extends: ['./woonuxt_base'],

  runtimeConfig: {
    public: {
      wcKey: process.env.WC_KEY,
      wcSecret: process.env.WC_SECRET,
    },
  },

  components: [
    { path: './components', pathPrefix: false },
  ],

  nitro: {
    prerender: {
      concurrency: 10,
      interval: 1000,
      failOnError: false,
      routes: [], // <-- verplicht leeg array als startwaarde
    },
    minify: true,
  },

  vite: {
    plugins: [require('@rollup/plugin-graphql')()],
  },

  // ✅ Gebruik de nieuwe Nuxt 4 hook om dynamische prerenders toe te voegen
  hooks: {
    async 'nitro:config'(nitroConfig) {
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
        })

        const json = await res.json()
        const slugs = json?.data?.productCategories?.nodes?.map((n: any) => n.slug) || []

        console.log('✅ [Prerender Hook] Categorieën gevonden:', slugs.length)

        // Voeg dynamische categorie-routes toe
        nitroConfig.prerender.routes.push(...slugs.map((slug: string) => `/${slug}`))
      } catch (err) {
        console.warn('⚠️ [Prerender Hook] Kon categorieën niet ophalen:', err)
      }
    },
  },
})
