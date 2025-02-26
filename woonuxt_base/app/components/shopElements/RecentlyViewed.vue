<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

// Add type declaration for window.__NUXT__
declare global {
  interface Window {
    __NUXT__?: {
      state?: {
        product?: {
          value?: any;
        };
      };
    };
  }
}

const route = useRoute();
const recentlyViewed = ref([]);
const maxItems = 4;

// Load recently viewed products from localStorage on mount
onMounted(() => {
  const storedProducts = localStorage.getItem('recentlyViewedProducts');
  if (storedProducts) {
    try {
      recentlyViewed.value = JSON.parse(storedProducts);
    } catch (e) {
      console.error('Error parsing recently viewed products', e);
      recentlyViewed.value = [];
    }
  }
});

// Watch for product page visits to update recently viewed
watch(
  () => route.path,
  (newPath) => {
    if (newPath.startsWith('/product/') && typeof window !== 'undefined') {
      const productSlug = newPath.split('/').pop();
      const currentProduct = window.__NUXT__?.state?.product?.value;
      
      if (currentProduct && productSlug) {
        // Create a simplified product object with essential info
        const productToAdd = {
          id: currentProduct.databaseId,
          name: currentProduct.name,
          slug: productSlug,
          price: currentProduct.price,
          image: currentProduct.image?.sourceUrl || null,
          dateViewed: new Date().toISOString()
        };
        
        // Remove the product if it already exists in the list
        const filteredProducts = recentlyViewed.value.filter(
          (p) => p.slug !== productSlug
        );
        
        // Add the product to the beginning of the array
        const updatedProducts = [productToAdd, ...filteredProducts].slice(0, maxItems);
        
        // Update state and localStorage
        recentlyViewed.value = updatedProducts;
        localStorage.setItem('recentlyViewedProducts', JSON.stringify(updatedProducts));
      }
    }
  },
  { immediate: true }
);

const clearRecentlyViewed = () => {
  recentlyViewed.value = [];
  localStorage.removeItem('recentlyViewedProducts');
};
</script>

<template>
  <div v-if="recentlyViewed.length > 0" class="recently-viewed mt-12 mb-16">
    <div class="container">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-medium text-gray-900">Recently Viewed</h2>
        <button 
          @click="clearRecentlyViewed" 
          class="text-sm text-gray-500 hover:text-blue-600 transition-colors duration-200"
        >
          Clear All
        </button>
      </div>
      
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        <NuxtLink 
          v-for="product in recentlyViewed" 
          :key="product.id" 
          :to="`/product/${product.slug}`"
          class="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col"
        >
          <div class="aspect-square bg-gray-50 overflow-hidden">
            <img 
              v-if="product.image" 
              :src="product.image" 
              :alt="product.name"
              class="w-full h-full object-cover object-center transform transition-transform duration-500 group-hover:scale-105"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
              No image
            </div>
          </div>
          <div class="p-3 flex-1 flex flex-col">
            <h3 class="text-sm font-medium text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
              {{ product.name }}
            </h3>
            <div class="mt-auto pt-2 text-sm font-medium text-gray-900" v-html="product.price"></div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.recently-viewed {
  position: relative;
}

.recently-viewed::before {
  content: '';
  position: absolute;
  top: -1rem;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, rgba(226,232,240,0) 0%, rgba(226,232,240,1) 50%, rgba(226,232,240,0) 100%);
}
</style> 
