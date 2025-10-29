import GetRelatedCategories from '~/graphql/queries/getRelatedCategories.gql'
import { useGraphqlClient } from '~/composables/useGraphqlClient'

export const useRelatedCategories = async () => {
  const route = useRoute()
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

  const { query } = useGraphqlClient()

  // 🧩 Stap 1: haal alle categorieën op zodat we de juiste URI kunnen vinden
  const allCategoriesRes = await query(gql`
    {
      productCategories(first: 100) {
        nodes {
          slug
          uri
        }
      }
    }
  `)

  const allCategories = allCategoriesRes?.productCategories?.nodes || []
  const match = allCategories.find((cat: any) => cat.slug === slug)
  const uri = match?.uri

  console.log('🔍 Gevonden URI voor', slug, ':', uri)

  if (!uri) {
    console.warn('⚠️ Geen URI gevonden voor slug:', slug)
    return { parent: null, siblings: [], children: [] }
  }

  // 🧩 Stap 2: gebruik de gevonden URI voor de echte query
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
