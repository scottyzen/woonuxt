import { gql } from 'nuxt-graphql-request'

export default gql`
  query getProductCategories($after: String) {
    products(first: 99, after: $after) {
      nodes {
        name
        databaseId
        image {
          sourceUrl
          altText
          title
        }
        productCategories {
          nodes {
            databaseId
            slug
            name
            count
          }
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
