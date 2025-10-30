import { useAsyncGql } from '#imports'

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

// include moet [ID] zijn → strings!
const TOP_IDS = ['34', '35', '36', '37', '38'] as const

export async function useCategoryMenu() {
  const { data } = await useAsyncGql<{ productCategories: { nodes: CategoryNode[] } }>({
    operation: 'GetCategoryTree',
    variables: { include: TOP_IDS },
  })

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
          TOP_IDS.indexOf(String(a.databaseId) as typeof TOP_IDS[number]) -
          TOP_IDS.indexOf(String(b.databaseId) as typeof TOP_IDS[number])
      )
      .map(toMenuItem)
  )

  return { topMenu }
}
