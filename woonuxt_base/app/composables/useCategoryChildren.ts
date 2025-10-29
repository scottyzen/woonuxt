import { useRoute } from 'vue-router'
import getCategoryChildren from '~/graphql/queries/getCategoryChildren.gql'

export function useCategoryChildren() {
  const route = useRoute()

  // WooNuxt gebruikt /[categorySlug].vue
  const slug = computed(() => String(route.params.categorySlug || ''))

  const category = ref(null)
  const children = ref([])
  const error = ref(null)

  watchEffect(async () => {
    if (!slug.value) {
      console.warn('⚠️ Geen categorySlug gevonden in route params', route.params)
      return
    }

    console.log('🧭 Categorie-slug (widget):', slug.value)

    try {
      // ✅ WooNuxt/GQL manier: gebruik $gql direct binnen useAsyncData
      const { data } = await useAsyncData(`category-children-${slug.value}`, async () => {
        const gql = useGql()
        const response = await gql.query({
          query: getCategoryChildren,
          variables: { slug: slug.value },
        })
        return response
      })

      if (data.value?.productCategory) {
        console.log('✅ GraphQL data ontvangen:', data.value)
        category.value = data.value.productCategory
        children.value = data.value.productCategory.children?.nodes || []
      } else {
        console.warn('⚠️ Geen productCategory gevonden voor', slug.value)
      }
    } catch (err) {
      console.error('❌ GraphQL-fout in useCategoryChildren:', err)
      error.value = err
    }
  })

  return { category, children, error }
}
