import GetRelatedCategories from '~/graphql/queries/getRelatedCategories.gql'
import { useGraphqlClient } from '~/composables/useGraphqlClient'

export const useRelatedCategories = async () => {
  const route = useRoute()
  const nuxtApp = useNuxtApp()
const graphql = nuxtApp.$graphql || null

if (!graphql) {
  console.warn('⚠️ GraphQL client niet beschikbaar, waarschijnlijk fallback render.')
  return { parent: null, siblings: [], children: [] }
}

const query = graphql.query


  // 1️⃣ Slug bepalen
  const slug =
    (route.params.categorySlug as string) ||
    (route.params.category as string) ||
    (route.params.slug as string) ||
    route.path.split('/').filter(Boolean).pop()

  console.log('✅ Detected slug:', slug)

  // 2️⃣ Haal eerst ALLE categorieën op, om juiste URI te vinden
  const allCategories = await query(GetRelatedCategories, { id: "/", idType: "URI" })
  const all = allCategories?.productCategories?.nodes || []
  console.log('📦 Alle categorieën geladen:', all.length)

  // 3️⃣ Vind de juiste categorie obv slug
  const current = all.find((cat: any) => cat.slug === slug)
  if (!current) {
    console.warn('⚠️ Geen categorie gevonden met slug:', slug)
    return { parent: null, siblings: [], children: [] }
  }

  console.log('🌐 WPGraphQL URI gevonden:', current.uri)

  // 4️⃣ Query uitvoeren op basis van URI
  const { data } = await useAsyncData(`related-categories-${slug}`, async () => {
    return await query(GetRelatedCategories, { id: current.uri, idType: 'URI' })
  }, { revalidate: 60 })

  const cat = data.value?.productCategory
  const siblings = all.filter(
    (c: any) => c.parentId === cat?.parentId && c.slug !== cat?.slug
  )

  const parent = cat?.parent?.node || null
  const children = cat?.children?.nodes || []

  return { parent, siblings, children }
}
