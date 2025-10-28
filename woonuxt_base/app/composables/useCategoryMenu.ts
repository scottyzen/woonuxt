import GetCategoryTree from '~/graphql/queries/getCategoryTree.gql'

export type CategoryNode = {
  databaseId: number
  name: string
  uri: string
  children?: { nodes: CategoryNode[] }
}

export type MenuColumn = {
  title: string
  uri: string
  items: { label: string; uri: string }[]
}

export type MenuItem = {
  id: number
  label: string
  uri: string
  columns: MenuColumn[]
}

const TOP_IDS = [34, 35, 36, 37, 38] // Dames, Heren, Jongens, Meisjes, Baby’s

export async function useCategoryMenu() {
  const { data } = await useAsyncQuery<{ productCategories: { nodes: CategoryNode[] } }>(
    GetCategoryTree,
    { include: TOP_IDS },
    {
      fetchPolicy: 'cache-first',
      context: { fetchOptions: { next: { revalidate: 1800 } } } // 30 min cache
    }
  )

  const raw = computed(() => data.value?.productCategories?.nodes ?? [])

  const toMenuItem = (node: CategoryNode): MenuItem => {
    const columns: MenuColumn[] = (node.children?.nodes ?? []).map((lvl1) => ({
      title: lvl1.name,
      uri: lvl1.uri,
      items: (lvl1.children?.nodes ?? []).map((lvl2) => ({
        label: lvl2.name,
        uri: lvl2.uri
      }))
    }))

    return {
      id: node.databaseId,
      label: node.name,
      uri: node.uri,
      columns
    }
  }

  const topMenu = computed<MenuItem[]>(() =>
    raw.value
      .sort(
        (a, b) =>
          TOP_IDS.indexOf(a.databaseId) - TOP_IDS.indexOf(b.databaseId)
      )
      .map(toMenuItem)
  )

  return { topMenu }
}
