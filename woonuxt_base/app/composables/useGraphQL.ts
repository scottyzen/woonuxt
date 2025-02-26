// woonuxt_base/app/composables/useGraphQL.ts

/**
 * Composable for GraphQL queries with proper CORS and session handling
 */
export const useGraphQL = () => {
  /**
   * Execute a GraphQL query with correct CORS and session handling
   * @param query - GraphQL query string
   * @param variables - Query variables
   * @returns Response data
   */
  const executeGraphQL = async (query: string, variables: Record<string, any> = {}) => {
    try {
      // Get stored WooCommerce session if available
      const wooSession = localStorage.getItem('woo-session');
      
      // Headers with proper CORS configuration
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Origin': window.location.origin,
        'X-WP-Guest-Access': 'true'
      };
      
      // Only add WooCommerce session if it exists
      if (wooSession) {
        headers['woocommerce-session'] = `Session ${wooSession}`;
      }
      
      // Make the request
      const response = await fetch('https://modaprimeusa.com/graphql', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({
          query,
          variables
        })
      });
      
      // Check for session header in response
      const newSession = response.headers.get('woocommerce-session');
      if (newSession) {
        localStorage.setItem('woo-session', newSession);
      }
      
      // Parse the JSON response
      const result = await response.json();
      
      // Handle GraphQL errors
      if (result.errors) {
        console.error('GraphQL errors:', result.errors);
        throw new Error(result.errors[0]?.message || 'GraphQL Error');
      }
      
      return result.data;
    } catch (error) {
      console.error('GraphQL request failed:', error);
      throw error;
    }
  };

  /**
   * Get products with pagination
   * @param first - Number of products to fetch
   * @param after - Cursor for pagination
   * @returns Products data
   */
  const getProducts = async (first = 12, after: string | null = null) => {
    const query = `
      query GetProducts($first: Int!, $after: String) {
        products(first: $first, after: $after) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              id
              databaseId
              name
              slug
              type
              onSale
              shortDescription
              image {
                id
                sourceUrl
                altText
              }
              ... on SimpleProduct {
                price
                regularPrice
                stockStatus
              }
              ... on VariableProduct {
                price
                regularPrice
                stockStatus
              }
            }
          }
        }
      }
    `;
    
    try {
      // Use our custom executeGraphQL function
      const data = await executeGraphQL(query, { first, after });
      return data.products;
    } catch (error) {
      // Handle error and return empty result with consistent structure
      console.error('Failed to fetch products:', error);
      return {
        edges: [],
        pageInfo: {
          hasNextPage: false,
          endCursor: null
        }
      };
    }
  };

  /**
   * Get a single product by slug
   * @param slug - Product slug
   * @returns Product data
   */
  const getProduct = async (slug: string) => {
    const query = `
      query GetProduct($slug: ID!) {
        product(id: $slug, idType: SLUG) {
          id
          databaseId
          name
          slug
          type
          onSale
          shortDescription
          description
          image {
            id
            sourceUrl
            altText
          }
          galleryImages {
            nodes {
              id
              sourceUrl
              altText
            }
          }
          ... on SimpleProduct {
            price
            regularPrice
            stockStatus
          }
          ... on VariableProduct {
            price
            regularPrice
            stockStatus
            variations {
              nodes {
                id
                name
                price
                regularPrice
                stockStatus
                attributes {
                  nodes {
                    name
                    value
                  }
                }
              }
            }
          }
        }
      }
    `;
    
    try {
      const data = await executeGraphQL(query, { slug });
      return data.product;
    } catch (error) {
      console.error(`Failed to fetch product with slug ${slug}:`, error);
      return null;
    }
  };

  return {
    executeGraphQL,
    getProducts,
    getProduct
  };
};

export default useGraphQL;
