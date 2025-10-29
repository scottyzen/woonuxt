import { useCategory } from '#woo' // belangrijk: Woonuxt helper
import getCategoryChildren from '~/graphql/queries/getCategoryChildren.gql'

export function useCategoryChildren() {
  const { category } = useCategory() // haalt de echte categorie op via WP
  const children = ref([])
  const error = ref(null)

  watchEffect(async () => {
    if (!category.value?.slug) {
      console.warn('⚠️ Geen category gevonden of geen slug beschikbaar', category.value)
      return
    }

    const slug = category.value.slug
    console.log('🧭 Echte WP categorie-slug (widget):', slug)

    try {
      const gql = useGql()
      const { data } = await gql.query({
        query: getCategoryChildren,
        variables: { slug }
      })

      if (data?.productCategory) {
        console.log('✅ GraphQL data ontvangen:', data)
        children.value = data.productCategory.children?.nodes || []
      } else {
        console.warn('⚠️ Geen productCategory gevonden voor', slug)
      }
    } catch (err) {
      console.error('❌ GraphQL fout in useCategoryChildren:', err)
      error.value = err
    }
  })

  return { category, children, error }
}
