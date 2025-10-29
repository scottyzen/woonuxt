export const useGraphqlClient = () => {
  const { $graphql } = useNuxtApp()

  if (!$graphql) {
    throw new Error('❌ $graphql client is niet beschikbaar in useNuxtApp()')
  }

  const query = async (document: any, variables = {}) => {
    try {
      // ✅ Geen ".default" meer gebruiken
      const result = await $graphql.request(document, variables)
      return result
    } catch (err) {
      console.error('GraphQL query failed:', err)
      return null
    }
  }

  return { query }
}
