import { useRoute } from 'vue-router'
import getCategoryChildren from '~/graphql/queries/getCategoryChildren.gql'

export async function useCategoryChildren() {
  const route = useRoute()
  const slug = computed(() => route.params.slug || route.params.name || '')

  console.log('🔍 Route params:', route.params)
  console.log('🧭 Op te halen categorie-slug:', slug.value)

  if (!slug.value) {
    console.warn('⚠️ Geen slug gevonden, stoppen')
    return { category: ref(null), children: ref([]) }
  }

  const { data, error } = await useAsyncGql(getCategoryChildren, {
    slug: slug.value
  })

  watchEffect(() => {
    if (error.value) {
      console.error('❌ GraphQL error:', error.value)
    }
    if (data.value) {
      console.log('✅ GraphQL data ontvangen:', data.value)
    }
  })

  const category = computed(() => data.value?.productCategory)
  const children = computed(() => category.value?.children?.nodes || [])

  return { category, children }
}
