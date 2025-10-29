import GetRelatedCategories from '~/graphql/queries/getRelatedCategories.gql'

export const useRelatedCategories = async (slug: string) => {
  const { $graphql } = useNuxtApp()

  const { data } = await useAsyncData(`related-categories-${slug}`, async () => {
    const res = await $graphql.default.request(GetRelatedCategories, { slug })
    return res
  }, { revalidate: 60 })

 const current = data.value?.productCategory
const all = data.value?.productCategories?.nodes || []

// ✅ Gebruik fallback op parentId (want dat veld is betrouwbaar)
const parentId = current?.parentId || current?.parent?.node?.id

// ✅ Debug: log de waarden even in console (mag je later verwijderen)
console.log('Current parentId:', parentId)
console.log('All categories count:', all.length)

const siblings = all.filter(
  (cat: any) => cat.parentId === parentId && cat.slug !== current.slug
)

const parent = current?.parent?.node || null
const children = current?.children?.nodes || []

return { parent, siblings, children }
}
