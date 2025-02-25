export default defineNuxtPlugin(() => {
  if (process.client) {
    console.log('Current route:', window.location.pathname);
    console.log('WordPress product base:', 'product'); // Update this to match your setting
    
    // Check if we're on a product-related page
    if (window.location.pathname.includes('/product') || 
        window.location.pathname.includes('/products')) {
      console.log('On product page - checking configuration');
    }
  }
}) 
