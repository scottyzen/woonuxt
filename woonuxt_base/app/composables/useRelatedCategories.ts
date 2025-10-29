import GetRelatedCategories from '~/graphql/queries/getRelatedCategories.gql'

export const useRelatedCategories = async (slug: string) => {
  const { $graphql } = useNuxtApp() // ✅ Woonuxt GraphQL client

  // SSR + caching via useAsyncData
  const { data } = await useAsyncData(`related-categories-${slug}`, async () => {
    const res = await $graphql.default.request(GetRelatedCategories, { slug })
    return res
  }, {
    server: true,
    lazy: false,
    transform: (data) => data,
    // revalidate elke 60 sec (ISR effect)
    revalidate: 60
  })

  const current = data.value?.productCategory
  const all = data.value?.productCategories?.nodes || []

  const siblings = all.filter((cat: any) => cat.parentId === current?.parentId && cat.slug !== current.slug)
  const parent = current?.parent?.node || null
  const children = current?.children?.nodes || []

  return { parent, siblings, children }
}
