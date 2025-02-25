export default defineNuxtPlugin(() => {
  // Force public access to products
  const publicProductsQuery = async () => {
    try {
      const { data } = await $fetch('https://modaprimeusa.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Guest-Access': 'true'
        },
        body: JSON.stringify({
          query: `
            query PublicProducts {
              products(first: 24) {
                nodes {
                  id
                  databaseId
                  name
                }
              }
            }
          `
        })
      });
      
      console.log('Public products test:', data?.products?.nodes?.length || 0);
      return data;
    } catch (error) {
      console.error('Public products test failed:', error);
      return null;
    }
  };
  
  return {
    provide: {
      publicProductsQuery
    }
  };
}); 
