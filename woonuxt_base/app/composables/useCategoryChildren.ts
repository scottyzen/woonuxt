import { useRoute } from 'vue-router'
import getCategoryChildren from '~/graphql/queries/getCategoryChildren.gql'

export function useCategoryChildren() {
  const route = useRoute()
  const children = ref([])
  const category = ref(null)
  const error = ref(null)

  // WooNuxt gebruikt meestal /categorie/:categorySlug
  const slug = computed(() => String(route.params.categorySlug || ''))

  watchEffect(async () => {
    if (!slug.value) {
      console.warn('⚠️ Geen categorySlug gevonden in route params', route.params)
      return
    }

    console.log('🧭 Huidige categorie-slug (widget):', slug.value)

    try {
      const gql = useGql()
      const { data } = await gql.query({
        query: getCategoryChildren,
        variables: { slug: slug.value },
      })

      if (data?.productCategory) {
        console.log('✅ GraphQL data ontvangen:', data)
        category.value = data.productCategory
        children.value = data.productCategory.children?.nodes || []
      } else {
        console.warn('⚠️ Geen productCategory gevonden voor', slug.value)
      }
    } catch (err) {
      console.error('❌ GraphQL fout in useCategoryChildren:', err)
      error.value = err
    }
  })

  return { category, children, error }
}
