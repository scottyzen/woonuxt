import GetRelatedCategories from '~/graphql/queries/getRelatedCategories.gql'
import { useGraphqlClient } from '~/composables/useGraphqlClient'

export const useRelatedCategories = async () => {
  const route = useRoute()
  const pathParts = route.path.split('/').filter(Boolean)
  const slug =
    (route.params.categorySlug as string) ||
    pathParts[pathParts.length - 1]

  console.log('✅ Detected slug:', slug)
  console.log('✅ Route path parts:', pathParts)

  if (!slug) {
    console.warn('⚠️ Geen slug gedetecteerd voor categoriepagina')
    return { parent: null, siblings: [], children: [] }
  }

  const { query } = useGraphqlClient()

  // 👉 Bouw het volledige WP-pad: /product-category/[alle delen]/
  // voorbeeld: /broeken → /product-category/dames/dames-kleding/broeken/
  // je kunt hieronder je vaste hiërarchie aanpassen als dat altijd via "dames" loopt
  const uri = `/product-category/dames/dames-kleding/${slug}/`
  console.log('🌐 WPGraphQL query met URI:', uri)

  const { data } = await useAsyncData(`related-categories-${slug}`, async () => {
    const res = await query(GetRelatedCategories, { id: uri })
    return res
  }, { revalidate: 60 })

  const current = data.value?.productCategory
  const all = data.value?.productCategories?.nodes || []

  const parentId = current?.parentId || current?.parent?.node?.id
  console.log('Current parentId:', parentId)
  console.log('All categories count:', all.length)

  const siblings = all.filter(
    (cat: any) =>
      String(cat.parentId).trim() === String(parentId).trim() &&
      cat.slug !== current?.slug
  )

  const parent = current?.parent?.node || null
  const children = current?.children?.nodes || []

  return { parent, siblings, children }
}
