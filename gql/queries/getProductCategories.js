import { gql } from 'nuxt-graphql-request'

export default gql`
  query getCategories {
    productCategories(where: { orderby: COUNT, order: DESC, hideEmpty: true }) {
      nodes {
        count
        databaseId
        id
        name
        slug
      }
    }
  }
`
