import { gql } from 'nuxt-graphql-request'

export default gql`
  query getProducts($after: String) {
    products(first: 99, after: $after) {
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      nodes {
        name
        databaseId
        image {
          sourceUrl
          altText
          title
        }
        averageRating
        reviewCount
        slug
        ... on SimpleProduct {
          price
        }
        ... on VariableProduct {
          price
        }
      }
    }
  }
`
