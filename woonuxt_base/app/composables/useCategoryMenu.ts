import GetCategoryTree from '~/graphql/queries/getCategoryTree.gql'

export type CategoryNode = {
  databaseId: number
  parentDatabaseId?: number
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

// ✅ geef include als string-IDs door
const TOP_IDS = ['34', '35', '36', '37', '38'] as const

export async function useCategoryMenu() {
  const { data } = await useAsyncQuery<{ productCategories: { nodes: CategoryNode[] } }>(
    GetCategoryTree,
    { include: TOP_IDS }, // ← strings, matcht [ID]
    {
      fetchPolicy: 'cache-first',
      context: { fetchOptions: { next: { revalidate: 1800 } } }
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
      // sorteer op basis van databaseId → string index in TOP_IDS
      .sort((a, b) =>
        TOP_IDS.indexOf(String(a.databaseId) as typeof TOP_IDS[number]) -
        TOP_IDS.indexOf(String(b.databaseId) as typeof TOP_IDS[number])
      )
      .map(toMenuItem)
  )

  return { topMenu }
}
