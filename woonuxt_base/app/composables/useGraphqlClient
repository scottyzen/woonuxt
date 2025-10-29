export const useGraphqlClient = () => {
  const { $graphql } = useNuxtApp()

  // Wrapper zodat je eenvoudig query’s kunt uitvoeren met SSR
  const query = async (document: any, variables = {}) => {
    try {
      const result = await $graphql.default.request(document, variables)
      return result
    } catch (error) {
      console.error('[GraphQL Error]', error)
      return {}
    }
  }

  return { query }
}
