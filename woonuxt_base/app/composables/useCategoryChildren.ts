import { ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useAsyncData, useNuxtApp } from '#app'

/**
 * Haalt de huidige categorie en eventuele subcategorieën op
 * op basis van de huidige route (URI).
 * 
 * Compatibel met WooGraphQL (productCategoryBy(uri: "...")).
 */
export function useCategoryChildren() {
  const route = useRoute()
  const category = ref(null)
  const children = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchCategory = async (uri: string) => {
    try {
      loading.value = true
      error.value = null

      const { $graphql } = useNuxtApp()

      // GraphQL query inline gedefinieerd om typeproblemen te voorkomen
      const query = `
        query GetCategoryByUri($uri: String!) {
          productCategoryBy(uri: $uri) {
            id
            name
            uri
            slug
            parent {
              node {
                id
                name
                uri
              }
            }
            children(first: 100) {
              nodes {
                id
                name
                uri
                slug
              }
            }
          }
        }
      `

      const { data } = await $graphql.default.request(query, { uri })

      if (data?.productCategoryBy) {
        category.value = data.productCategoryBy
        children.value = data.productCategoryBy.children?.nodes || []
        console.log('✅ useCategoryChildren: categorie geladen', category.value.name)
      } else {
        console.warn(`⚠️ Geen productCategory gevonden voor uri: ${uri}`)
      }
    } catch (err: any) {
      console.error('❌ GraphQL fout in useCategoryChildren:', err)
      error.value = err
    } finally {
      loading.value = false
    }
  }

  // Houd route in de gaten → automatisch opnieuw laden bij navigatie
  watchEffect(() => {
    const slug = route.params.categorySlug as string
    if (!slug) return

    const uri = `/product-category/${slug}/`
    console.log('🧭 Categorie-URI (widget):', uri)
    fetchCategory(uri)
  })

  return { category, children, loading, error }
}
