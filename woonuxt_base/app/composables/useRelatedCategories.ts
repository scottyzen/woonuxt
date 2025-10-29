import GetRelatedCategories from '~/graphql/queries/getRelatedCategories.gql'
import { useGraphqlClient } from '~/composables/useGraphqlClient'

export const useRelatedCategories = async () => {
  const route = useRoute()
  const { query } = useGraphqlClient()

  const slug =
    (route.params.categorySlug as string) ||
    (route.params.category as string) ||
    (route.params.slug as string) ||
    route.path.split('/').filter(Boolean).pop()

  console.log('✅ Detected slug:', slug)

  if (!slug) return { parent: null, siblings: [], children: [] }

  // 1️⃣ Eerst alle categorieën ophalen
  const { data: allData } = await useAsyncData('all-categories', async () => {
    return await query(GetRelatedCategories) // zelfde query, haalt ook alle nodes op
  })

  const all = allData.value?.productCategories?.nodes || []
  console.log('📦 Alle categorieën geladen:', all.length)

  // 2️⃣ Zoek de juiste categorie op basis van slug
  const matched = all.find((cat: any) => cat.slug === slug)
  if (!matched) {
    console.warn('⚠️ Geen categorie gevonden met slug:', slug)
    return { parent: null, siblings: [], children: [] }
  }

  console.log('🌐 WPGraphQL URI gevonden:', matched.uri)

  // 3️⃣ Nu queryen met URI
  const { data } = await useAsyncData(`related-categories-${slug}`, async () => {
    return await query(GetRelatedCategories, { id: matched.uri, idType: 'URI' })
  }, { revalidate: 60 })

  // 4️⃣ Verwerk de data
  const current = data.value?.productCategory
  const parentId = current?.parentId || current?.parent?.node?.id
  const siblings = all.filter(
    (cat: any) => cat.parentId === parentId && cat.slug !== current?.slug
  )

  const parent = current?.parent?.node || null
  const children = current?.children?.nodes || []

  return { parent, siblings, children }
}
