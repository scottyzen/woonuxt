import GetRelatedCategories from '~/graphql/queries/getRelatedCategories.gql'

export const useRelatedCategories = async (slug: string) => {
  const { data } = await useAsyncQuery(GetRelatedCategories, { slug })

  const current = data.value?.productCategory
  const all = data.value?.productCategories?.nodes || []

  const siblings = all.filter((cat: any) => cat.parentId === current?.parentId && cat.slug !== current.slug)
  const parent = current?.parent?.node || null
  const children = current?.children?.nodes || []

  return { parent, siblings, children }
}
