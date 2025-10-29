import { useRoute } from 'vue-router'
import getCategoryChildren from '~/graphql/queries/getCategoryChildren.gql'

export function useCategoryChildren() {
  const route = useRoute()

  // WooNuxt gebruikt de param "categorySlug" in de categoriepagina
  const slug = computed(() => {
    const p = route.params
    return p.categorySlug || ''
  })

  if (!slug.value) {
    console.warn('⚠️ Geen categorySlug gevonden in route params', route.params)
  } else {
    console.log('🧭 Categorie-slug (widget):', slug.value)
  }

  const { data, error } = useAsyncGql(getCategoryChildren, { slug })

  watchEffect(() => {
    if (error.value) {
      console.error('GraphQL error in useCategoryChildren:', error.value)
    }
    if (data.value) {
      console.log('✅ GraphQL data ontvangen:', data.value)
    }
  })

  const category = computed(() => data.value?.productCategory)
  const children = computed(() => category.value?.children?.nodes || [])

  return { category, children, error }
}
