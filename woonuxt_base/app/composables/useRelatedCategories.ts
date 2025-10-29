import GetRelatedCategories from '~/graphql/queries/getRelatedCategories.gql'
import { useGraphqlClient } from '~/composables/useGraphqlClient'

export const useRelatedCategories = async () => {
  const route = useRoute()
  const { query } = useGraphqlClient()

  // 1️⃣ Slug bepalen — werkt voor /broeken/, /jurken/, etc.
  const slug =
    (route.params.categorySlug as string) ||
    (route.params.category as string) ||
    (route.params.slug as string) ||
    route.path.split('/').filter(Boolean).pop()

  console.log('✅ Detected slug:', slug)

  if (!slug) {
    console.warn('⚠️ Geen slug gedetecteerd.')
    return { parent: null, siblings: [], children: [] }
  }

  // 2️⃣ GraphQL query uitvoeren met idType: SLUG
  const { data } = await useAsyncData(`related-categories-${slug}`, async () => {
    return await query(GetRelatedCategories, { id: slug, idType: 'SLUG' })
  }, { revalidate: 60 })

  // 3️⃣ Data verwerken
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
