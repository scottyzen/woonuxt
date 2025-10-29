import { useRoute } from 'vue-router'
import getCategoryChildren from '~/graphql/queries/getCategoryChildren.gql'

export function useCategoryChildren() {
  const route = useRoute()

  // WooNuxt gebruikt vaak nested slugs, dus hier afvangen
  const slug = computed(() => {
    const p = route.params
    if (Array.isArray(p.slug)) return p.slug[p.slug.length - 1] // laatste deel van array
    return p.slug || p.category || p.name || ''
  })

  console.log('🧭 Huidige categorie-slug (widget):', slug.value)

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
