import { useRoute } from 'vue-router'
import { ref, watchEffect } from 'vue'
import { useGql } from '#imports'
import getCategoryByUri from '~/graphql/queries/getCategoryByUri.gql'

export function useCategoryChildren() {
  const route = useRoute()
  const category = ref(null)
  const children = ref([])
  const error = ref(null)

  watchEffect(async () => {
    const uri = `/product-category/${route.params.categorySlug}/`
    console.log('🧭 Categorie-URI (widget):', uri)

    try {
      const gql = useGql()
      const { data, error: gqlError } = await gql.query({
        query: getCategoryByUri,
        variables: { uri },
      })

      if (gqlError?.value) throw gqlError.value

      const cat = data?.value?.productCategory
      if (!cat) {
        console.warn(`⚠️ Geen productCategory gevonden voor URI: ${uri}`)
        return
      }

      category.value = cat
      children.value = cat.children?.nodes || []
      console.log('✅ Subcategorieën opgehaald:', children.value)
    } catch (err) {
      console.error('❌ GraphQL fout in useCategoryChildren:', err)
      error.value = err
    }
  })

  return { category, children, error }
}
