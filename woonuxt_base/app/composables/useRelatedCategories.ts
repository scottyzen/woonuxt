import GetRelatedCategories from '~/graphql/queries/getRelatedCategories.gql'

export const useRelatedCategories = async () => {
  const route = useRoute()

  // ✅ 1. Bepaal de slug dynamisch
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

  const { $graphql } = useNuxtApp()

  // ✅ 2. Haal data op via GraphQL
  const { data } = await useAsyncData(`related-categories-${slug}`, async () => {
    const res = await $graphql.default.request(GetRelatedCategories, { slug })
    return res
  }, { revalidate: 60 })

  // ✅ 3. Verwerk data
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
