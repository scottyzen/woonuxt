import { useRoute } from 'vue-router'
import getCategoryChildren from '~/graphql/queries/getCategoryChildren.gql'

export async function useCategoryChildren() {
  const route = useRoute()
  const slug = computed(() => route.params.slug || route.params.name || '')

  if (!slug.value) {
    console.warn('⚠️ Geen category slug gevonden in route params')
  } else {
    console.log('🧭 Ophalen subcategorieën voor:', slug.value)
  }

  const { data, error } = await useAsyncGql(getCategoryChildren, {
    slug: slug.value
  })

  if (error.value) {
    console.error('GraphQL error in useCategoryChildren:', error.value)
  }

  // ✅ Gebruik productCategory i.p.v. category
  const category = computed(() => data.value?.productCategory)
  const children = computed(() => category.value?.children?.nodes || [])

  return { category, children }
}
