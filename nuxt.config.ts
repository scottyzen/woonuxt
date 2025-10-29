import { defineNuxtConfig } from 'nuxt/config'
import { resolve } from 'pathe'

export default defineNuxtConfig({
  // Base theme
  extends: ['./woonuxt_base'],

  // API keys & public config
  runtimeConfig: {
    public: {
      wcKey: process.env.WC_KEY,
      wcSecret: process.env.WC_SECRET,
    },
  },

  // Componentenmap (voorkomt dubbele importen)
  components: [
    { path: './components', pathPrefix: false },
  ],

  // Nitro build settings (voor Netlify etc.)
  nitro: {
    prerender: {
      concurrency: 10,
      interval: 1000,
      failOnError: false,

      // ✅ Dynamisch alle categorieën ophalen en prerenderen
      routes: async () => {
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

          console.log('✅ [Prerender] Aantal categorieën gevonden:', slugs.length)

          // Voeg alle categorieën toe als statische routes
          return slugs.map((slug: string) => `/${slug}`)
        } catch (err) {
          console.warn('⚠️ [Prerender] Kon categorieën niet ophalen:', err)
          return []
        }
      },
    },

    minify: true,
  },

  // ✅ Vite plugin om .gql-bestanden te kunnen importeren
  vite: {
    plugins: [require('@rollup/plugin-graphql')()],
  },
})
