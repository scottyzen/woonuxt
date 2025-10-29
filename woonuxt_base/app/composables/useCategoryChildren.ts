import { useRoute } from 'vue-router'
import getCategoryChildren from '~/graphql/queries/getCategoryChildren.gql'

export function useCategoryChildren() {
  const route = useRoute()
  const slug = computed(() => route.params.slug || route.params.name || '')

  console.log('🧭 Categorie-slug voor widget:', slug.value)

  const { data, error } = useAsyncGql(getCategoryChildren, { slug })

  const category = computed(() => data.value?.productCategory)
  const children = computed(() => category.value?.children?.nodes || [])

  return { category, children, error }
}
