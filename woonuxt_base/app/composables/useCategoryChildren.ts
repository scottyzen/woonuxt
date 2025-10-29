import { ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useNuxtApp } from '#app'

/**
 * Haalt een categorie + subcategorieën op via de GraphQL API
 * op basis van de URI van de huidige route.
 */
export function useCategoryChildren() {
  const route = useRoute()
  const category = ref(null)
  const children = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchCategory = async (uri: string) => {
    const { $graphql } = useNuxtApp()

    // ✅ Let op: productCategory (niet productCategoryBy)
    const query = `
      query GetCategoryByUri($uri: ID!) {
        productCategory(id: $uri, idType: URI) {
          id
          name
          slug
          uri
          parent {
            node {
              id
              name
              slug
              uri
            }
          }
          children(first: 100) {
            nodes {
              id
              name
              slug
              uri
            }
          }
        }
      }
    `

    try {
      loading.value = true
      error.value = null

      const data = await $graphql.request(query, { uri })

      if (data?.productCategory) {
        category.value = data.productCategory
        children.value = data.productCategory.children?.nodes || []
        console.log('✅ useCategoryChildren: categorie geladen:', category.value.name)
      } else {
        console.warn(`⚠️ Geen categorie gevonden voor URI: ${uri}`)
        category.value = null
        children.value = []
      }
    } catch (err: any) {
      console.error('❌ GraphQL fout in useCategoryChildren:', err)
      error.value = err
    } finally {
      loading.value = false
    }
  }

  // 📡 Automatisch herladen bij routewijziging
  watchEffect(() => {
    const slug = route.params.categorySlug as string
    if (!slug) return

    const uri = `/product-category/${slug}/`
    console.log('🧭 Categorie-URI (widget):', uri)
    fetchCategory(uri)
  })

  return { category, children, loading, error }
}
