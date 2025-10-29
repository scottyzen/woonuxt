import { ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useNuxtApp } from '#app'
import getCategoryByUri from '~/graphql/queries/getCategoryByUri.gql'

/**
 * Haalt de huidige categorie en eventuele subcategorieën op
 * op basis van de huidige route (URI).
 * 
 * Werkt met WPGraphQL WooCommerce (`productCategory(idType: URI)`).
 */
export function useCategoryChildren() {
  const route = useRoute()
  const category = ref<any>(null)
  const children = ref<any[]>([])
  const loading = ref(false)
  const error = ref<any>(null)

  const fetchCategory = async (uri: string) => {
    const { $graphql } = useNuxtApp()

    try {
      loading.value = true
      error.value = null

      const { data } = await $graphql.default.request(getCategoryByUri, { uri })

      if (data?.productCategory) {
        const cat = data.productCategory
        category.value = cat
        children.value = cat.children?.nodes || []

        console.log(`✅ useCategoryChildren: categorie geladen → ${cat.name}`)
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

  watchEffect(() => {
    const slug = route.params.categorySlug as string
    if (!slug) return

    const uri = `/product-category/${slug}/`
    console.log('🧭 Categorie-URI (widget):', uri)

    fetchCategory(uri)
  })

  return {
    category,
    children,
    loading,
    error
  }
}
