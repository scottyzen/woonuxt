import GetRelatedCategories from '~/graphql/queries/getRelatedCategories.gql'
import { useGraphqlClient } from '~/composables/useGraphqlClient'

export const useRelatedCategories = async () => {
  const route = useRoute()

  // 1️⃣ Detecteer slug
  const slug =
    (route.params.categorySlug as string) ||
    (route.params.category as string) ||
    (route.params.slug as string) ||
    route.path.split('/').filter(Boolean).pop()

  console.log('✅ Detected slug:', slug)

  if (!slug) {
    console.warn('⚠️ Geen slug gedetecteerd voor categoriepagina')
    return { parent: null, siblings: [], children: [] }
  }

  // 2️⃣ Gebruik de Woonuxt GraphQL client
  const { query } = useGraphqlClient()

  const { data } = await useAsyncData(`related-categories-${slug}`, async () => {
  const id = `/product-category/${slug}/` // ✅ WPGraphQL expects full path
  const res = await query(GetRelatedCategories, { id })
  return res
}, { revalidate: 60 })

  // 3️⃣ Verwerk de data
  const current = data.value?.productCategory
  const all = data.value?.productCategories?.nodes || []

  const parentId = current?.parentId || current?.parent?.node?.id
  console.log('Current parentId:', parentId)
  console.log('All categories count:', all.length)

  const siblings = all.filter(
    (cat: any) => String(cat.parentId).trim() === String(parentId).trim() && cat.slug !== current?.slug
  )

  const parent = current?.parent?.node || null
  const children = current?.children?.nodes || []

  return { parent, siblings, children }
}
