export default defineNuxtPlugin(() => {
  if (process.client) {
    // Clear Stripe cookies
    const cookies = document.cookie.split(';')
    
    cookies.forEach(cookie => {
      const cookieName = cookie.split('=')[0].trim()
      if (cookieName.includes('stripe')) {
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
      }
    })
    
    console.log('Cleared problematic cookies')
  }
}) 
