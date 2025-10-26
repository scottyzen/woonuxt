// composables/useMainMenu.ts
import { gql, useAsyncQuery } from '@vue/apollo-composable'

const MAIN_MENU_QUERY = gql`
  query GetMainMenu {
    menu(id: "hoofdmenu", idType: SLUG) {
      menuItems {
        nodes {
          id
          label
          path
          parentId
          childItems {
            nodes {
              id
              label
              path
            }
          }
        }
      }
    }
  }
`

export const useMainMenu = () => {
  const { result, loading, error } = useAsyncQuery(MAIN_MENU_QUERY)

  const items = computed(() => result.value?.menu?.menuItems?.nodes || [])

  return { items, loading, error }
}
