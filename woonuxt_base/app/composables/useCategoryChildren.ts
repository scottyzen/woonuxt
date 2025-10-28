import { useRoute } from 'vue-router'
import getCategoryChildren from '~/graphql/queries/getCategoryChildren.gql'

/**
 * Fetches subcategories (and their children) of the current WooCommerce category.
 * Automatically detects the category slug from the route.
 * Works with SSR and Woonuxt GraphQL client.
 */
export async function useCategoryChildren() {
  const route = useRoute()

  // Detect slug from route params
  const slug = computed(() => route.params.slug || route.params.name || '')

  // Perform GraphQL request
  const { data, error } = await useAsyncGql(getCategoryChildren, {
    slug: slug.value
  })

  if (error.value) {
    console.error('Error fetching category children:', error.value)
  }

  // Extract and expose data
  const category = computed(() => data.value?.category)
  const children = computed(() => category.value?.children?.nodes || [])

  return { category, children }
}
