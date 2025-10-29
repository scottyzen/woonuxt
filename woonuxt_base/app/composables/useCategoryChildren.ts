import { useRoute } from 'vue-router'
import { ref, computed, watchEffect } from 'vue'
import getCategoryByUri from '~/graphql/queries/getCategoryByUri.gql'

type CatNode = {
  id: string
  name: string
  slug: string
  uri: string
  parent?: { node?: CatNode | null } | null
  children?: { nodes?: CatNode[] } | null
}

export function useCategoryChildren() {
  const route = useRoute()
  const category = ref<CatNode | null>(null)
  const children = ref<CatNode[]>([])
  const siblings = ref<CatNode[]>([])
  const loading = ref(false)
  const error = ref<unknown>(null)

  const categoryUri = computed(() => {
    // Bouw volledige URI op basis van route
    // Bijvoorbeeld /broeken → /product-category/broeken
    // of /dames-kleding/broeken → /product-category/dames-kleding/broeken
    let path = route.fullPath.replace(/^\/|\/$/g, '').split('?')[0]
    if (!path.startsWith('product-category')) {
      path = `product-category/${path}`
    }
    return `/${path}/`
  })

  watchEffect(async () => {
    category.value = null
    children.value = []
    siblings.value = []
    error.value = null

    const uri = categoryUri.value
    if (!uri) return

    console.log('🧭 Categorie-URI (widget):', uri)

    loading.value = true
    try {
      
const { data, error } = await useAsyncQuery(getCategoryByUri, { uri })


      const cat = data?.productCategory
      if (!cat) {
        console.warn('⚠️ Geen productCategory gevonden voor URI:', uri)
        return
      }

      category.value = cat
      children.value = cat.children?.nodes || []
      siblings.value =
        cat.parent?.node?.children?.nodes?.filter(s => s.id !== cat.id) || []
    } catch (e) {
      console.error('❌ GraphQL fout in useCategoryChildren:', e)
      error.value = e
    } finally {
      loading.value = false
    }
  })

  return { loading, error, category, children, siblings }
}
