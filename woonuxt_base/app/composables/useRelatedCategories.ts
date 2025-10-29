import GetRelatedCategories from '~/graphql/queries/getRelatedCategories.gql'
import { useGraphqlClient } from '~/composables/useGraphqlClient'

export const useRelatedCategories = async () => {
  const route = useRoute()
  const { query } = useGraphqlClient()

  // 1️⃣ Slug bepalen
  const slug =
    (route.params.categorySlug as string) ||
    (route.params.category as string) ||
    (route.params.slug as string) ||
    route.path.split('/').filter(Boolean).pop()

  console.log('✅ Detected slug:', slug)

  // 2️⃣ Bouw de volledige WPGraphQL URI
  //   Let op: jouw structuur is altijd /product-category/dames/dames-kleding/[slug]/
  //   De basis "dames/dames-kleding" kun je eventueel dynamisch maken later
  const uri = `/product-category/dames/dames-kleding/${slug}/`

  console.log('🌐 Querying WPGraphQL with URI:', uri)

  // 3️⃣ Query uitvoeren
const { data } = await useAsyncData(`related-categories-${slug}`, async () => {
  return await query(GetRelatedCategories, { id: slug, idType: 'SLUG' })
}, { revalidate: 60 })


  const current = data.value?.productCategory
  const all = data.value?.productCategories?.nodes || []

  console.log('🧩 Current:', current?.name, '| all categories:', all.length)

  const parentId = current?.parentId || current?.parent?.node?.id
  const siblings = all.filter(
    (cat: any) => cat.parentId === parentId && cat.slug !== current?.slug
  )

  const parent = current?.parent?.node || null
  const children = current?.children?.nodes || []

  return { parent, siblings, children }
}
