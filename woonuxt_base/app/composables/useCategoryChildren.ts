import { ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useNuxtApp } from '#app'
import getCategoryByUri from '~/graphql/queries/getCategoryByUri.gql'

/**
 * Haalt de huidige categorie en subcategorieën op uit WooCommerce GraphQL
 * op basis van de URI (bijv. /product-category/dames/dames-kleding/broeken/).
 */
export function useCategoryChildren() {
  const route = useRoute()
  const category = ref(null)
  const children = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchCategory = async (uri: string) => {
    const { $graphql } = useNuxtApp()

    try {
      loading.value = true
      error.value = null

      const { data } = await $graphql.request(getCategoryByUri, { uri })

      if (data?.productCategory) {
        category.value = data.productCategory
        children.value = data.productCategory.children?.nodes || []
        console.log(`✅ Categorie geladen: ${category.value.name}`)
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
