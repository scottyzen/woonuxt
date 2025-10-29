import { useRoute } from 'vue-router'
import getCategoryChildren from '~/graphql/queries/getCategoryChildren.gql'

export async function useCategoryChildren() {
  const route = useRoute()

  // Zorg dat slug altijd bestaat
  const slug = computed(() => route.params.slug || route.params.name || '')

  if (!slug.value) {
    console.warn('⚠️ No category slug found in route params')
  } else {
    console.log('🧭 Fetching category for slug:', slug.value)
  }

  const { data, error } = await useAsyncGql(getCategoryChildren, {
    slug: slug.value
  })

  if (error.value) {
    console.error('GraphQL error in useCategoryChildren:', error.value)
  }

  const category = computed(() => data.value?.category)
  const children = computed(() => category.value?.children?.nodes || [])

  return { category, children }
}
