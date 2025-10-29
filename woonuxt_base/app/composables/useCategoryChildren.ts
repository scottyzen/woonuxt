import { useRoute } from 'vue-router'
import getCategoryChildren from '~/graphql/queries/getCategoryChildren.gql'

export function useCategoryChildren() {
  const route = useRoute()
  const category = ref(null)
  const children = ref([]) // subcategorieën
  const siblings = ref([]) // broertjes binnen dezelfde parent
  const error = ref(null)

  const slug = computed(() => String(route.params.categorySlug || ''))

  watchEffect(async () => {
    if (!slug.value) return

    console.log('🧭 Huidige categorie-slug (widget):', slug.value)

    try {
      const { data } = await useGql({
        query: getCategoryChildren,
        variables: { slug: slug.value },
      })

      const cat = data?.productCategories?.nodes?.[0]
      if (!cat) {
        console.warn('⚠️ Geen productCategory gevonden voor', slug.value)
        return
      }

      category.value = cat
      children.value = cat.children?.nodes || []

      // broertjes ophalen van de parent
      if (cat.parent?.node?.children?.nodes?.length) {
        siblings.value = cat.parent.node.children.nodes
      } else {
        // als er geen parent is, toon children van de root zelf
        siblings.value = [cat]
      }

      console.log('✅ Categorie:', cat.name)
      console.log('📂 Subcategorieën:', children.value)
      console.log('📂 Broertjes:', siblings.value)
    } catch (err) {
      console.error('❌ GraphQL fout in useCategoryChildren:', err)
      error.value = err
    }
  })

  return { category, children, siblings, error }
}
