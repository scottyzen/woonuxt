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

  const { query } = useGraphqlClient()

  // 2️⃣ Eerst ophalen via slug → om URI te vinden
  const { data: firstData } = await useAsyncData(`related-categories-initial-${slug}`, async () => {
    const res = await query(GetRelatedCategories, { slug })
    return res
  }, { revalidate: 60 })

  const uri = firstData.value?.productCategory?.uri
  console.log('🧩 WPGraphQL URI gevonden:', uri)

  // 3️⃣ Als er een URI is, gebruik die om opnieuw de juiste data te laden
  const { data } = await useAsyncData(`related-categories-${slug}`, async () => {
    const res = await query(GetRelatedCategories, { slug: uri || slug })
    return res
  }, { revalidate: 60 })

  // 4️⃣ Verwerk de data
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
