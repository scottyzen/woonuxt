import { useRoute } from 'vue-router'
import getCategoryChildren from '~/graphql/queries/getCategoryChildren.gql'

export function useCategoryChildren() {
  const route = useRoute()
  const slug = computed(() => route.params.slug || route.params.name || '')

  const { data, error } = useAsyncGql(getCategoryChildren, {
    slug: slug
  })

  const category = computed(() => data.value?.productCategory)
  const children = computed(() => category.value?.children?.nodes || [])

  return { category, children, error }
}
