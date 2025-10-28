import { useRoute } from 'vue-router'
import getCategoryChildren from '~/graphql/queries/getCategoryChildren.gql'

export function useCategoryChildren() {
  const route = useRoute()

  const slug = computed(() => {
    // probeer meerdere namen, afhankelijk van je routebestand
    return route.params.slug || route.params.name || ''
  })

  const { data, error, execute } = useAsyncGql({
    query: getCategoryChildren,
    variables: { slug: slug.value },
    immediate: false, // nog niet direct uitvoeren
  })

  // Run de query zodra slug beschikbaar is
  watchEffect(() => {
    if (slug.value) execute({ slug: slug.value })
  })

  if (error.value) {
    console.error('Error fetching category children:', error.value)
  }

  const category = computed(() => data.value?.category)
  const children = computed(() => category.value?.children?.nodes || [])

  return { category, children }
}
