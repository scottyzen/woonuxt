<!-- woonuxt_base/app/pages/products.vue -->
<template>
  <div class="container my-8 relative">
    <h1 class="text-2xl font-bold mb-8">Products</h1>
    
    <!-- Loading state -->
    <div v-if="loading" class="text-center py-12">
      <p>Loading products...</p>
    </div>
    
    <!-- Error state -->
    <div v-else-if="error" class="text-center py-12">
      <p>Error loading products. Please try again later.</p>
      <button @click="loadProducts" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Try Again
      </button>
    </div>
    
    <!-- No products state -->
    <div v-else-if="!products.length" class="text-center py-12">
      <p>No products found.</p>
    </div>
    
    <!-- Products grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <ProductCard 
        v-for="product in products" 
        :key="product.id" 
        :product="product"
      />
    </div>
    
    <!-- Load more button -->
    <div v-if="hasNextPage" class="flex justify-center mt-8">
      <button 
        @click="loadMore" 
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        :disabled="loadingMore"
      >
        {{ loadingMore ? 'Loading...' : 'Load More' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import useGraphQL from '../composables/useGraphQL'

// Get GraphQL utilities
const { getProducts } = useGraphQL()

// State
const products = ref([])
const loading = ref(true)
const loadingMore = ref(false)
const error = ref(null)
const hasNextPage = ref(false)
const endCursor = ref('')

// Load products using our composable
const loadProducts = async () => {
  try {
    loading.value = true
    error.value = null
    
    // Use the composable which handles CORS and sessions
    const productsData = await getProducts(12)
    
    if (productsData?.edges) {
      products.value = productsData.edges.map(edge => edge.node)
      hasNextPage.value = productsData.pageInfo.hasNextPage
      endCursor.value = productsData.pageInfo.endCursor
    } else {
      throw new Error('Invalid product data structure')
    }
  } catch (err) {
    console.error('Error loading products:', err)
    error.value = err.message || 'Failed to load products'
    
    // Try REST API as fallback
    await loadFromRestApi()
  } finally {
    loading.value = false
  }
}

// Load more products
const loadMore = async () => {
  if (!hasNextPage.value || loadingMore.value) return
  
  try {
    loadingMore.value = true
    
    const productsData = await getProducts(12, endCursor.value)
    
    if (productsData?.edges) {
      const newProducts = productsData.edges.map(edge => edge.node)
      products.value = [...products.value, ...newProducts]
      hasNextPage.value = productsData.pageInfo.hasNextPage
      endCursor.value = productsData.pageInfo.endCursor
    }
  } catch (err) {
    console.error('Error loading more products:', err)
    // No need to set error state here, just log it
  } finally {
    loadingMore.value = false
  }
}

// Fallback to REST API if GraphQL fails
const loadFromRestApi = async () => {
  try {
    const response = await fetch('https://modaprimeusa.com/wp-json/wc/v3/products?per_page=12', {
      headers: {
        'X-WP-Guest-Access': 'true'
      }
    })
    
    if (!response.ok) {
      throw new Error(`REST API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    // Map WP REST API format to match GraphQL format
    products.value = data.map(item => ({
      id: `product-${item.id}`,
      databaseId: item.id,
      name: item.name,
      slug: item.slug,
      type: item.type,
      onSale: item.on_sale,
      shortDescription: item.short_description,
      image: item.images.length > 0 ? {
        id: item.images[0].id,
        sourceUrl: item.images[0].src,
        altText: item.images[0].alt
      } : null,
      price: item.price,
      regularPrice: item.regular_price,
      stockStatus: item.stock_status.toUpperCase()
    }))
    
    // Clear error since fallback was successful
    error.value = null
  } catch (fallbackErr) {
    console.error('Fallback fetch also failed:', fallbackErr)
    // Keep original error if fallback also fails
  }
}

// Load products on component mount
onMounted(() => {
  loadProducts()
})
</script>
