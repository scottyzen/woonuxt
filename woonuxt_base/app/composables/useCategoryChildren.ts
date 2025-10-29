import { useRoute } from 'vue-router'
import { ref, computed, watchEffect } from 'vue'
import { useAsyncQuery } from '#imports'

// GraphQL queries
import getCategoryBySlug from '~/graphql/queries/getCategoryBySlug.gql'
import getCategoryChildren from '~/graphql/queries/getCategoryChildren.gql'

export function useCategoryChildren() {
  const route = useRoute()
  const category = ref(null)
  const children = ref([])
  const error = ref(null)

  // 🧭 Huidige categorie-slug uit de route (zoals "dames-kleding-broeken")
  const slug = computed(() => {
    const path = route.fullPath.replace(/^\/|\/$/g, '') // strip leading/trailing slashes
    return path.split('/').join('-') // 'dames-kleding/broeken' → 'dames-kleding-broeken'
  })

  console.log('🧭 Huidige categorie-slug (widget):', slug.value)

  // 🔹 1. Eerst categorie-ID ophalen op basis van slug
  const categoryId = ref<string | null>(null)

  watchEffect(async () => {
    try {
      const { data } = await useAsyncQuery(getCategoryBySlug, {
        slug: [slug.value],
      })

      const node = data?.value?.productCategories?.nodes?.[0]
      if (!node) {
        console.warn(`⚠️ Geen productCategory gevonden voor ${slug.value}`)
        return
      }

      categoryId.value = node.id
      category.value = node
      console.log('✅ Categorie gevonden:', node.name, `(ID: ${node.id})`)

      // 🔹 2. Vervolgens subcategorieën ophalen met ID
      const { data: childrenData, error: childrenError } = await useAsyncQuery(
        getCategoryChildren,
        { id: node.id }
      )

      if (childrenError.value) throw childrenError.value

      const cat = childrenData.value?.productCategory
      children.value = cat?.children?.nodes || []
      console.log('📂 Subcategorieën:', children.value)

    } catch (err) {
      console.error('❌ GraphQL fout in useCategoryChildren:', err)
      error.value = err
    }
  })

  return { category, children, error }
}
