import { useRoute } from 'vue-router'
import { ref, computed, watchEffect } from 'vue'
import getCategoryIdBySlug from '~/graphql/queries/getCategoryIdBySlug.gql'
import getCategoryContextById from '~/graphql/queries/getCategoryContextById.gql'

type CatNode = {
  id: string
  name: string
  slug: string
  parent?: { node?: CatNode | null } | null
  children?: { nodes?: CatNode[] } | null
}

export function useCategoryChildren() {
  const route = useRoute()

  const category = ref<CatNode | null>(null)         // geselecteerde categorie
  const children = ref<CatNode[]>([])                // subcategorieën van geselecteerde categorie
  const siblings = ref<CatNode[]>([])                // broertjes/zusjes binnen dezelfde parent
  const error = ref<unknown>(null)
  const loading = ref<boolean>(false)

  // Huidige URL → kandidaten voor slugs:
  // - volledige samengestelde slug: "dames-kleding-broeken"
  // - laatste segment: "broeken"
  const fullSlug = computed(() => {
    const path = (route.fullPath || '').replace(/^\/|\/$/g, '')
    return path ? path.split('/').join('-') : ''
  })
  const lastSegmentSlug = computed(() => String(route.params.categorySlug || '').trim())

  const slugCandidates = computed<string[]>(() => {
    const set = new Set<string>()
    if (fullSlug.value) set.add(fullSlug.value)
    if (lastSegmentSlug.value) set.add(lastSegmentSlug.value)
    return Array.from(set)
  })

  // 1) Vind de echte WP categorie (via slug-candidates) → pak diens ID
  // 2) Met ID haal je context (parent+children) op
  watchEffect(async () => {
    // reset per route-wijziging
    category.value = null
    children.value = []
    siblings.value = []
    error.value = null

    const slugs = slugCandidates.value
    if (!slugs.length) return

    loading.value = true
    try {
      // Stap 1: ID lookup door slug-kandidaten
      const { data: idData } = await useGql<{ productCategories: { nodes: CatNode[] } }>({
        query: getCategoryIdBySlug,
        variables: { slugs }
      })

      const nodes = idData?.productCategories?.nodes || []

      // Kies slim de best passende node:
      // 1) exact match op fullSlug
      // 2) exact match op lastSegment
      // 3) anders eerste resultaat
      const picked =
        nodes.find(n => n.slug === fullSlug.value) ||
        nodes.find(n => n.slug === lastSegmentSlug.value) ||
        nodes[0]

      if (!picked) {
        console.warn('⚠️ Geen productCategory gevonden voor slugs:', slugs)
        loading.value = false
        return
      }

      // Stap 2: context ophalen met ID
      const { data: ctxData } = await useGql<{ productCategory: CatNode }>({
        query: getCategoryContextById,
        variables: { id: picked.id }
      })

      const ctx = ctxData?.productCategory
      if (!ctx) {
        console.warn('⚠️ Geen context gevonden voor ID:', picked.id)
        loading.value = false
        return
      }

      category.value = ctx
      children.value = ctx.children?.nodes || []

      // Siblings = children van parent (excl. jezelf)
      const parentChildren = ctx.parent?.node?.children?.nodes || []
      siblings.value = parentChildren.filter(s => s.slug !== ctx.slug)

      // Als er geen parent is (root), dan zijn er geen siblings;
      // dan kun je er ook voor kiezen de root-children als "siblings" te tonen — laat ik bewust leeg.
    } catch (e) {
      console.error('❌ Fout in useCategoryChildren:', e)
      error.value = e
    } finally {
      loading.value = false
    }
  })

  return {
    loading,
    error,
    category,
    children,
    siblings
  }
}
